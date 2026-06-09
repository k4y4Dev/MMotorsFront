import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';
import { User } from '../_models/user';
import { ActiveCaseResponse, CarCaseSummary } from '../_models/case-application-model';
import { CaseStatus } from '../_models/form-models';

@Injectable({
  providedIn: 'root',
})
export class CaseManagementService {

  
  private http = inject(HttpClient);
  readonly url = environment.apiUrl;
  public _activeCase = signal<ActiveCaseResponse | null>(null)

  getAllCases(): Observable<CarCaseSummary[]>{
    return this.http.get<CarCaseSummary[]>(`${this.url}/case/grouped`, { withCredentials: true })
  }

caseStatusPatcher(idCase: number | undefined, newStatus: CaseStatus): Observable<ActiveCaseResponse | null> {
  if (!idCase) return of(null);
  
  return this.http.patch<ActiveCaseResponse>(
    `${this.url}/case/${idCase}/status`,
    { status: newStatus },
    { withCredentials: true }
  ).pipe(
    catchError(() => of(null))
  );
}

  caseApplicationApplier(idCar: number | undefined): Observable<ActiveCaseResponse | null>{
    if (!idCar) return of(null);
    return this.http.post<ActiveCaseResponse>(`${this.url}/case/`, { car_id: idCar }, { withCredentials: true }).pipe(
      tap(
        res => this._activeCase.set(res)
      ),
      catchError(() => {
          this._activeCase.set(null);
          return of(null);
      })
    )
  }
  
  checkActiveCase(): Observable<ActiveCaseResponse | null> {

      return this.http.get<ActiveCaseResponse>(`${this.url}/case/me/active`, { withCredentials: true }).pipe(
        tap(
          res => this._activeCase.set(res)
        ),
        catchError(() => {
          this._activeCase.set(null);
          return of(null);
        })
      );
  }
  
}

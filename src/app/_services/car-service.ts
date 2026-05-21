import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ICarResponse, PaginatedCarResponse } from '../_models/icar';
import { CarFormModel } from '../_models/form-models';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private http = inject(HttpClient);
  readonly url = 'http://localhost:8000/api';

  // ✅ signal public de la liste
  carsSignal = signal<ICarResponse[]>([]);

  private currentSkip = signal<number>(0);
  private currentLimit = signal<number>(10);
  private hasMore = signal<boolean>(true)


  constructor() {
    this.loadCars(); // ← charge la liste au démarrage
  }

  // ✅ charge la liste et alimente le signal
  loadCars( skip = 0, limit = 10) {
    let params = new HttpParams()
      .set('skip', skip)
      .set('limit', limit);

    this.http.get<PaginatedCarResponse>(`${this.url}/cars`, {params}).subscribe(paginatedResponse => {
      console.log(paginatedResponse)
      this.carsSignal.set(paginatedResponse.cars);
      this.currentSkip.set(paginatedResponse.skip);
      this.currentLimit.set(paginatedResponse.limit);
      this.hasMore.set(paginatedResponse.has_more);


    });
  }

  getSignal(signalKey: 'currentSkip' | 'currentLimit' | 'hasMore') {
    const signalMap = { 
      currentSkip: this.currentSkip, 
      currentLimit: this.currentLimit, 
      hasMore: this.hasMore 
    };
    return signalMap[signalKey];
  }

  getCar(id_car: number | undefined): Observable<ICarResponse> {
    return this.http.get<ICarResponse>(`${this.url}/cars/${id_car}`);
  }

  deleteThisCar(id_car: number | undefined) {
    return this.http.delete<ICarResponse>(`${this.url}/cars/${id_car}`, { withCredentials: true }).pipe(
      tap(() => {
        // ✅ retire directement de la liste
        this.carsSignal.update(cars => cars.filter(car => car.id !== id_car));
      })
    );
  }

  createCar(car: CarFormModel): Observable<ICarResponse> {
    return this.http.post<ICarResponse>(`${this.url}/cars`, car, { withCredentials: true }).pipe(
      tap((newCar: ICarResponse) => {
        // ✅ ajoute directement à la liste
        this.carsSignal.update(cars => [...cars, newCar]);
      })
    );
  }

  updateCar(id_car: number | undefined, car: CarFormModel): Observable<ICarResponse> {
    return this.http.put<ICarResponse>(`${this.url}/cars/${id_car}`, car, { withCredentials: true }).pipe(
      tap((modifiedCar: ICarResponse) => {
        // ✅ remplace directement dans la liste
        this.carsSignal.update(cars => cars.map(c => c.id === id_car ? modifiedCar : c));
      })
    );
  }
}
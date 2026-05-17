import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ICar, ICarResponse } from '../_models/icar';
import { CarFormModel } from '../_models/form-models';

@Injectable({
  providedIn: 'root',
})
export class CarService {
    private http = inject(HttpClient)
    readonly url = 'http://localhost:8000/api'
    private _newCar = signal<ICarResponse | null>(null)
  // readonly url = environment.apiUrl;

  constructor(){}

  getAllCars(): Observable<ICarResponse[]> {
    return this.http.get<ICarResponse[]>(`${this.url}/cars`)
  }
  
  getCar(id_car: number | undefined): Observable<ICarResponse> {
    return this.http.get<ICarResponse>(`${this.url}/cars/${id_car}`)
  }

  createCar(car: CarFormModel): Observable<ICarResponse> {


    return this.http.post<ICarResponse>(`${this.url}/cars`, car, { withCredentials: true}).pipe(
      tap((response: ICarResponse) => {
        this._newCar.set(response)
        console.log(this._newCar())
      }

      )
    )
  }
  
}

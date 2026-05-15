import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICar } from '../_models/icar';

@Injectable({
  providedIn: 'root',
})
export class CarService {
    private http = inject(HttpClient)
    readonly url = 'http://127.0.0.1:8000/api'
  // readonly url = environment.apiUrl;

  constructor(){}

  getAllCars(): Observable<ICar[]> {
    return this.http.get<ICar[]>(`${this.url}/cars`)
  }
  
  getCar(id_car: number | undefined): Observable<ICar> {
    return this.http.get<ICar>(`${this.url}/cars/${id_car}`)
  }
  
}

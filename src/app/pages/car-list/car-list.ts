import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ICar, ICarResponse } from '../../_models/icar';
import { toSignal } from '@angular/core/rxjs-interop';
import { Card } from '../../parts/card/card';
import { CarService } from '../../_services/car-service';
import { Pagination } from '../../parts/pagination/pagination';

@Component({
  selector: 'app-car-list',
  imports: [
    Card,
    Pagination
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList {

  private readonly carService = inject(CarService)
  private router = inject(Router)

  readonly cars = this.carService.carsSignal;
  readonly limit = this.carService.carsSignal;
  readonly skip = this.carService.carsSignal;


  navigateToCar(idCar: number) {

      this.router.navigate(['/cars', idCar]);

  }
}

import { Component, inject, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ICar } from '../../_interfaces/icar';
import { toSignal } from '@angular/core/rxjs-interop';
import { Card } from '../../parts/card/card';
import { CarService } from '../../_services/car-service';

@Component({
  selector: 'app-car-list',
  imports: [
    Card
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})
export class CarList {

  private readonly carService = inject(CarService)
  private router = inject(Router)

  public cars: Signal<ICar[]>


  constructor(){
    this.cars = toSignal(this.carService.getAllCars()) as Signal<ICar[]>
  }

  navigateToCar(idCar: number) {

      this.router.navigate(['/cars', idCar]);

  }
}

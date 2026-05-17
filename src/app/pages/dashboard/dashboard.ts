import { Component, computed, inject, Signal, signal } from '@angular/core';
import { CarForm } from '../../parts/car-form/car-form';
import { Card } from '../../parts/card/card';
import { ICarResponse } from '../../_models/icar';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarService } from '../../_services/car-service';
import { DashboardService } from '../../_services/dashboard-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CarForm,
    Card
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

private carService = inject(CarService)
private dashService = inject(DashboardService)
readonly selectedTopic = computed(() => this.dashService.topicMenuGetter())
readonly carToEdit = computed(() => this.dashService.getPickedCar())

public _dashboardMenu = signal<string>("profile")
public cars: Signal<ICarResponse[]>



  constructor(){

    this.cars = toSignal(this.carService.getAllCars()) as Signal<ICarResponse[]>
  }

changeMenuTopic(topic: string) {
  this.dashService.topicMenuSetter(topic)
}

}

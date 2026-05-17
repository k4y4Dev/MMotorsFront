import { Injectable, signal } from '@angular/core';
import { ICarResponse } from '../_models/icar';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private _dashboardMenu = signal<string>("profile")
  private _pickedCar = signal<ICarResponse | null>(null)

  editCar(pickedCar: ICarResponse | null) {
    this._dashboardMenu.set("edit")
    this._pickedCar.set(pickedCar)
  }
  getPickedCar() {
    return this._pickedCar()
  }
  
  topicMenuSetter(topic: string) {
    this._dashboardMenu.set(topic)
  }
  topicMenuGetter() {
    return this._dashboardMenu()
  }
  
}

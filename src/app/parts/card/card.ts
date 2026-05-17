import { Component, inject, input } from '@angular/core';
import { ICar, ICarResponse } from '../../_models/icar';
import { Router } from '@angular/router';
import { DashboardService } from '../../_services/dashboard-service';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {

  private router = inject(Router);
  private dashService = inject(DashboardService)

  public urlPath:string = "" 

  carData = input.required<ICarResponse | null>()



  constructor(){
    this.urlPath = this.router.url
  }

  editThisCar(pickedCar:ICarResponse | null) {
    this.dashService.editCar(pickedCar)
  }

/*   indexSlide = input.required<string>()
 */

}

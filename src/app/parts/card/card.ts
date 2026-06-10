import { Component, inject, input, signal } from '@angular/core';
import { ICar, ICarResponse } from '../../_models/icar';
import { Router } from '@angular/router';
import { DashboardService } from '../../_services/dashboard-service';
import { CarService } from '../../_services/car-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {

  private router = inject(Router);
  private dashService = inject(DashboardService)
  private carService = inject(CarService)

  public urlPath:string = "" 

  carData = input.required<ICarResponse | null>()
  editMode = input.required<boolean>()

  _trade = signal<string>('')



  constructor(){
    this.urlPath = this.router.url
  }

  editThisCar(pickedCar:ICarResponse | null) {
    this.dashService.editCar(pickedCar)
  }
async deleteThisCar(pickedCar: ICarResponse | null) {

      try {


      await firstValueFrom(this.carService.deleteThisCar(pickedCar?.id));


      this.router.navigateByUrl('dashboard')
      this.dashService.topicMenuSetter('carList')
      } catch (error)  {
        return console.error();
        
      }
  }

async changeTrade(idCar: number | undefined, trade: string | undefined) {
  const newTrade = (trade === "buying") ? "leasing" : "buying";
  this._trade.set(newTrade);

  try{
    await firstValueFrom(
      this.carService.partialUpdateCar(idCar, { trade: newTrade })
  );
  } catch (error)  {
        return console.error();
        
      }

}
/*   indexSlide = input.required<string>()
 */

}

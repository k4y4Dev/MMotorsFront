import { Component, inject, signal } from '@angular/core';
import { CarService } from '../../_services/car-service';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {

  private carService = inject(CarService)

  private currentPage = signal<number>(1)
  readonly _currentPage = this.currentPage.asReadonly()

  readonly hasMorePages = this.carService.getSignal("hasMore");




  changePage(pageNumb: number){
    let skip = (pageNumb - 1) * 10
    this.currentPage.set(pageNumb)

    this.carService.loadCars(skip)
  }


}

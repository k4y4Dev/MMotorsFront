import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { CarForm } from '../../parts/car-form/car-form';
import { Card } from '../../parts/card/card';
import { ICarResponse } from '../../_models/icar';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarService } from '../../_services/car-service';
import { DashboardService } from '../../_services/dashboard-service';
import { Pagination } from '../../parts/pagination/pagination';
import { CarCaseSummary, CaseUserSummary } from '../../_models/case-application-model';
import { CaseManagementService } from '../../_services/case-management-service';
import { ClientCase } from '../../parts/client-case/client-case';

@Component({
  selector: 'app-dashboard',
  imports: [
    CarForm,
    Card,
    Pagination,
    ClientCase
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{

private carService = inject(CarService)
private dashService = inject(DashboardService)
private caseService = inject(CaseManagementService)
readonly selectedTopic = computed(() => this.dashService.topicMenuGetter())
readonly carToEdit = computed(() => this.dashService.getPickedCar())

public _dashboardMenu = signal<string>("profile")
readonly cars = this.carService.carsSignal;
public listDisplayed = signal<boolean>(false)
public openedCarId = signal<number | null>(null);

public casePerCar = signal<CarCaseSummary []>([])
public selectedCase = signal<CaseUserSummary | undefined>(undefined)
public selectedCarCase = signal<ICarResponse | null>(null)

ngOnInit(): void {
  this.caseService.getAllCases().subscribe({
      next: (response) => {
        // ← on stocke l'url S3 dans le formulaire
        /* this.uploadService.update(car => ({ ...car, image: response.url })); */
        this.casePerCar.set(response)
        console.log(this.casePerCar())
      },
      error: (err) => {
        console.error(err);
        this.casePerCar.set([]);
      }
  })
}

changeMenuTopic(topic: string) {
  this.dashService.topicMenuSetter(topic)
  this.selectedCase.set(undefined)
}

showList(carId: number) {

  this.openedCarId.set(this.openedCarId() === carId ? null : carId);
}

selectThisCase(selectedCase: CaseUserSummary, selectedCarCase: ICarResponse) {
  this.selectedCase.set(selectedCase)

  this.selectedCarCase.set(selectedCarCase)

  this.dashService.topicMenuSetter("")
}

triggerSentryTest() {
  throw new Error("Sentry Angular Test : Connexion Production OK !");
}

}

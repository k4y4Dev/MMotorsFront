import { Component, computed, inject, input, OnInit, Signal } from '@angular/core';
import { ICar, ICarResponse } from '../../_models/icar';
import { CarService } from '../../_services/car-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { CaseManagementService } from '../../_services/case-management-service';

@Component({
  selector: 'app-item-page',
  imports: [],
  templateUrl: './item-page.html',
  styleUrl: './item-page.scss',
})
export class ItemPage implements OnInit{

  private readonly carService = inject(CarService);
  private readonly caseService = inject(CaseManagementService);
  private router = inject(Router)

  // 1. On reçoit l'ID via l'URL
  public id = input<number>();
  public caseIsActive = computed(() => !!this.caseService._activeCase())

  // 2. On transforme l'Input (Signal) en Observable, 
  //    puis on appelle le service, et on re-transforme en Signal.
  public car:Signal<ICarResponse | undefined> = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.carService.getCar(id))
    )  
  );

ngOnInit(): void {
        this.caseService.checkActiveCase().subscribe();
}

public applyDemand(car: ICarResponse | undefined) {
  if (!car) return;

  this.router.navigate(['/profile'], {
    state: { carData: car } 
  });
}
}

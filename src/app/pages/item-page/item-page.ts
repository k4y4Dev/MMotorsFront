import { Component, computed, inject, input, Signal } from '@angular/core';
import { ICar } from '../../_models/icar';
import { CarService } from '../../_services/car-service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-item-page',
  imports: [],
  templateUrl: './item-page.html',
  styleUrl: './item-page.scss',
})
export class ItemPage {

  private readonly carService = inject(CarService);

  // 1. On reçoit l'ID via l'URL
  public id = input<number>();

  // 2. On transforme l'Input (Signal) en Observable, 
  //    puis on appelle le service, et on re-transforme en Signal.
  public car:Signal<ICar | undefined> = toSignal(
    toObservable(this.id).pipe(
      switchMap(id => this.carService.getCar(id))
    )  
  );
}

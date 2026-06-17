import { Injectable, signal } from '@angular/core';
import { ICarResponse } from '../_models/icar';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

    private selectedCar = signal<ICarResponse | undefined>(undefined);
    readonly _selectedCar = this.selectedCar.asReadonly()

    private hasAnActivCase = signal<boolean>(false)
    readonly _hasAnActivCase = this.hasAnActivCase.asReadonly()

    setSelectedCar(carData: ICarResponse) {
      
      this.selectedCar.set(carData);
    }

    unsetSelectedCar() {
        this.selectedCar.set(undefined);
    }

    setActivCase(isActiv: boolean) {
      this.hasAnActivCase.set(isActiv)
    }

  
}

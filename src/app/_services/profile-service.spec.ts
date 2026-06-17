import { TestBed } from '@angular/core/testing';
import { ProfileService } from './profile-service';
import { ICarResponse } from '../_models/icar';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfileService);
  });

  it('should set selected car', () => {
    const car: ICarResponse = {
      id: 1,
      name: 'Tesla',
      price: 35000,
      km: 1000,
      image: 'x.jpg',
      trade: 'buying'
    };

    service.setSelectedCar(car);

    expect(service._selectedCar()).toEqual(car);
  });

  it('should unset selected car', () => {
    const car: ICarResponse = {
      id: 1,
      name: 'Tesla',
      price: 35000,
      km: 1000,
      image: 'x.jpg',
      trade: 'buying'
    };

    service.setSelectedCar(car);
    service.unsetSelectedCar();

    expect(service._selectedCar()).toBeUndefined();
  });

  it('should set active case flag', () => {
    service.setActivCase(true);
    expect(service._hasAnActivCase()).toBe(true);
  });

  it('should set active case flag to false', () => {
    service.setActivCase(false);
    expect(service._hasAnActivCase()).toBe(false);
  });
});
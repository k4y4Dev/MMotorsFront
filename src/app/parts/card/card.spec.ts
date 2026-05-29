import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';
import { Router } from '@angular/router';
import { CarService } from '../../_services/car-service';
import { DashboardService } from '../../_services/dashboard-service';
import { ICarResponse } from '../../_models/icar';
import { of, throwError } from 'rxjs';
import { ComponentRef } from '@angular/core';

const mockCar: ICarResponse = {
  id: 1,
  name: 'Tesla Model 3',
  price: 35000,
  km: 15000,
  image: 'tesla.jpg',
  trade: 'buying',
};

describe('Card', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;
  let componentRef: ComponentRef<Card>;
  let routerMock: { url: string; navigateByUrl: ReturnType<typeof vi.fn> };
  let carServiceMock: {
    deleteThisCar: ReturnType<typeof vi.fn>;
    partialUpdateCar: ReturnType<typeof vi.fn>;
  };
  let dashServiceMock: {
    editCar: ReturnType<typeof vi.fn>;
    topicMenuSetter: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    routerMock = { url: '/', navigateByUrl: vi.fn() };
    carServiceMock = {
      deleteThisCar: vi.fn().mockReturnValue(of(mockCar)),
      partialUpdateCar: vi.fn().mockReturnValue(of({ ...mockCar, trade: 'leasing' })),
    };
    dashServiceMock = {
      editCar: vi.fn(),
      topicMenuSetter: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Card],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: CarService, useValue: carServiceMock },
        { provide: DashboardService, useValue: dashServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    // Input required
    componentRef.setInput('carData', mockCar);
    await fixture.whenStable();
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // Rendu
  // ──────────────────────────────────────────────
  describe('rendering', () => {
    it('should display car name', () => {
      fixture.detectChanges();
      const h3 = fixture.nativeElement.querySelector('h3');
      expect(h3.textContent.trim()).toBe('Tesla Model 3');
    });

    it('should display car trade', () => {
      fixture.detectChanges();
      const h4 = fixture.nativeElement.querySelector('h4');
      expect(h4.textContent.trim()).toBe('buying');
    });

    it('should display car price and km', () => {
      fixture.detectChanges();
      const lis = fixture.nativeElement.querySelectorAll('li');
      expect(lis[0].textContent.trim()).toBe('35000 $');
      expect(lis[1].textContent.trim()).toBe('15000 Km');
    });

    it('should set image src with car image', () => {
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector('img');
      expect(img.src).toContain('/assets/tesla.jpg');
    });

    it('should NOT show dashboard buttons when url is "/"', () => {
      fixture.detectChanges();
      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(0);
    });

    it('should show dashboard buttons when url is "/dashboard"', async () => {
      routerMock.url = '/dashboard';

      // Recrée le composant avec la nouvelle URL
      fixture = TestBed.createComponent(Card);
      componentRef = fixture.componentRef;
      componentRef.setInput('carData', mockCar);
      await fixture.whenStable();
      fixture.detectChanges();

      const buttons = fixture.nativeElement.querySelectorAll('button');
      expect(buttons.length).toBe(3);
      expect(buttons[0].textContent.trim()).toBe('Editer');
      expect(buttons[1].textContent.trim()).toBe('Supprimer');
      expect(buttons[2].textContent.trim()).toBe('Change Trade');
    });
  });

  // ──────────────────────────────────────────────
  // editThisCar()
  // ──────────────────────────────────────────────
  describe('editThisCar()', () => {
    it('should call dashService.editCar with carData', () => {
      component.editThisCar(mockCar);
      expect(dashServiceMock.editCar).toHaveBeenCalledWith(mockCar);
    });

    it('should call dashService.editCar with null', () => {
      component.editThisCar(null);
      expect(dashServiceMock.editCar).toHaveBeenCalledWith(null);
    });
  });

  // ──────────────────────────────────────────────
  // deleteThisCar()
  // ──────────────────────────────────────────────
  describe('deleteThisCar()', () => {
    it('should call carService.deleteThisCar with car id', async () => {
      await component.deleteThisCar(mockCar);
      expect(carServiceMock.deleteThisCar).toHaveBeenCalledWith(mockCar.id);
    });

    it('should navigate to dashboard after delete', async () => {
      await component.deleteThisCar(mockCar);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('dashboard');
    });

    it('should call dashService.topicMenuSetter with "carList" after delete', async () => {
      await component.deleteThisCar(mockCar);
      expect(dashServiceMock.topicMenuSetter).toHaveBeenCalledWith('carList');
    });

    it('should handle delete error gracefully', async () => {
      carServiceMock.deleteThisCar.mockReturnValue(throwError(() => new Error('Server error')));
      await expect(component.deleteThisCar(mockCar)).resolves.not.toThrow();
    });

    it('should handle null car gracefully', async () => {
      await expect(component.deleteThisCar(null)).resolves.not.toThrow();
    });
  });

  // ──────────────────────────────────────────────
  // changeTrade()
  // ──────────────────────────────────────────────
  describe('changeTrade()', () => {
    it('should toggle trade from buying to leasing', async () => {
      await component.changeTrade(1, 'buying');
      expect(component._trade()).toBe('leasing');
    });

    it('should toggle trade from leasing to buying', async () => {
      carServiceMock.partialUpdateCar.mockReturnValue(of({ ...mockCar, trade: 'buying' }));
      await component.changeTrade(1, 'leasing');
      expect(component._trade()).toBe('buying');
    });

    it('should call carService.partialUpdateCar with correct payload', async () => {
      await component.changeTrade(1, 'buying');
      expect(carServiceMock.partialUpdateCar).toHaveBeenCalledWith(1, { trade: 'leasing' });
    });

    it('should handle partialUpdateCar error gracefully', async () => {
      carServiceMock.partialUpdateCar.mockReturnValue(throwError(() => new Error('Server error')));
      await expect(component.changeTrade(1, 'buying')).resolves.not.toThrow();
    });

    it('should handle undefined id and trade gracefully', async () => {
      await expect(component.changeTrade(undefined, undefined)).resolves.not.toThrow();
    });
  });
});
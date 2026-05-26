import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarForm } from './car-form';
import { CarService } from '../../_services/car-service';
import { DashboardService } from '../../_services/dashboard-service';
import { Router } from '@angular/router';
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

describe('CarForm', () => {
  let component: CarForm;
  let fixture: ComponentFixture<CarForm>;
  let componentRef: ComponentRef<CarForm>;
  let carServiceMock: {
    createCar: ReturnType<typeof vi.fn>;
    updateCar: ReturnType<typeof vi.fn>;
  };
  let dashServiceMock: {
    topicMenuSetter: ReturnType<typeof vi.fn>;
  };
  let routerMock: {
    navigateByUrl: ReturnType<typeof vi.fn>;
  };

  const setupComponent = async (carData: ICarResponse | null = null) => {
    fixture = TestBed.createComponent(CarForm);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('carData', carData);
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    carServiceMock = {
      createCar: vi.fn().mockReturnValue(of(mockCar)),
      updateCar: vi.fn().mockReturnValue(of(mockCar)),
    };
    dashServiceMock = {
      topicMenuSetter: vi.fn(),
    };
    routerMock = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [CarForm],
      providers: [
        { provide: CarService, useValue: carServiceMock },
        { provide: DashboardService, useValue: dashServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should create', async () => {
    await setupComponent();
    expect(component).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // État initial (mode création — carData = null)
  // ──────────────────────────────────────────────
  describe('creation mode (carData = null)', () => {
    beforeEach(async () => await setupComponent(null));

    it('should initialize carFormModel with empty values', () => {
      expect(component.carFormModel()).toEqual({
        name: '',
        price: 0,
        km: 0,
        image: '',
      });
    });

    it('should set btnName to "Ajouter"', () => {
      expect(component.btnName()).toBe('Ajouter');
    });

    it('should render 4 inputs', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input');
      expect(inputs.length).toBe(4);
    });

    it('should render submit button with label "Ajouter cette voiture"', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent.trim()).toBe('Ajouter cette voiture');
    });

    it('should have submit button disabled when form is empty', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // État initial (mode édition — carData = mockCar)
  // ──────────────────────────────────────────────
  describe('edit mode (carData = mockCar)', () => {
    beforeEach(async () => await setupComponent(mockCar));

    it('should pre-fill carFormModel with car data', () => {
      expect(component.carFormModel()).toEqual({
        name: 'Tesla Model 3',
        price: 35000,
        km: 15000,
        image: 'tesla.jpg',
      });
    });

    it('should set btnName to "Modifier"', () => {
      expect(component.btnName()).toBe('Modifier');
    });

    it('should render submit button with label "Modifier cette voiture"', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.textContent.trim()).toBe('Modifier cette voiture');
    });
  });

  // ──────────────────────────────────────────────
  // Validation
  // ──────────────────────────────────────────────
  describe('validation', () => {
    beforeEach(async () => await setupComponent(null));

    const touchInput = async (input: Element) => {
      input.dispatchEvent(new Event('focus'));
      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };

    it('should show required error when name is touched and empty', async () => {
      const inputs = fixture.nativeElement.querySelectorAll('input');
      await touchInput(inputs[0]);

      const errors = fixture.nativeElement.querySelectorAll('span');
      const messages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(messages).toContain('Name is required');
    });

    it('should enable submit button when required fields are filled', async () => {
      const inputs = fixture.nativeElement.querySelectorAll('input');
      inputs[0].value = 'Renault Zoe';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = '20000';
      inputs[1].dispatchEvent(new Event('input'));
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(false);
    });
  });

  // ──────────────────────────────────────────────
  // submitForm() — mode création
  // ──────────────────────────────────────────────
  describe('submitForm() - creation mode', () => {
    beforeEach(async () => await setupComponent(null));

    const fillAndSubmit = async (el: HTMLElement) => {
      const inputs = el.querySelectorAll('input');
      inputs[0].value = 'Renault Zoe';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = '20000';
      inputs[1].dispatchEvent(new Event('input'));
      inputs[2].value = '5000';
      inputs[2].dispatchEvent(new Event('input'));
      inputs[3].value = 'renault.jpg';
      inputs[3].dispatchEvent(new Event('input'));
      await fixture.whenStable();

      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };

    it('should call carService.createCar when carData is null', async () => {
      await fillAndSubmit(fixture.nativeElement);
      expect(carServiceMock.createCar).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Renault Zoe' })
      );
      expect(carServiceMock.updateCar).not.toHaveBeenCalled();
    });

    it('should navigate to dashboard after creation', async () => {
      await fillAndSubmit(fixture.nativeElement);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('dashboard');
    });

    it('should call dashService.topicMenuSetter with "carList" after creation', async () => {
      await fillAndSubmit(fixture.nativeElement);
      expect(dashServiceMock.topicMenuSetter).toHaveBeenCalledWith('carList');
    });

    it('should handle createCar error gracefully', async () => {
      carServiceMock.createCar.mockReturnValue(throwError(() => new Error('Server error')));
      await expect(fillAndSubmit(fixture.nativeElement)).resolves.not.toThrow();
    });
  });

  // ──────────────────────────────────────────────
  // submitForm() — mode édition
  // ──────────────────────────────────────────────
  describe('submitForm() - edit mode', () => {
    beforeEach(async () => await setupComponent(mockCar));

    const fillAndSubmit = async (el: HTMLElement) => {
      const inputs = el.querySelectorAll('input');
      inputs[0].value = 'Tesla Model S';
      inputs[0].dispatchEvent(new Event('input'));
      await fixture.whenStable();

      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };

    it('should call carService.updateCar with car id when carData is set', async () => {
      await fillAndSubmit(fixture.nativeElement);
      expect(carServiceMock.updateCar).toHaveBeenCalledWith(
        mockCar.id,
        expect.objectContaining({ name: 'Tesla Model S' })
      );
      expect(carServiceMock.createCar).not.toHaveBeenCalled();
    });

    it('should navigate to dashboard after update', async () => {
      await fillAndSubmit(fixture.nativeElement);
      expect(routerMock.navigateByUrl).toHaveBeenCalledWith('dashboard');
    });

    it('should handle updateCar error gracefully', async () => {
      carServiceMock.updateCar.mockReturnValue(throwError(() => new Error('Server error')));
      await expect(fillAndSubmit(fixture.nativeElement)).resolves.not.toThrow();
    });
  });
});
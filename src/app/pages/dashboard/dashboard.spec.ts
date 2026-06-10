import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';

import { Dashboard } from './dashboard';
import { AuthService } from '../../_services/auth-service';
import { CarService } from '../../_services/car-service';
import { DashboardService } from '../../_services/dashboard-service';
import { CaseManagementService } from '../../_services/case-management-service';
import { ICarResponse } from '../../_models/icar';
import { CarCaseSummary, CaseUserSummary } from '../../_models/case-application-model';
import { environment } from '../../../environments/environment';

const mockCar: ICarResponse = {
  id: 1, name: 'Tesla', price: 35000, km: 15000, image: 'tesla.jpg', trade: 'buying',
};

const mockCase: CaseUserSummary = {
  case_id: 1,
  email: 'john@test.com',
  lastname: 'Doe',
  firstname: 'John',
  status: 'PENDING',
  created_at: new Date('2025-01-01'),
};

const mockCarCaseSummary: CarCaseSummary[] = [
  { car: mockCar, pending_count: 1, cases: [mockCase] },
];

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let httpTesting: HttpTestingController;

  let carServiceMock: { carsSignal: ReturnType<typeof signal> };
  let dashServiceMock: {
    topicMenuGetter: ReturnType<typeof vi.fn>;
    topicMenuSetter: ReturnType<typeof vi.fn>;
    getPickedCar: ReturnType<typeof vi.fn>;
  };
  let caseServiceMock: { getAllCases: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    carServiceMock = { carsSignal: signal([mockCar]) };
    dashServiceMock = {
      topicMenuGetter: vi.fn().mockReturnValue('profile'),
      topicMenuSetter: vi.fn(),
      getPickedCar: vi.fn().mockReturnValue(null),
    };
    caseServiceMock = {
      getAllCases: vi.fn().mockReturnValue(of(mockCarCaseSummary)),
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated: signal(false) } },
        { provide: CarService, useValue: carServiceMock },
        { provide: DashboardService, useValue: dashServiceMock },
        { provide: CaseManagementService, useValue: caseServiceMock },
      ],
    }).compileComponents();

    httpTesting = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => httpTesting.verify());

  // ─────────────────────────────────────────────
  // Création
  // ─────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // ngOnInit
  // ─────────────────────────────────────────────
  describe('ngOnInit()', () => {
    it('should load cases into casePerCar on success', () => {
      expect(caseServiceMock.getAllCases).toHaveBeenCalled();
      expect(component.casePerCar()).toEqual(mockCarCaseSummary);
    });

    it('should set casePerCar to [] on error', async () => {
      caseServiceMock.getAllCases.mockReturnValue(throwError(() => new Error('error')));

      // Recrée le composant pour rejouer ngOnInit avec la nouvelle valeur mockée
      fixture = TestBed.createComponent(Dashboard);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.casePerCar()).toEqual([]);
    });
  });

  // ─────────────────────────────────────────────
  // changeMenuTopic()
  // ─────────────────────────────────────────────
  describe('changeMenuTopic()', () => {
    it('should call topicMenuSetter with the given topic', () => {
      component.changeMenuTopic('carList');
      expect(dashServiceMock.topicMenuSetter).toHaveBeenCalledWith('carList');
    });

    it('should reset selectedCase to undefined', () => {
      component.selectedCase.set(mockCase);
      component.changeMenuTopic('profile');
      expect(component.selectedCase()).toBeUndefined();
    });
  });

  // ─────────────────────────────────────────────
  // showList()
  // ─────────────────────────────────────────────
  describe('showList()', () => {
    it('should set openedCarId to the given car id', () => {
      component.showList(1);
      expect(component.openedCarId()).toBe(1);
    });

    it('should toggle openedCarId to null when called with the same id', () => {
      component.openedCarId.set(1);
      component.showList(1);
      expect(component.openedCarId()).toBeNull();
    });

    it('should switch to a different car id', () => {
      component.openedCarId.set(1);
      component.showList(2);
      expect(component.openedCarId()).toBe(2);
    });
  });

  // ─────────────────────────────────────────────
  // selectThisCase()
  // ─────────────────────────────────────────────
  describe('selectThisCase()', () => {
    it('should set selectedCase', () => {
      component.selectThisCase(mockCase, mockCar);
      expect(component.selectedCase()).toEqual(mockCase);
    });

    it('should set selectedCarCase', () => {
      component.selectThisCase(mockCase, mockCar);
      expect(component.selectedCarCase()).toEqual(mockCar);
    });

    it('should call topicMenuSetter with empty string', () => {
      component.selectThisCase(mockCase, mockCar);
      expect(dashServiceMock.topicMenuSetter).toHaveBeenCalledWith('');
    });
  });
});
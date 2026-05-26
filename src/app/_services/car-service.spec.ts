import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CarService } from './car-service';
import { ICarResponse, PaginatedCarResponse } from '../_models/icar';
import { CarFormModel, FilterFormModel } from '../_models/form-models';

const mockCar: ICarResponse = {
  id: 1,
  name: 'Tesla Model 3',
  price: 35000,
  km: 15000,
  image: 'tesla.jpg',
  trade: 'buying',
};

const mockCar2: ICarResponse = {
  id: 2,
  name: 'BMW M3',
  price: 55000,
  km: 8000,
  image: 'bmw.jpg',
  trade: 'leasing',
};

const mockPaginatedResponse: PaginatedCarResponse = {
  cars: [mockCar, mockCar2],
  total: 2,
  skip: 0,
  limit: 10,
  has_more: false,
};

const emptyPaginatedResponse: PaginatedCarResponse = {
  cars: [],
  total: 0,
  skip: 0,
  limit: 10,
  has_more: false,
};

// ──────────────────────────────────────────────
// Suite principale (url = '/')
// ──────────────────────────────────────────────
describe('CarService', () => {
  let service: CarService;
  let httpTesting: HttpTestingController;

  const flushInitialLoad = (response = mockPaginatedResponse) => {
    const req = httpTesting.expectOne(r => r.url.includes('/api/cars'));
    req.flush(response);
  };

  beforeEach(() => {
    const routerSpy = { url: '/', navigateByUrl: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(CarService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should be created', () => {
    flushInitialLoad();
    expect(service).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // loadCars()
  // ──────────────────────────────────────────────
  describe('loadCars()', () => {
    it('should GET /api/cars and populate carsSignal', () => {
      flushInitialLoad();
      expect(service.carsSignal()).toEqual([mockCar, mockCar2]);
    });

    it('should update pagination signals after load', () => {
      flushInitialLoad();
      expect(service.getSignal('currentSkip')()).toBe(0);
      expect(service.getSignal('currentLimit')()).toBe(10);
      expect(service.getSignal('hasMore')()).toBe(false);
    });

    it('should NOT add trade param when url is "/"', () => {
      const req = httpTesting.expectOne(r => r.url.includes('/api/cars'));
      expect(req.request.params.has('trade')).toBe(false);
      req.flush(mockPaginatedResponse);
    });

    it('should apply km and price filters when set', () => {
      flushInitialLoad();

      const filters: Partial<FilterFormModel> = { km: 20000, price: 40000 };
      service.applyFilters(filters);

      const req = httpTesting.expectOne(r => r.url.includes('/api/cars'));
      expect(req.request.params.get('km_max')).toBe('20000');
      expect(req.request.params.get('price_max')).toBe('40000');
      req.flush(mockPaginatedResponse);
    });
  });

  // ──────────────────────────────────────────────
  // getCar()
  // ──────────────────────────────────────────────
  describe('getCar()', () => {
    it('should GET /api/cars/:id and return the car', () => {
      flushInitialLoad();

      service.getCar(1).subscribe(car => {
        expect(car).toEqual(mockCar);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/cars/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockCar);
    });
  });

  // ──────────────────────────────────────────────
  // createCar()
  // ──────────────────────────────────────────────
  describe('createCar()', () => {
    it('should POST /api/cars and add car to carsSignal', () => {
      flushInitialLoad();

      const newCarForm: CarFormModel = {
        name: 'Audi A4',
        price: 42000,
        km: 5000,
        image: 'audi.jpg',
      };
      const newCar: ICarResponse = { ...newCarForm, id: 3, trade: 'buying' };

      service.createCar(newCarForm).subscribe(car => {
        expect(car).toEqual(newCar);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/cars');
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      req.flush(newCar);

      expect(service.carsSignal()).toContain(newCar);
    });
  });

  // ──────────────────────────────────────────────
  // updateCar()
  // ──────────────────────────────────────────────
  describe('updateCar()', () => {
    it('should PUT /api/cars/:id and update carsSignal', () => {
      flushInitialLoad();

      const updatedForm: CarFormModel = {
        name: 'Tesla Model S',
        price: 35000,
        km: 15000,
        image: 'tesla.jpg',
      };
      const updatedCar: ICarResponse = { ...mockCar, name: 'Tesla Model S' };

      service.updateCar(1, updatedForm).subscribe(car => {
        expect(car).toEqual(updatedCar);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/cars/1');
      expect(req.request.method).toBe('PUT');
      expect(req.request.withCredentials).toBe(true);
      req.flush(updatedCar);

      const updated = service.carsSignal().find(c => c.id === 1);
      expect(updated?.name).toBe('Tesla Model S');
    });
  });

  // ──────────────────────────────────────────────
  // partialUpdateCar()
  // ──────────────────────────────────────────────
  describe('partialUpdateCar()', () => {
    it('should PATCH /api/cars/:id and update carsSignal', () => {
      flushInitialLoad();

      const patch = { price: 30000 };
      const patchedCar: ICarResponse = { ...mockCar, price: 30000 };

      service.partialUpdateCar(1, patch).subscribe(car => {
        expect(car).toEqual(patchedCar);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/cars/1');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.withCredentials).toBe(true);
      req.flush(patchedCar);

      const updated = service.carsSignal().find(c => c.id === 1);
      expect(updated?.price).toBe(30000);
    });
  });

  // ──────────────────────────────────────────────
  // deleteThisCar()
  // ──────────────────────────────────────────────
  describe('deleteThisCar()', () => {
    it('should DELETE /api/cars/:id and remove car from carsSignal', () => {
      flushInitialLoad();

      expect(service.carsSignal().length).toBe(2);

      service.deleteThisCar(1).subscribe();

      const req = httpTesting.expectOne('http://localhost:8000/api/cars/1');
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockCar);

      expect(service.carsSignal().length).toBe(1);
      expect(service.carsSignal().find(c => c.id === 1)).toBeUndefined();
    });
  });

  // ──────────────────────────────────────────────
  // getSignal()
  // ──────────────────────────────────────────────
  describe('getSignal()', () => {
    it('should return the correct signal for each key', () => {
      flushInitialLoad();
      expect(service.getSignal('currentSkip')).toBeDefined();
      expect(service.getSignal('currentLimit')).toBeDefined();
      expect(service.getSignal('hasMore')).toBeDefined();
    });
  });
});

// ──────────────────────────────────────────────
// Suite secondaire (url = '/leasing')
// ──────────────────────────────────────────────
describe('CarService with /leasing route', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    const routerSpy = { url: '/leasing', navigateByUrl: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    TestBed.inject(CarService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should add trade=leasing param on initial load', () => {
    const req = httpTesting.expectOne(r => r.url.includes('/api/cars'));
    expect(req.request.params.get('trade')).toBe('leasing');
    req.flush(emptyPaginatedResponse);
  });
});

// ──────────────────────────────────────────────
// Suite secondaire (url = '/buying')
// ──────────────────────────────────────────────
describe('CarService with /buying route', () => {
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    const routerSpy = { url: '/buying', navigateByUrl: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    TestBed.inject(CarService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should add trade=buying param on initial load', () => {
    const req = httpTesting.expectOne(r => r.url.includes('/api/cars'));
    expect(req.request.params.get('trade')).toBe('buying');
    req.flush(emptyPaginatedResponse);
  });
});
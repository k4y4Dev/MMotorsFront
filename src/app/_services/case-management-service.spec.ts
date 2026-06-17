import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CaseManagementService } from './case-management-service';
import { environment } from '../../environments/environment';
import { CarCaseSummary, ActiveCaseResponse } from '../_models/case-application-model';
import { CaseStatus } from '../_models/form-models';
import { DocLink } from '../_models/doc-link-model';

const baseUrl = environment.apiUrl;

const mockDocLink = {
  id: 1,
  user_id: 42,
  doc_type: 'doc1',
  doc_url: 'https://s3.example.com/doc1.pdf',
  created_at: new Date('2025-01-01'),
};

const mockCar = {
  id: 10,
  name: "Tesla Model 3",
  price: 35000,
  km: 15000,
  image: "tesla.jpg",
  trade: "buying",
};

const mockActiveCase: ActiveCaseResponse = {
  id: 1,
  user_id: 42,
  car: mockCar,
  status: CaseStatus.PENDING,
  doc_links: [mockDocLink],
  created_at: new Date("2025-01-01"),
  updated_at: new Date("2025-01-02"),
};

const mockCases: CarCaseSummary[] = [
  {
    car: mockCar,
    pending_count: 1,
    cases: [
      {
        case_id: 1,
        email: 'test@test.com',
        lastname: 'Doe',
        firstname: 'John',
        status: CaseStatus.PENDING,
        doc_links: [mockDocLink],
        created_at: new Date('2025-01-01'),
      },
    ],
  },
];

describe('CaseManagementService', () => {
  let service: CaseManagementService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(CaseManagementService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify(); // vérifie qu'aucun appel HTTP inattendu n'est resté en suspens
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ─────────────────────────────────────────────
  // getAllCases()
  // ─────────────────────────────────────────────
  describe('getAllCases()', () => {
    it('should GET /case/grouped and return cases', () => {
      let result: CarCaseSummary[] | undefined;
      service.getAllCases().subscribe(res => (result = res));

      const req = httpTesting.expectOne(`${baseUrl}/case/grouped`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockCases);

      expect(result).toEqual(mockCases);
    });
  });

  // ─────────────────────────────────────────────
  // caseStatusPatcher()
  // ─────────────────────────────────────────────
  describe('caseStatusPatcher()', () => {
    it('should PATCH /case/:id/status and return updated case', () => {
      let result: ActiveCaseResponse | null | undefined;
      service.caseStatusPatcher(1, CaseStatus.APPROVED).subscribe(res => (result = res));

      const req = httpTesting.expectOne(`${baseUrl}/case/1/status`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.body).toEqual({ status: CaseStatus.APPROVED });
      req.flush(mockActiveCase);

      expect(result).toEqual(mockActiveCase);
    });

    it('should return null when idCase is undefined', () => {
      let result: ActiveCaseResponse | null | undefined;
      service.caseStatusPatcher(undefined, CaseStatus.APPROVED).subscribe(res => (result = res));

      httpTesting.expectNone(`${baseUrl}/case/undefined/status`);
      expect(result).toBeNull();
    });

    it('should return null on HTTP error', () => {
      let result: ActiveCaseResponse | null | undefined;
      service.caseStatusPatcher(1, CaseStatus.APPROVED).subscribe(res => (result = res));

      const req = httpTesting.expectOne(`${baseUrl}/case/1/status`);
      req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

      expect(result).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // caseApplicationApplier()
  // ─────────────────────────────────────────────
  describe('caseApplicationApplier()', () => {
    it('should POST /case/ and return active case', () => {
      let result: ActiveCaseResponse | null | undefined;
      service.caseApplicationApplier(10).subscribe(res => (result = res));

      const req = httpTesting.expectOne(`${baseUrl}/case/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.body).toEqual({ car_id: 10 });
      req.flush(mockActiveCase);

      expect(result).toEqual(mockActiveCase);
    });

    it('should update _activeCase signal on success', () => {
      service.caseApplicationApplier(10).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/case/`);
      req.flush(mockActiveCase);

      expect(service._activeCase()).toEqual(mockActiveCase);
    });

    it('should return null when idCar is undefined', () => {
      let result: ActiveCaseResponse | null | undefined;
      service.caseApplicationApplier(undefined).subscribe(res => (result = res));

      httpTesting.expectNone(`${baseUrl}/case/`);
      expect(result).toBeNull();
    });

    it('should return null and reset _activeCase on HTTP error', () => {
      service._activeCase.set(mockActiveCase); // on part d'un état non-null

      service.caseApplicationApplier(10).subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/case/`);
      req.flush('error', { status: 400, statusText: 'Bad Request' });

      expect(service._activeCase()).toBeNull();
    });
  });

  // ─────────────────────────────────────────────
  // checkActiveCase()
  // ─────────────────────────────────────────────
  describe('checkActiveCase()', () => {
    it('should GET /case/me/active and return active case', () => {
      let result: ActiveCaseResponse | null | undefined;
      service.checkActiveCase().subscribe(res => (result = res));

      const req = httpTesting.expectOne(`${baseUrl}/case/me/active`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockActiveCase);

      expect(result).toEqual(mockActiveCase);
    });

    it('should update _activeCase signal on success', () => {
      service.checkActiveCase().subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/case/me/active`);
      req.flush(mockActiveCase);

      expect(service._activeCase()).toEqual(mockActiveCase);
    });

    it('should return null and reset _activeCase on HTTP error', () => {
      service._activeCase.set(mockActiveCase);

      service.checkActiveCase().subscribe();

      const req = httpTesting.expectOne(`${baseUrl}/case/me/active`);
      req.flush('error', { status: 401, statusText: 'Unauthorized' });

      expect(service._activeCase()).toBeNull();
    });
  });
});
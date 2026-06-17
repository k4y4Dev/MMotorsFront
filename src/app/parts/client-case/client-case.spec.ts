import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';

import { ClientCase } from './client-case';
import { CaseManagementService } from '../../_services/case-management-service';
import { CaseStatus } from '../../_models/form-models';
import { of } from 'rxjs';

describe('ClientCase', () => {
  let component: ClientCase;
  let fixture: ComponentFixture<ClientCase>;
  let componentRef: ComponentRef<ClientCase>;

  const caseManagementServiceMock = {
    caseStatusPatcher: vi.fn().mockReturnValue(of({}))
  };
  const uploadServiceMock = {
    getImage: vi.fn().mockReturnValue(of('https://fake-url.com/doc.jpg'))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCase],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CaseManagementService, useValue: caseManagementServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientCase);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    // Fournit les inputs obligatoires
    componentRef.setInput('caseData', {
      case_id: 'test-id',
      status: CaseStatus.PENDING,
    });
    componentRef.setInput('carData', null);

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selectedStatus from caseData', () => {
    expect(component.selectedStatus()).toBe(CaseStatus.PENDING);
  });

  it('confirmUpdate() should call caseStatusPatcher', () => {
    component.confirmUpdate();
    expect(caseManagementServiceMock.caseStatusPatcher).toHaveBeenCalledWith(
      'test-id',
      CaseStatus.PENDING
    );
  });
  it('should initialize and load docs', () => {
  fixture.componentRef.setInput('caseData', {
    case_id: 1,
    status: 'PENDING',
    email: 'test@test.com',
    doc_links: [
      { doc_type: 'doc1', doc_url: 'file1.jpg' }
    ]
  });

  fixture.componentRef.setInput('carData', {
    id: 1,
    name: 'Tesla',
    price: 1000,
    km: 100,
    image: 'x.jpg',
    trade: 'buy'
  });

  fixture.detectChanges();

});
  
});
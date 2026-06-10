import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentRef } from '@angular/core';

import { ClientCase } from './client-case';
import { CaseManagementService } from '../../_services/case-management-service';
import { CaseStatus } from '../../_models/form-models';

describe('ClientCase', () => {
  let component: ClientCase;
  let fixture: ComponentFixture<ClientCase>;
  let componentRef: ComponentRef<ClientCase>;

  const caseManagementServiceMock = {
    caseStatusPatcher: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
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
});
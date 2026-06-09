import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CarCaseSummary, CaseUserSummary } from '../../_models/case-application-model';
import { Card } from '../card/card';
import { CaseManagementService } from '../../_services/case-management-service';
import { ICarResponse } from '../../_models/icar';
import { CaseStatus } from '../../_models/form-models';

@Component({
  selector: 'app-client-case',
  imports: [
    Card
  ],
  templateUrl: './client-case.html',
  styleUrl: './client-case.scss',
})
export class ClientCase implements OnInit{

    private caseManagementservice = inject(CaseManagementService)

    caseData = input.required<CaseUserSummary | undefined>()
    carData = input.required<ICarResponse | null>()

    CaseStatus = CaseStatus;
    selectedStatus = signal<CaseStatus>(CaseStatus.PENDING);
    isUpdating = signal<boolean>(false);

    ngOnInit(): void {
        this.selectedStatus.set(this.caseData()?.status as CaseStatus);
    }

      onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as CaseStatus;
    this.selectedStatus.set(value);
  }

  confirmUpdate(): void {
    const caseId = this.caseData()?.case_id;
    const newStatus = this.selectedStatus();
    if (!caseId || !newStatus) return;

    this.isUpdating.set(true);
    this.caseManagementservice.caseStatusPatcher(caseId, newStatus).subscribe({
      next: () => this.isUpdating.set(false),
      error: () => this.isUpdating.set(false)
    });
  }

}

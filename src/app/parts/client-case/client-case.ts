import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CarCaseSummary, CaseUserSummary } from '../../_models/case-application-model';
import { Card } from '../card/card';
import { CaseManagementService } from '../../_services/case-management-service';
import { ICarResponse } from '../../_models/icar';
import { CaseStatus } from '../../_models/form-models';
import { UploadService } from '../../_services/upload-service';
import { DocLink } from '../../_models/doc-link-model';
import { catchError, forkJoin, Observable, of } from 'rxjs';
import { email } from '@angular/forms/signals';

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
    private uploadService = inject(UploadService);

    caseData = input.required<CaseUserSummary | undefined>()
    carData = input.required<ICarResponse | null>()

    docLinks = signal<DocLink[]>([]);
    docUrls = signal<Record<string, string>>({});
    
    CaseStatus = CaseStatus;
    selectedStatus = signal<CaseStatus>(CaseStatus.PENDING);
    isUpdating = signal<boolean>(false);

    tempSignal = signal<string | null>(null);

    ngOnInit(): void {
        this.selectedStatus.set(this.caseData()?.status as CaseStatus);
        this.docLinks.set(this.caseData()?.doc_links ?? [])

        const docs = this.docLinks();
        if (docs.length === 0) return;

        const requests: Record<string, Observable<string>> = {};
        docs.forEach(doc => {
            requests[doc.doc_type] = this.uploadService.getImage(doc.doc_url, this.caseData()?.email,doc.doc_type);
        });

      forkJoin(requests).subscribe({
          next: (urls) => {
              this.docUrls.set(urls);
              console.log(this.docUrls())
          }
      });       
      


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

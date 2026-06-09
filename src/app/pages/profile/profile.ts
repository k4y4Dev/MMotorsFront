import { Component, inject, OnInit, signal } from '@angular/core';
import { UploadService } from '../../_services/upload-service';
import { Router } from '@angular/router';
import { ICar, ICarResponse } from '../../_models/icar';
import { CaseManagementService } from '../../_services/case-management-service';
import { ActiveCaseResponse } from '../../_models/case-application-model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  private uploadService = inject(UploadService);
  private caseService = inject(CaseManagementService);
  private router = inject(Router);

  public selectedCar = signal<ICarResponse | undefined>(undefined);
  public carOnProcess =  signal<ICarResponse | undefined>(undefined);
  public activeCase = signal<ActiveCaseResponse | null>(null);
  
  imagePreview = signal<string | null>(null);
  isUploading = signal<boolean>(false);
  tempSignal = signal<string | null>(null);

  constructor() {
    // 👈 On récupère l'état de navigation obligatoirement dans le constructeur
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras.state as { carData: ICarResponse };
    
    if (state && state.carData) {
      this.selectedCar.set(state.carData);
    }
  }

  ngOnInit(): void {
    this.uploadService.getImage('55f57436-0f67-40b7-b8c6-3bc6d37c6fde.jpg').subscribe({
      next: (response) => {
        this.tempSignal.set(response)

      }
    })
      this.caseService.checkActiveCase().subscribe({
        next: (res) => {
          this.activeCase.set(res)
          this.carOnProcess.set(this.activeCase()?.car)
          console.log(this.activeCase())}
      });

      (this.caseService._activeCase())?this.selectedCar.set(undefined):''

  }

  uploadImage(event: Event) {
    
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Preview locale immédiate
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload vers S3 via FastAPI
    const formData = new FormData();
    formData.append('file', file);

    this.isUploading.set(true);
    this.uploadService.uploadImage(formData).subscribe({
      next: (response) => {
        // ← on stocke l'url S3 dans le formulaire
        /* this.uploadService.update(car => ({ ...car, image: response.url })); */
        this.tempSignal.set(response.url)

        this.isUploading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isUploading.set(false);
      }
    });
  }



  applicationSubmitter(answer: boolean) {
    if(!answer){
      this.selectedCar.set(undefined);
      return
    }
    
    //(this.activeCase())?this.carOnProcess.set(this.activeCase()?.car):this.carOnProcess.set(this.selectedCar())
    this.carOnProcess.set(this.selectedCar())
    this.caseService.caseApplicationApplier(this.selectedCar()?.id).subscribe()
    this.selectedCar.set(undefined)

  }
}
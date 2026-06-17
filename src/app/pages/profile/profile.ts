import { Component, ElementRef, inject, OnInit, Signal, signal, ViewChild } from '@angular/core';
import { UploadService } from '../../_services/upload-service';
import { Router } from '@angular/router';
import { ICar, ICarResponse } from '../../_models/icar';
import { CaseManagementService } from '../../_services/case-management-service';
import { ActiveCaseResponse } from '../../_models/case-application-model';
import { firstValueFrom, forkJoin, Observable, of, switchMap } from 'rxjs';
import { ProfileService } from '../../_services/profile-service';
import { DocLink } from '../../_models/doc-link-model';
import { AuthService } from '../../_services/auth-service';
import { UserProfile } from '../../_models/user';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  @ViewChild('fileUploader') fileUploader!:ElementRef;

  private uploadService = inject(UploadService);
  private caseService = inject(CaseManagementService);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  public selectedCar = this.profileService._selectedCar;
  public carOnProcess =  signal<ICarResponse | undefined>(undefined);
  public activeCase = signal<ActiveCaseResponse | null>(null);

  public userProfile = signal<UserProfile | null>(null);
  public userId = signal<number | undefined>(undefined);

  docLinks = signal<DocLink[]>([]);
  docUrls = signal<Record<string, string>>({});
  
  imagePreview1 = signal<string | null>(null);
  imagePreview2 = signal<string | null>(null);
  imagePreview3 = signal<string | null>(null);
  imagePreviews = {
    doc1: this.imagePreview1,
    doc2: this.imagePreview2,
    doc3: this.imagePreview3,
  };

  isUploading = signal<boolean>(false);
  tempSignal = signal<string | null>(null);

  private imageFile1 = signal<File | null>(null)
  private imageFile2 = signal<File | null>(null)
  private imageFile3 = signal<File | null>(null)
  private imageFiles = {
    doc1: this.imageFile1,
    doc2: this.imageFile2,
    doc3: this.imageFile3,
  };


  ngOnInit(): void {




    this.uploadService.getImage('3490fd91-34f5-4c9d-bc94-86805d005a21.jpg').subscribe({
      next: (response) => {
        this.tempSignal.set(response)

      }
    })
      this.caseService.checkActiveCase().subscribe({
        next: (res) => {
          this.activeCase.set(res)
          this.carOnProcess.set(this.activeCase()?.car)
          this.userId.set(this.activeCase()?.user_id)
      }
      });

      if(this.caseService._activeCase()) {
        this.profileService.unsetSelectedCar()
      }


        this.authService.checkAuthStatus().pipe(
          switchMap(user => {
            this.userProfile.set(user);
            this.docLinks.set(user?.doc_links ?? []);
          
            const docs = this.docLinks();
            if (docs.length === 0) return of({});
          
            const requests: Record<string, Observable<string>> = {};
            docs.forEach(doc => {
              requests[doc.doc_type] = this.uploadService.getImage(doc.doc_url, doc.doc_type);
            });
          
            return forkJoin(requests);
          })
        ).subscribe({
          next: (urls) => {
            this.docUrls.set(urls as Record<string, string>);
            console.log(this.docUrls());
          }
        });


  }

  presetImage(event: Event,  docType: 'doc1' | 'doc2' | 'doc3') {
    
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.imageFiles[docType].set(file);

    // Preview locale immédiate
    const reader = new FileReader();
    reader.onload = () => {
      
      this.imagePreviews[docType].set(reader.result as string);
    };
    reader.readAsDataURL(file);

  }

  uploadImage(event: Event, docType: 'doc1' | 'doc2' | 'doc3') {
    event.preventDefault()
        
    const file = this.imageFiles[docType]();
    if (!file) return;

    // Upload vers S3 via FastAPI
    const formData = new FormData();
    formData.append('file', file);

     this.isUploading.set(true);
     this.uploadService.uploadImage(docType ,formData).subscribe({
       next: (response) => {
         // ← on stocke l'url S3 dans le formulaire
         /* this.uploadService.update(car => ({ ...car, image: response.url })); */
         this.tempSignal.set(response.url)
 
         this.isUploading.set(false);
         this.imageFiles[docType].set(null)
         this.imagePreviews[docType].set(null)
         this.fileUploader.nativeElement.value = null
       },
       error: (err) => {
         console.error(err);
         this.isUploading.set(false);
       }
     });
  }

  applicationSubmitter(answer: boolean) {
    if(!answer){
      this.profileService.unsetSelectedCar();
      return
    }
    
    //(this.activeCase())?this.carOnProcess.set(this.activeCase()?.car):this.carOnProcess.set(this.selectedCar())
    this.carOnProcess.set(this.selectedCar())
    this.caseService.caseApplicationApplier(this.selectedCar()?.id).subscribe()
    this.profileService.unsetSelectedCar()

  }
}
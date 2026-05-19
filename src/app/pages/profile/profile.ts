import { Component, inject, OnInit, signal } from '@angular/core';
import { UploadService } from '../../_services/upload-service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit{
  private uploadService = inject(UploadService);
  
  imagePreview = signal<string | null>(null);
  isUploading = signal<boolean>(false);
  tempSignal = signal<string | null>(null);

  ngOnInit(): void {
    this.uploadService.getImage('55f57436-0f67-40b7-b8c6-3bc6d37c6fde.jpg').subscribe({
      next: (response) => {
        this.tempSignal.set(response)
        console.log(response)
      }
    })
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
}
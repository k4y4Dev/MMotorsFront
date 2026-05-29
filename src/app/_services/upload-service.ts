import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http = inject(HttpClient);
  readonly url = environment.apiUrl;


  uploadImage(formData: FormData): Observable<{ url: string }> {
  return this.http.post<{ url: string }>(`${this.url}/upload`, formData, {
    withCredentials: true
    // ⚠️ pas de Content-Type ici, Angular le gère automatiquement pour FormData
  });
}

/*   getImage(filename: string): Observable<{ url: string }> {
 */  getImage(filename: string): Observable<string> {
  return this.http.get<string >(`${this.url}/upload/${filename}`,  {
    withCredentials: true
    // ⚠️ pas de Content-Type ici, Angular le gère automatiquement pour FormData
  });
}
}

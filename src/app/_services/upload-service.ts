import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http = inject(HttpClient);
  readonly url = environment.apiUrl;


  uploadImage(doc_type: string, formData: FormData): Observable<{ url: string }> {
  let params = new HttpParams()
      .set('folder_name', "documents")
      .set('doc_type', doc_type)
  return this.http.post<{ url: string }>(`${this.url}/upload`, formData, {
    withCredentials: true,
    params
    // ⚠️ pas de Content-Type ici, Angular le gère automatiquement pour FormData
  });
}

/*   getImage(filename: string): Observable<{ url: string }> {*/  
  getImage(filename: string | null, normalUserEmail:string = "", doc_type:string = "doc1"): Observable<string> {
    let params = new HttpParams()
      .set('folderName', "documents")
      .set('normal_user_email', normalUserEmail)
      .set('doc_type', doc_type)

    return this.http.get<string >(`${this.url}/upload/${filename}`,  {
      withCredentials: true,
      params
    // ⚠️ pas de Content-Type ici, Angular le gère automatiquement pour FormData
  });
}
}

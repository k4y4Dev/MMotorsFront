import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginFormModel, RegisterFormModel } from '../_models/form-models';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiAuthResponse, User, UserProfile } from '../_models/user';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router)
  readonly url = environment.apiUrl;
  private _currentUser = signal<UserProfile | null>(null)
  readonly currentUser = this._currentUser.asReadonly()
  readonly isAuthenticated = computed(() => this.currentUser() !== null)
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin')

  userProfile = signal<UserProfile | null>(null)

register(registerFormModel: RegisterFormModel): Observable<User> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  const body = {
    email: registerFormModel.username,   // ← vérifie que ton modèle a bien "email" ou "username"
    password: registerFormModel.password,
    lastname: registerFormModel.lastname,
    firstname: registerFormModel.firstname,
    role: registerFormModel.role,
  };

  return this.http.post<UserProfile>(`${this.url}/users`, body, { headers, withCredentials: true })
    .pipe(
      tap((response: UserProfile) => {
        this._currentUser.set(response);
        this.router.navigateByUrl('');
      })
    );
}

  login (loginFormModel: LoginFormModel): Observable<ApiAuthResponse> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    });
    const body = new HttpParams()
      .set('username', loginFormModel.username)
      .set('password', loginFormModel.password)

    return this.http.post<ApiAuthResponse>(`${this.url}/users/token`, body.toString(), { headers, withCredentials: true }
    ).pipe(
        tap((response: ApiAuthResponse) => {

            this._currentUser.set(response.user);

            const road = (this.isAdmin())?'/dashboard':'/profile'
            this.router.navigateByUrl(road);


        })
      )
/*     return of(true).pipe(delay(4000)) */
    }

  logout(): Observable<any> {
      this._currentUser.set(null);
      this.router.navigateByUrl("/");
      return this.http.post(`${this.url}/users/logout`, {}, {
        withCredentials: true
    });

  }

  checkAuthStatus(): Observable<UserProfile | null> {

      return this.http.get<UserProfile>(`${this.url}/users/me`, { withCredentials: true }).pipe(
        tap(
          res => this._currentUser.set(res)
        ),
        catchError(() => {
          this._currentUser.set(null);
          return of(null);
        })
      );
  }

  getUser(user_id: number | undefined): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(`${this.url}/users/${user_id}`, { withCredentials: true }).pipe(
        tap(
          res => this.userProfile.set(res)
        ),
        catchError(() => {
          this.userProfile.set(null);
          return of(null);
        })
      );
  }
}

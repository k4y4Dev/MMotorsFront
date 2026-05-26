import { computed, inject, Injectable, signal } from '@angular/core';
import { LoginFormModel, RegisterFormModel } from '../_models/form-models';
import { catchError, delay, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ApiAuthResponse, User } from '../_models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router)
  private _currentUser = signal<User | null>(null)
  readonly currentUser = this._currentUser.asReadonly()
  readonly isAuthenticated = computed(() => this.currentUser() !== null)
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin')

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

  return this.http.post<User>(`http://localhost:8000/api/users`, body, { headers, withCredentials: true })
    .pipe(
      tap((response: User) => {
        this._currentUser.set(response);
        console.log(this._currentUser());
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

    return this.http.post<ApiAuthResponse>(`http://localhost:8000/api/users/token`, body.toString(), { headers, withCredentials: true }
    ).pipe(
        tap((response: ApiAuthResponse) => {

            this._currentUser.set(response.user);

            const road = (this.isAdmin())?'/dashboard':'/profile'
            this.router.navigateByUrl(road);


        })
      )
/*     return of(true).pipe(delay(4000)) */
    }

  logout(): void {
    //To develop ==> destruct cookie BE side
    this._currentUser.set(null);
    this.router.navigateByUrl("/");
  }

  checkAuthStatus(): Observable<User | null> {

      return this.http.get<User>(`http://localhost:8000/api/users/me`, { withCredentials: true }).pipe(
        tap(
          res => this._currentUser.set(res)
        ),
        catchError(() => {
          this._currentUser.set(null);
          return of(null);
        })
      );
  }
}

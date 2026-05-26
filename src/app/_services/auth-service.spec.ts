import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth-service';
import { LoginFormModel, RegisterFormModel } from '../_models/form-models';
import { ApiAuthResponse, User } from '../_models/user';

const mockUser: User = {
  email: 'test@test.com',
  firstname: 'John',
  lastname: 'Doe',
  role: 'user',
};

const mockAdmin: User = { ...mockUser, role: 'admin' };

const mockApiAuthResponse: ApiAuthResponse = {
  message: 'Login successful',
  user: mockUser,
};

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;
  let routerSpy: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerSpy = { navigateByUrl: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il ne reste aucune requête HTTP non consommée
    httpTesting.verify();
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // État initial des signaux
  // ──────────────────────────────────────────────
  describe('initial state', () => {
    it('currentUser should be null', () => {
      expect(service.currentUser()).toBeNull();
    });

    it('isAuthenticated should be false', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('isAdmin should be false', () => {
      expect(service.isAdmin()).toBe(false);
    });
  });

  // ──────────────────────────────────────────────
  // register()
  // ──────────────────────────────────────────────
  describe('register()', () => {
    const registerForm: RegisterFormModel = {
      username: 'test@test.com',
      password: 'secret',
      firstname: 'John',
      lastname: 'Doe',
      role: 'user',
    };

    it('should POST to /api/users and set currentUser', () => {
      service.register(registerForm).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(mockUser);

      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should redirect to home after register', () => {
      service.register(registerForm).subscribe();

      httpTesting.expectOne('http://localhost:8000/api/users').flush(mockUser);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('');
    });

    it('should propagate HTTP errors', () => {
      let error: any;
      service.register(registerForm).subscribe({ error: e => (error = e) });

      httpTesting
        .expectOne('http://localhost:8000/api/users')
        .flush('Unauthorized', { status: 400, statusText: 'Bad Request' });

      expect(error).toBeTruthy();
      expect(service.currentUser()).toBeNull();
    });
  });

  // ──────────────────────────────────────────────
  // login()
  // ──────────────────────────────────────────────
  describe('login()', () => {
    const loginForm: LoginFormModel = {
      username: 'test@test.com',
      password: 'secret',
    };

    it('should POST to /api/users/token and set currentUser', () => {
      service.login(loginForm).subscribe(res => {
        expect(res).toEqual(mockApiAuthResponse);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/users/token');
      expect(req.request.method).toBe('POST');
      expect(req.request.withCredentials).toBe(true);
      expect(req.request.headers.get('Content-Type')).toBe(
        'application/x-www-form-urlencoded'
      );
      req.flush(mockApiAuthResponse);

      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should redirect to /profile for a regular user', () => {
      service.login(loginForm).subscribe();

      httpTesting
        .expectOne('http://localhost:8000/api/users/token')
        .flush(mockApiAuthResponse);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/profile');
    });

    it('should redirect to /dashboard for an admin', () => {
      const adminResponse: ApiAuthResponse = { ...mockApiAuthResponse, user: mockAdmin };
      service.login(loginForm).subscribe();

      httpTesting
        .expectOne('http://localhost:8000/api/users/token')
        .flush(adminResponse);

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should propagate HTTP errors', () => {
      let error: any;
      service.login(loginForm).subscribe({ error: e => (error = e) });

      httpTesting
        .expectOne('http://localhost:8000/api/users/token')
        .flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(error).toBeTruthy();
      expect(service.currentUser()).toBeNull();
    });
  });

  // ──────────────────────────────────────────────
  // logout()
  // ──────────────────────────────────────────────
  describe('logout()', () => {
    it('should clear currentUser and redirect to /', () => {
      // On simule un utilisateur connecté
      service.login({ username: 'test@test.com', password: 'secret' }).subscribe();
      httpTesting
        .expectOne('http://localhost:8000/api/users/token')
        .flush(mockApiAuthResponse);

      service.logout();

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(routerSpy.navigateByUrl).toHaveBeenLastCalledWith('/');
    });
  });

  // ──────────────────────────────────────────────
  // checkAuthStatus()
  // ──────────────────────────────────────────────
  describe('checkAuthStatus()', () => {
    it('should GET /api/users/me and set currentUser on success', () => {
      service.checkAuthStatus().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpTesting.expectOne('http://localhost:8000/api/users/me');
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush(mockUser);

      expect(service.currentUser()).toEqual(mockUser);
    });

    it('should set currentUser to null and return null on error', () => {
      service.checkAuthStatus().subscribe(user => {
        expect(user).toBeNull();
      });

      httpTesting
        .expectOne('http://localhost:8000/api/users/me')
        .flush('Forbidden', { status: 403, statusText: 'Forbidden' });

      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
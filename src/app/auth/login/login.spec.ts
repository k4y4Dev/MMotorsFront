import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { AuthService } from '../../_services/auth-service';
import { of, throwError } from 'rxjs';
import { ApiAuthResponse } from '../../_models/user';
import { provideRouter } from '@angular/router';

const mockApiAuthResponse: ApiAuthResponse = {
  message: 'Login successful',
  user: {
    email: 'test@test.com',
    firstname: 'John',
    lastname: 'Doe',
    role: 'user',
  },
};

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      login: vi.fn().mockReturnValue(of(mockApiAuthResponse)),
    };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // État initial
  // ──────────────────────────────────────────────
  describe('initial state', () => {
    it('should initialize loginModel with empty fields', () => {
      expect(component.loginModel()).toEqual({ username: '', password: '' });
    });

    it('should render the form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should render email and password inputs', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input');
      expect(inputs.length).toBe(2);
      expect(inputs[0].type).toBe('email');
      expect(inputs[1].type).toBe('password');
    });

    it('should render submit button', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
      expect(button.textContent.trim()).toBe('Login');
    });

    it('should have submit button disabled when form is empty', async () => {
      await fixture.whenStable();
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(true);
    });
  });

  // ──────────────────────────────────────────────
  // Validation
  // ──────────────────────────────────────────────
  describe('validation', () => {
    const getInputs = (el: HTMLElement) => el.querySelectorAll('input');

    it('should show required error when username is touched and empty', async () => {
      const inputs = getInputs(fixture.nativeElement);
      inputs[0].dispatchEvent(new Event('focus'));
      inputs[0].dispatchEvent(new Event('blur'));
      await fixture.whenStable();

      const errors = fixture.nativeElement.querySelectorAll('span');
      const errorMessages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(errorMessages).toContain('Email is required');
    });

    it('should show email format error when username is invalid email', async () => {
      const inputs = getInputs(fixture.nativeElement);
      inputs[0].value = 'notanemail';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[0].dispatchEvent(new Event('blur'));
      await fixture.whenStable();

      const errors = fixture.nativeElement.querySelectorAll('span');
      const errorMessages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(errorMessages).toContain('Please enter a valid email address');
    });

    it('should show required error when password is touched and empty', async () => {
      const inputs = getInputs(fixture.nativeElement);
      inputs[1].dispatchEvent(new Event('focus'));
      inputs[1].dispatchEvent(new Event('blur'));
      await fixture.whenStable();

      const errors = fixture.nativeElement.querySelectorAll('span');
      const errorMessages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(errorMessages).toContain('Password is required');
    });

    it('should enable submit button when form is valid', async () => {
      const inputs = getInputs(fixture.nativeElement);
      inputs[0].value = 'test@test.com';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = 'secret123';
      inputs[1].dispatchEvent(new Event('input'));
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(false);
    });
  });

  // ──────────────────────────────────────────────
  // submitForm()
  // ──────────────────────────────────────────────
  describe('submitForm()', () => {
    const fillAndSubmit = async (el: HTMLElement, username: string, password: string) => {
      const inputs = el.querySelectorAll('input');
      inputs[0].value = username;
      inputs[0].dispatchEvent(new Event('input'));
      inputs[1].value = password;
      inputs[1].dispatchEvent(new Event('input'));
      await fixture.whenStable();

      const form = el.querySelector('form')!;
      form.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };

    it('should call authService.login with form values on submit', async () => {
      await fillAndSubmit(fixture.nativeElement, 'test@test.com', 'secret123');
      expect(authServiceMock.login).toHaveBeenCalledWith({
        username: 'test@test.com',
        password: 'secret123',
      });
    });

    it('should not call authService.login when form is invalid', async () => {
      const form = fixture.nativeElement.querySelector('form');
      form.dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      expect(authServiceMock.login).not.toHaveBeenCalled();
    });

    it('should handle login error gracefully', async () => {
      authServiceMock.login.mockReturnValue(throwError(() => new Error('Unauthorized')));

      // Ne doit pas throw
      await expect(
        fillAndSubmit(fixture.nativeElement, 'test@test.com', 'wrongpassword')
      ).resolves.not.toThrow();
    });
  });
});
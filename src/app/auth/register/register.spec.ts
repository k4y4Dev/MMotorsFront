import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Register } from './register';
import { AuthService } from '../../_services/auth-service';
import { of, throwError } from 'rxjs';
import { User } from '../../_models/user';

const mockUser: User = {
  email: 'test@test.com',
  firstname: 'John',
  lastname: 'Doe',
  role: 'user',
};

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceMock: { register: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      register: vi.fn().mockReturnValue(of(mockUser)),
    };

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
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
    it('should initialize registerModel with default values', () => {
      expect(component.registerModel()).toEqual({
        username: '',
        password: '',
        lastname: '',
        firstname: '',
        role: 'user',
      });
    });

    it('should render the form', () => {
      const form = fixture.nativeElement.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should render 4 inputs (email, password, lastname, firstname)', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input');
      expect(inputs.length).toBe(4);
    });

    it('should render inputs with correct types', () => {
      const inputs = fixture.nativeElement.querySelectorAll('input');
      expect(inputs[0].type).toBe('email');
      expect(inputs[1].type).toBe('password');
      expect(inputs[2].type).toBe('text');
      expect(inputs[3].type).toBe('text');
    });

    it('should render submit button with correct label', () => {
      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button).toBeTruthy();
      expect(button.textContent.trim()).toBe("S'inscrire");
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

    const touchInput = async (input: Element) => {
      input.dispatchEvent(new Event('focus'));
      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };

    it('should show required error when email is touched and empty', async () => {
      const inputs = getInputs(fixture.nativeElement);
      await touchInput(inputs[0]);

      const errors = fixture.nativeElement.querySelectorAll('span');
      const messages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(messages).toContain('Email is required');
    });

    it('should show email format error when email is invalid', async () => {
      const inputs = getInputs(fixture.nativeElement);
      inputs[0].value = 'notanemail';
      inputs[0].dispatchEvent(new Event('input'));
      inputs[0].dispatchEvent(new Event('blur'));
      await fixture.whenStable();

      const errors = fixture.nativeElement.querySelectorAll('span');
      const messages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(messages).toContain('Please enter a valid email address');
    });

    it('should show required error when password is touched and empty', async () => {
      const inputs = getInputs(fixture.nativeElement);
      await touchInput(inputs[1]);

      const errors = fixture.nativeElement.querySelectorAll('span');
      const messages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(messages).toContain('Password is required');
    });

    it('should show required error when lastname is touched and empty', async () => {
      const inputs = getInputs(fixture.nativeElement);
      await touchInput(inputs[2]);

      const errors = fixture.nativeElement.querySelectorAll('span');
      const messages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(messages).toContain('Your lastname is required');
    });

    it('should show required error when firstname is touched and empty', async () => {
      const inputs = getInputs(fixture.nativeElement);
      await touchInput(inputs[3]);

      const errors = fixture.nativeElement.querySelectorAll('span');
      const messages = Array.from(errors).map((e: any) => e.textContent.trim());
      expect(messages).toContain('Your password is required');
    });

    it('should enable submit button when all fields are valid', async () => {
      const inputs = getInputs(fixture.nativeElement);
      const values = ['test@test.com', 'secret123', 'Doe', 'John'];

      values.forEach((val, i) => {
        inputs[i].value = val;
        inputs[i].dispatchEvent(new Event('input'));
      });
      await fixture.whenStable();

      const button = fixture.nativeElement.querySelector('button[type="submit"]');
      expect(button.disabled).toBe(false);
    });
  });

  // ──────────────────────────────────────────────
  // submitForm()
  // ──────────────────────────────────────────────
  describe('submitForm()', () => {
    const fillAndSubmit = async (el: HTMLElement) => {
      const inputs = el.querySelectorAll('input');
      const values = ['test@test.com', 'secret123', 'Doe', 'John'];

      values.forEach((val, i) => {
        inputs[i].value = val;
        inputs[i].dispatchEvent(new Event('input'));
      });
      await fixture.whenStable();

      el.querySelector('form')!.dispatchEvent(new Event('submit'));
      await fixture.whenStable();
    };

    it('should call authService.register with form values on submit', async () => {
      await fillAndSubmit(fixture.nativeElement);

      expect(authServiceMock.register).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'test@test.com',
          password: 'secret123',
          lastname: 'Doe',
          firstname: 'John',
          role: 'user',
        })
      );
    });

    it('should not call authService.register when form is invalid', async () => {
      fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      expect(authServiceMock.register).not.toHaveBeenCalled();
    });

    it('should handle register error gracefully', async () => {
      authServiceMock.register.mockReturnValue(throwError(() => new Error('Server error')));

      await expect(fillAndSubmit(fixture.nativeElement)).resolves.not.toThrow();
    });
  });
});
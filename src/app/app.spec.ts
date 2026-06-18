import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { By } from '@angular/platform-browser';
import { AuthService } from './_services/auth-service';
import { provideRouter } from '@angular/router';
import { signal, computed } from '@angular/core';
import { Navbar } from './parts/navbar/navbar';

// ── Mock Navbar pour éviter ses dépendances ──
import { Component } from '@angular/core';
@Component({ selector: 'app-navbar', template: '', standalone: true })
class NavbarMock {}

describe('App', () => {
  let authServiceMock: {
    isAuthenticated: ReturnType<typeof vi.fn>;
    isAdmin: ReturnType<typeof vi.fn>;
    currentUser: ReturnType<typeof vi.fn>;
    checkAuthStatus: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    authServiceMock = {
      isAuthenticated: vi.fn().mockReturnValue(false),
      isAdmin: vi.fn().mockReturnValue(false),
      currentUser: vi.fn().mockReturnValue(null),
      checkAuthStatus: vi.fn().mockReturnValue({ subscribe: vi.fn() }),
    };

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
      ],
    })
    .overrideComponent(App, {
      remove: { imports: [Navbar] },
      add: { imports: [NavbarMock] },
    })
    .compileComponents();
  });

  // ──────────────────────────────────────────────
  // Vos tests existants — inchangés
  // ──────────────────────────────────────────────
  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Should have the menu closed at first', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const backdrop = fixture.debugElement.query(By.css('.backdrop'));

    expect(app.burgerStatus).toBe(false);
    expect(app.burgerStatus).not.toBe(true);
    expect(app.burgerStatus).toBeTypeOf('boolean');
    expect(app.burgerStatus).toBeDefined();

    expect(app.burgerIcon).toBe('fa-bars');
    expect(app.burgerIcon).not.toBe('fa-xmark');
    expect(app.burgerIcon).toBeTypeOf('string');
    expect(app.burgerIcon).toBeDefined();

    expect(backdrop).toBeNull();
  });

  it('Should open the menu with a click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const burgerBtn = fixture.debugElement.query(By.css('.burgerMenu'));

    burgerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.backdrop'));

    expect(app.burgerStatus).toBe(true);
    expect(app.burgerStatus).not.toBe(false);
    expect(app.burgerStatus).toBeDefined();

    expect(app.burgerIcon).toBe('fa-xmark');
    expect(app.burgerIcon).not.toBe('fa-bars');
    expect(app.burgerIcon).toBeTypeOf('string');
    expect(app.burgerIcon).toBeDefined();

    expect(document.body.classList).toContain('no-scroll');

    expect(backdrop).not.toBeNull();
  });

  it('Should close the menu after a click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    vi.useFakeTimers();

    app.burgerStatus = true;
    fixture.detectChanges();

    const burgerBtn = fixture.debugElement.query(By.css('.burgerMenu'));
    burgerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(app.burgerStatus).toBe(false);
    expect(app.burgerStatus).not.toBe(true);
    expect(app.burgerStatus).toBeTypeOf('boolean');
    expect(app.burgerStatus).toBeDefined();

    expect(app.burgerIcon).toBe('fa-bars');
    expect(app.burgerIcon).not.toBe('fa-xmark');
    expect(app.burgerIcon).toBeTypeOf('string');
    expect(app.burgerIcon).toBeDefined();

    expect(document.body.classList.contains('no-scroll')).toBeTruthy();
    vi.advanceTimersByTime(250);
    expect(document.body.classList.contains('no-scroll')).toBeFalsy();

    vi.useRealTimers();

    const backdrop = fixture.debugElement.query(By.css('.backdrop'));
    expect(backdrop).toBeNull();
  });

  // ──────────────────────────────────────────────
  // Nouveaux tests — loginLink computed
  // ──────────────────────────────────────────────
  describe('loginLink()', () => {
    it('should return "dashboard" when user is admin', () => {
      authServiceMock.isAdmin.mockReturnValue(true);
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.loginLink()).toBe('dashboard');
    });

    it('should return "login" when user is not authenticated', () => {
      authServiceMock.isAuthenticated.mockReturnValue(false);
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.loginLink()).toBe('login');
    });

    it('should return "profile" when user is authenticated', () => {
      authServiceMock.isAuthenticated.mockReturnValue(true);
      const fixture = TestBed.createComponent(App);
      const app = fixture.componentInstance;
      expect(app.loginLink()).toBe('profile');
    });

  });
});
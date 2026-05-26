import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { adminGuardGuard } from './admin-guard-guard';
import { AuthService } from '../_services/auth-service';

describe('adminGuardGuard', () => {
  let authServiceMock: { isAuthenticated: ReturnType<typeof vi.fn>; isAdmin: ReturnType<typeof vi.fn> };
  let routerMock: { createUrlTree: ReturnType<typeof vi.fn> };

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuardGuard(...guardParameters));

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated: vi.fn(),
      isAdmin: vi.fn(),
    };

    routerMock = {
      createUrlTree: vi.fn().mockReturnValue({ toString: () => '/login' } as unknown as UrlTree),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // Accès autorisé
  // ──────────────────────────────────────────────
  it('should return true when user is authenticated AND admin', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.isAdmin.mockReturnValue(true);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBe(true);
    expect(routerMock.createUrlTree).not.toHaveBeenCalled();
  });

  // ──────────────────────────────────────────────
  // Accès refusé
  // ──────────────────────────────────────────────
  it('should redirect to /login when user is NOT authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.isAdmin.mockReturnValue(false);

    const result = executeGuard({} as any, {} as any);

    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to /login when user is authenticated but NOT admin', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);
    authServiceMock.isAdmin.mockReturnValue(false);

    const result = executeGuard({} as any, {} as any);

    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to /login when user is admin but NOT authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);
    authServiceMock.isAdmin.mockReturnValue(true);

    const result = executeGuard({} as any, {} as any);

    expect(result).not.toBe(true);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });
});
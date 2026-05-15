import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../_services/auth-service';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router)

  return (authService.isAuthenticated() && authService.isAdmin())? true : router.createUrlTree(['/login']);
};

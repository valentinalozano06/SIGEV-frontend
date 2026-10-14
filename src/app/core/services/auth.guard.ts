import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// UI navigation only. Authorization must be enforced by the future backend.
export const sessionGuard: CanActivateFn = () =>
  inject(AuthService).currentUser() !== null || inject(Router).createUrlTree(['/login']);

export const roleGuard: CanActivateChildFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.currentUser()) return router.createUrlTree(['/login']);
  return auth.canAccess(route.routeConfig?.path || 'dashboard') || router.createUrlTree(['/dashboard']);
};

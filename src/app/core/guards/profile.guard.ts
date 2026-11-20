import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const profileGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.currentUser();
if (user && (!user.isProfileComplete || !user.name || !user.habits)) {
  return router.parseUrl('/onboarding');
}  return true;
};
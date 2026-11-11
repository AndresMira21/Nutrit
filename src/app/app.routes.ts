import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'onboarding', loadComponent: () => import('./features/onboarding/onboarding').then(m => m.Onboarding), canActivate: [authGuard] },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard), canActivate: [authGuard, profileGuard] },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
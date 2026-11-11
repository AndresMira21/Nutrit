import { Injectable, signal, effect } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.loadUserFromStorage());

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) localStorage.setItem('nutrit_user', JSON.stringify(user));
      else localStorage.removeItem('nutrit_user');
    });
  }

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem('nutrit_user');
    return stored ? JSON.parse(stored) : null;
  }

  login(email: string, password: string): boolean {
  if (email === 'admin@nutrit.com' && password === '123456') {
    this.currentUser.set({
      id: 1,
      name: '',            
      email,
      weight: 0,
      height: 0,
      age: 0,
      gender: 'male',
      isProfileComplete: false
    });
    return true;
  }
  return false;
}

  updateProfile(data: Partial<User>): void {
    this.currentUser.update(user => user ? { ...user, ...data, isProfileComplete: true } : null);
  }
}
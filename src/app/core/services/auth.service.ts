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

  private getUsersDB(): any[] {
    return JSON.parse(localStorage.getItem('nutrit_users_db') || '[]');
  }

  register(email: string, password: string): boolean {
    const users = this.getUsersDB();
    if (users.find(u => u.email === email)) return false;
    
    users.push({ email, password });
    localStorage.setItem('nutrit_users_db', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    let isValid = false;
    
    if (email === 'admin@nutrit.com' && password === '123456') {
      isValid = true;
    } else {
      const user = this.getUsersDB().find(u => u.email === email && u.password === password);
      if (user) isValid = true;
    }

    if (isValid) {
      this.currentUser.set({
        id: Date.now(), name: '', email: email, 
        weight: 0, height: 0, age: 0, gender: 'male', isProfileComplete: false
      });
      return true;
    }
    return false;
  }

  updateProfile(data: Partial<User>): void {
    this.currentUser.update(user => user ? { ...user, ...data, isProfileComplete: true } : null);
  }

  logout(): void {
    this.currentUser.set(null);
  }
}
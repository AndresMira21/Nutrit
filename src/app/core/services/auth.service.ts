import { Injectable, signal, effect } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(this.loadUserFromStorage());

  constructor() {
    const existingUser = this.currentUser();

    if (existingUser?.isProfileComplete) {
      this.saveProfileForAccount(existingUser);
  }
    effect(() => {
      const user = this.currentUser();
      if (user) localStorage.setItem('nutrit_user', JSON.stringify(user));
      else localStorage.removeItem('nutrit_user');
    });
  }


private saveProfileForAccount(user: User): void {
  const key = `nutrit_profile_${user.email.toLowerCase()}`;

  localStorage.setItem(key, JSON.stringify(user));
}

private loadProfileForAccount(email: string): User | null {
  const key = `nutrit_profile_${email.toLowerCase()}`;

  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as User : null;
  } catch {
    return null;
  }
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
    const user = this.getUsersDB().find(
      u => u.email === email && u.password === password
    );

    if (user) isValid = true;
  }

  if (!isValid) return false;

  const savedProfile = this.loadProfileForAccount(email);

  if (savedProfile) {
    this.currentUser.set(savedProfile);
  } else {
    this.currentUser.set({
      id: Date.now(),
      name: '',
      email,
      weight: 0,
      height: 0,
      age: 0,
      gender: 'male',
      isProfileComplete: false
    });
  }

  return true;
}

  
updateProfile(data: Partial<User>): void {
  this.currentUser.update(user => user ? {
    ...user,
    ...data,
    startingWeight: user.startingWeight ?? data.weight ?? user.weight,
    isProfileComplete: true
  } : null);

  const updatedUser = this.currentUser();

  if (updatedUser) {
    this.saveProfileForAccount(updatedUser);
  }
}


  
updateWeight(weight: number): void {
  this.currentUser.update(user => user ? {
    ...user,
    startingWeight: user.startingWeight ?? user.weight,
    weight
  } : null);

  const updatedUser = this.currentUser();

  if (updatedUser) {
    this.saveProfileForAccount(updatedUser);
  }
}


  logout(): void {
    this.currentUser.set(null);
  }
}

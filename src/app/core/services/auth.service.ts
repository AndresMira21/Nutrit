import { Injectable, signal, effect } from '@angular/core';
import { User } from '../models/user.model';

interface LocalAccount {
  email: string;
  password: string;
}

const demoEmail = 'admin@nutrit.com';
const normalizeEmail = (email: string) => email.trim().toLowerCase();

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
    const key = `nutrit_profile_${normalizeEmail(user.email)}`;

    localStorage.setItem(key, JSON.stringify(user));
  }

  private loadProfileForAccount(email: string): User | null {
    const key = `nutrit_profile_${email.toLowerCase()}`;

    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  }

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem('nutrit_user');
    if (!stored) return null;

    const user: User = JSON.parse(stored);
    const email = normalizeEmail(user.email);
    return this.getUsersDB().filter((account) => normalizeEmail(account.email) === email).length > 1
      ? null
      : { ...user, email };
  }

  private getUsersDB(): LocalAccount[] {
    return JSON.parse(localStorage.getItem('nutrit_users_db') || '[]');
  }

  register(email: string, password: string): boolean {
    email = normalizeEmail(email);
    const users = this.getUsersDB();
    if (
      !email ||
      email === demoEmail ||
      users.some((user) => normalizeEmail(user.email) === email)
    ) {
      return false;
    }

    users.push({ email, password });
    localStorage.setItem('nutrit_users_db', JSON.stringify(users));
    return true;
  }

  login(email: string, password: string): boolean {
    email = normalizeEmail(email);
    const matches = this.getUsersDB().filter((user) => normalizeEmail(user.email) === email);
    // Las cuentas duplicadas antiguas comparten las claves de datos y no se pueden separar automáticamente.
    if (matches.length > 1) return false;

    const account = matches[0];
    const valid = email === demoEmail ? password === '123456' : account?.password === password;
    if (!email || !valid) return false;

    const savedProfile =
      this.loadProfileForAccount(email) ??
      (account ? this.loadProfileForAccount(account.email) : null);

    if (savedProfile) {
      this.currentUser.set({ ...savedProfile, email });
    } else {
      this.currentUser.set({
        id: Date.now(),
        name: '',
        email,
        weight: 0,
        height: 0,
        age: 0,
        gender: 'male',
        isProfileComplete: false,
      });
    }

    return true;
  }

  updateProfile(data: Partial<User>): void {
    this.currentUser.update((user) =>
      user
        ? {
            ...user,
            ...data,
            startingWeight: user.startingWeight ?? data.weight ?? user.weight,
            isProfileComplete: true,
          }
        : null,
    );

    const updatedUser = this.currentUser();

    if (updatedUser) {
      this.saveProfileForAccount(updatedUser);
    }
  }

  updateWeight(weight: number): void {
    this.currentUser.update((user) =>
      user
        ? {
            ...user,
            startingWeight: user.startingWeight ?? user.weight,
            weight,
          }
        : null,
    );

    const updatedUser = this.currentUser();

    if (updatedUser) {
      this.saveProfileForAccount(updatedUser);
    }
  }

  logout(): void {
    this.currentUser.set(null);
  }
}

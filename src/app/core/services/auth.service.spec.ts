import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('normaliza el correo al registrar e iniciar sesión', () => {
    const auth = TestBed.inject(AuthService);

    expect(auth.register('  María@Example.test ', 'secreto')).toBe(true);
    expect(auth.register('maría@EXAMPLE.test', 'otra-clave')).toBe(false);
    expect(auth.register('ADMIN@nutrit.com', 'otra-clave')).toBe(false);
    expect(JSON.parse(localStorage.getItem('nutrit_users_db')!)[0].email).toBe(
      'maría@example.test',
    );
    expect(auth.login('MARÍA@example.TEST', 'incorrecta')).toBe(false);
    expect(auth.login(' MARÍA@example.TEST ', 'secreto')).toBe(true);
    expect(auth.currentUser()?.email).toBe('maría@example.test');
  });

  it('recupera el perfil de una cuenta antigua con mayúsculas y espacios', () => {
    localStorage.setItem(
      'nutrit_users_db',
      JSON.stringify([{ email: ' Ana@Example.test ', password: 'secreto' }]),
    );
    const stored = JSON.stringify({
      id: 1,
      name: 'Ana',
      email: ' Ana@Example.test ',
      weight: 70,
      isProfileComplete: true,
    });
    localStorage.setItem('nutrit_profile_ ana@example.test ', stored);

    const auth = TestBed.inject(AuthService);
    expect(auth.register('ana@example.test', 'otra-clave')).toBe(false);
    expect(auth.login('ana@example.test', 'secreto')).toBe(true);
    expect(auth.currentUser()).toMatchObject({ id: 1, name: 'Ana', email: 'ana@example.test' });
    expect(localStorage.getItem('nutrit_profile_ ana@example.test ')).toBe(stored);
  });

  it('impide acceder a datos compartidos por cuentas antiguas con el mismo correo normalizado', () => {
    const accounts = JSON.stringify([
      { email: 'Ana@example.test', password: 'primera' },
      { email: 'ana@example.test', password: 'segunda' },
    ]);
    localStorage.setItem('nutrit_users_db', accounts);
    localStorage.setItem('nutrit_user', JSON.stringify({ email: 'Ana@example.test' }));
    const auth = TestBed.inject(AuthService);

    expect(auth.login('Ana@example.test', 'primera')).toBe(false);
    expect(auth.login('ana@example.test', 'segunda')).toBe(false);
    expect(auth.currentUser()).toBeNull();
    expect(localStorage.getItem('nutrit_users_db')).toBe(accounts);
  });
});

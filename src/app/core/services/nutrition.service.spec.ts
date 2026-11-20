import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AuthService } from './auth.service';
import { DailyActivityService } from './daily-activity.service';
import { NutritionService } from './nutrition.service';

describe('NutritionService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.setSystemTime(new Date(2026, 10, 19, 23, 59));
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('recalcula al cambiar de día sin alterar las comidas previas ni sin fecha', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.login('admin@nutrit.com', '123456')).toBe(true);
    const history = [
      { id: 1, name: 'Comida anterior', kcal: 100, consumedOn: '2026-11-18' },
      { id: 2, name: 'Comida sin fecha', kcal: 200 },
      { id: 3, name: 'Comida de hoy', kcal: 300, consumedOn: '2026-11-19' },
    ];
    const key = 'nutrit_foods_admin@nutrit.com';
    localStorage.setItem(key, JSON.stringify(history));

    const nutrition = TestBed.inject(NutritionService);
    const activity = TestBed.inject(DailyActivityService);
    expect(nutrition.todayKcal()).toBe(300);

    vi.setSystemTime(new Date(2026, 10, 20, 0, 1));
    activity.refreshToday();
    expect(nutrition.todayKcal()).toBe(0);
    expect(nutrition.foods()).toEqual(history);
    expect(localStorage.getItem(key)).toBe(JSON.stringify(history));

    nutrition.addFood({ name: 'Desayuno', grams: 50, kcal: 150 });
    expect(nutrition.todayKcal()).toBe(150);
    expect(nutrition.foods().at(-1)?.consumedOn).toBe('2026-11-20');
  });

  it('mantiene separadas comidas, agua y pasos al cambiar de cuenta', () => {
    const auth = TestBed.inject(AuthService);
    const nutrition = TestBed.inject(NutritionService);
    const activity = TestBed.inject(DailyActivityService);

    auth.register('Uno@example.test', 'secreto');
    auth.register('Dos@example.test', 'secreto');
    expect(auth.login('UNO@example.test', 'secreto')).toBe(true);
    nutrition.addFood({ name: 'Manzana', grams: 100, kcal: 52 });
    activity.addRecord('water', 250);
    activity.addRecord('steps', 500);
    auth.logout();

    expect(auth.login('dos@example.test', 'secreto')).toBe(true);
    expect(nutrition.todayKcal()).toBe(0);
    expect(nutrition.foods()).toEqual([]);
    expect(activity.waterMl()).toBe(0);
    expect(activity.steps()).toBe(0);
    nutrition.addFood({ name: 'Pera', grams: 100, kcal: 57 });
    auth.logout();

    expect(auth.login('uno@example.test', 'secreto')).toBe(true);
    expect(nutrition.todayKcal()).toBe(52);
    expect(activity.waterMl()).toBe(250);
    expect(activity.steps()).toBe(500);
    expect(nutrition.foods().map((food) => food.name)).toEqual(['Manzana']);
  });
});

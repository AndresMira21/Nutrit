import { Injectable, signal, computed, effect } from '@angular/core';
import { Food, FoodEntry } from '../models/food.model';
import { Achievement } from '../models/achievement.model';

const FOODS_STORAGE_KEY = 'nutrit_foods';

const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

@Injectable({ providedIn: 'root' })
export class NutritionService {
  water = signal('1.2L');
  steps = signal('4.5k');
  foods = signal<Food[]>(this.loadFoods());
  todayKcal = computed(() => {
    const today = localDateKey();
    return this.foods()
      .filter(food => food.consumedOn === today)
      .reduce((total, food) => total + food.kcal, 0);
  });
  achievements = signal<Achievement[]>([
    { id: 1, icon: '🏆', name: 'Racha de 7 días' },
    { id: 2, icon: '⚖️', name: 'Primera meta de peso' }
  ]);

  constructor() {
    effect(() => localStorage.setItem(FOODS_STORAGE_KEY, JSON.stringify(this.foods())));
  }

  addFood(entry: FoodEntry) {
    this.foods.update(current => {
      const id = current.reduce((nextId, food) => Math.max(nextId, food.id + 1), Date.now());
      return [...current, { id, ...entry, consumedOn: localDateKey() }];
    });
  }

  deleteFood(id: number) { this.foods.update(current => current.filter(f => f.id !== id)); }

  private loadFoods(): Food[] {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(FOODS_STORAGE_KEY) ?? '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }
}

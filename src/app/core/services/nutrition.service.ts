
import { Injectable, signal, computed, inject } from '@angular/core';
import { Food, FoodEntry } from '../models/food.model';
import { Achievement } from '../models/achievement.model';
import { AuthService } from './auth.service';
import { DailyActivityService } from './daily-activity.service';

@Injectable({
  providedIn: 'root'
})
export class NutritionService {

  // Inyección del servicio de autenticación.
  private auth = inject(AuthService);
  private readonly activity = inject(DailyActivityService);

  // Permite notificar a las Signals cuando cambia el almacenamiento.
  private foodsRevision = signal(0);

  // Indicadores existentes del dashboard.
  water = signal('1.2L');
  steps = signal('4.5k');

  // Logros existentes.
  achievements = signal<Achievement[]>([
    { id: 1, icon: '🏆', name: 'Racha de 7 días' },
    { id: 2, icon: '⚖️', name: 'Primera meta de peso' }
  ]);

  // Construye una clave exclusiva para cada cuenta.
  private getFoodStorageKey(): string | null {
    const user = this.auth.currentUser();

    if (!user?.email) {
      return null;
    }

    return `nutrit_foods_${user.email.trim().toLowerCase()}`;
  }

  // Recupera únicamente las comidas de la cuenta indicada.
  private loadFoods(key: string): Food[] {
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem(key) ?? '[]'
      );

      return Array.isArray(stored) ? stored as Food[] : [];
    } catch {
      return [];
    }
  }

  // Lista reactiva de alimentos de la sesión actual.
  foods = computed<Food[]>(() => {
    this.foodsRevision();

    const key = this.getFoodStorageKey();

    if (!key) {
      return [];
    }

    return this.loadFoods(key);
  });

  // Suma las calorías consumidas durante el día.
  todayKcal = computed(() => {
    const today = this.activity.today();

    return this.foods()
      .filter(food => food.consumedOn === today)
      .reduce((total, food) => total + food.kcal, 0);
  });

  // Guarda una nueva comida en la cuenta activa.
  addFood(entry: FoodEntry): void {
    const key = this.getFoodStorageKey();

    if (!key) {
      return;
    }

    const currentFoods = this.loadFoods(key);
    this.activity.refreshToday();

    const id = currentFoods.reduce(
      (nextId, food) => Math.max(nextId, food.id + 1),
      Date.now()
    );

    const updatedFoods: Food[] = [
      ...currentFoods,
      {
        id,
        ...entry,
        consumedOn: this.activity.today()
      }
    ];

    localStorage.setItem(key, JSON.stringify(updatedFoods));

    this.foodsRevision.update(value => value + 1);
  }

  // Elimina una comida únicamente de la cuenta activa.
  deleteFood(id: number): void {
    const key = this.getFoodStorageKey();

    if (!key) {
      return;
    }

    const updatedFoods = this.loadFoods(key)
      .filter(food => food.id !== id);

    localStorage.setItem(key, JSON.stringify(updatedFoods));

    this.foodsRevision.update(value => value + 1);
  }
}

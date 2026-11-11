import { Injectable, signal, computed, effect } from '@angular/core';
import { Food } from '../models/food.model';
import { Achievement } from '../models/achievement.model';

@Injectable({ providedIn: 'root' })
export class NutritionService {
  water = signal('1.2L');
  steps = signal('4.5k');
  foods = signal<Food[]>([
    { id: 1, name: 'Chicken Salad', kcal: 320 },
    { id: 2, name: 'Vegetable Stir-fry', kcal: 180 }
  ]);
  achievements = signal<Achievement[]>([
    { id: 1, icon: '🏆', name: '7-Day Streak' },
    { id: 2, icon: '⚖️', name: 'Weight Goal 1' }
  ]);

  totalKcal = computed(() => this.foods().reduce((total, food) => total + food.kcal, 0));

  constructor() {
    effect(() => localStorage.setItem('nutrit_foods', JSON.stringify(this.foods())));
  }

  addFood(newFood: Food) { this.foods.update(current => [...current, newFood]); }
  deleteFood(id: number) { this.foods.update(current => current.filter(f => f.id !== id)); }
}
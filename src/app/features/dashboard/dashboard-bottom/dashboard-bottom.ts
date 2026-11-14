import { Component, computed, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Food, FoodEntry } from '../../../core/models/food.model';
import { Achievement } from '../../../core/models/achievement.model';
import { User } from '../../../core/models/user.model';
import { FOOD_CATALOG } from './food-catalog';

@Component({
  selector: 'app-dashboard-bottom',
  imports: [DecimalPipe],
  templateUrl: './dashboard-bottom.html',
  styleUrl: './dashboard-bottom.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardBottom {
  user = input.required<User>();
  bmi = input.required<number>();
  foods = input.required<Food[]>();
  achievements = input.required<Achievement[]>();

  addFood = output<FoodEntry>();
  deleteFood = output<number>();

  protected readonly catalog = FOOD_CATALOG;
  protected readonly entryOpen = signal(false);
  protected readonly entryMode = signal<'catalog' | 'manual'>('catalog');
  protected readonly selectedName = signal('');
  protected readonly manualName = signal('');
  protected readonly grams = signal<number | null>(null);
  protected readonly manualKcal = signal<number | null>(null);

  protected readonly entry = computed<FoodEntry | null>(() => {
    const grams = this.grams();
    if (grams === null || !Number.isFinite(grams) || grams <= 0) return null;

    if (this.entryMode() === 'manual') {
      const name = this.manualName().trim();
      const kcal = this.manualKcal();
      if (!name || kcal === null || !Number.isFinite(kcal) || kcal < 0) return null;
      return { name, grams, kcal };
    }

    const food = this.catalog.find(option => option.name === this.selectedName());
    if (!food) return null;

    const kcal = (grams / 100) * food.kcalPer100g;
    if (!Number.isFinite(kcal)) return null;
    return { name: food.name, grams, kcal };
  });

  protected toggleEntry(trigger: HTMLButtonElement) {
    if (this.entryOpen()) {
      this.closeEntry(trigger);
      return;
    }
    this.entryOpen.set(true);
  }

  protected closeEntry(trigger: HTMLButtonElement) {
    this.entryOpen.set(false);
    this.entryMode.set('catalog');
    this.selectedName.set('');
    this.manualName.set('');
    this.grams.set(null);
    this.manualKcal.set(null);
    trigger.focus();
  }

  protected saveFood(event: Event, trigger: HTMLButtonElement) {
    event.preventDefault();
    const entry = this.entry();
    if (!entry) return;
    this.addFood.emit(entry);
    this.closeEntry(trigger);
  }

  onDeleteClick(id: number) { this.deleteFood.emit(id); }
}

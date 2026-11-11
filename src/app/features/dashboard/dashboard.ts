import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardTop } from './dashboard-top/dashboard-top';
import { DashboardBottom } from './dashboard-bottom/dashboard-bottom';
import { AuthService } from '../../core/services/auth.service';
import { NutritionService } from '../../core/services/nutrition.service';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardTop, DashboardBottom],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  public auth = inject(AuthService);
  public nutrition = inject(NutritionService);
  private router = inject(Router);

  bmi = computed(() => {
    const user = this.auth.currentUser();
    return user && user.weight && user.height ? user.weight / Math.pow(user.height / 100, 2) : 0;
  });

  dailyCalories = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return 0;
    let bmr = (10 * user.weight) + (6.25 * user.height) - (5 * user.age);
    bmr = user.gender === 'male' ? bmr + 5 : bmr - 161;
    return Math.round(bmr * 1.2);
  });

  handleAddFood(newFoodData: { name: string, kcal: number }) {
    this.nutrition.addFood({ id: Date.now(), ...newFoodData });
  }

  handleDeleteFood(id: number) {
    this.nutrition.deleteFood(id);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
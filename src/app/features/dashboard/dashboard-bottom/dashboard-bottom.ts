import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Food } from '../../../core/models/food.model';
import { Achievement } from '../../../core/models/achievement.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-bottom',
  imports: [],
  templateUrl: './dashboard-bottom.html',
  styleUrl: './dashboard-bottom.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardBottom {
  user = input.required<User>();
  bmi = input.required<number>();
  foods = input.required<Food[]>();
  achievements = input.required<Achievement[]>();

  addFood = output<{ name: string, kcal: number }>();
  deleteFood = output<number>();

  onAddClick(foodName: string) { this.addFood.emit({ name: foodName, kcal: 250 }); }
  onDeleteClick(id: number) { this.deleteFood.emit(id); }
}
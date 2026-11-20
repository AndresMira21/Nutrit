import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DailyActivityService } from '../../../core/services/daily-activity.service';
import { Food } from '../../../core/models/food.model';
import { MacronutrientChart } from '../macronutrient-chart/macronutrient-chart';


@Component({
  selector: 'app-dashboard-top',
  imports: [
  DecimalPipe,
  DatePipe,
  ReactiveFormsModule,
  MacronutrientChart
],
  templateUrl: './dashboard-top.html',
  styleUrl: './dashboard-top.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardTop implements OnInit, OnDestroy {
  water = input.required<string>();
  steps = input.required<string>();
  kcal = input.required<number>();
  foods = input.required<Food[]>();


  protected readonly activity = inject(DailyActivityService);
  private readonly fb = inject(FormBuilder);
  private refreshInterval?: ReturnType<typeof setInterval>;

  readonly waterForm = this.fb.nonNullable.group({
    amount: [250, [Validators.required, Validators.min(1), Validators.max(5000), Validators.pattern(/^\d+$/)]]
  });

  readonly stepsForm = this.fb.nonNullable.group({
    amount: [500, [Validators.required, Validators.min(1), Validators.max(100000), Validators.pattern(/^\d+$/)]]
  });

  readonly goalForm = this.fb.nonNullable.group({
    goal: [8000, [Validators.required, Validators.min(1), Validators.max(100000), Validators.pattern(/^\d+$/)]]
  });

  protected feedback = '';

  ngOnInit(): void {
    this.activity.refreshToday();
    this.goalForm.patchValue({ goal: this.activity.stepsGoal() ?? 8000 });
    this.refreshInterval = setInterval(() => this.activity.refreshToday(), 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }

  addWater(): void {
    if (this.waterForm.invalid) {
      this.waterForm.markAllAsTouched();
      return;
    }
    const success = this.activity.addRecord('water', this.waterForm.getRawValue().amount);
    this.feedback = success ? 'Agua registrada correctamente.' : 'No se pudo guardar el registro.';
  }

  addSteps(): void {
    if (this.stepsForm.invalid) {
      this.stepsForm.markAllAsTouched();
      return;
    }
    const success = this.activity.addRecord('steps', this.stepsForm.getRawValue().amount);
    this.feedback = success ? 'Pasos registrados correctamente.' : 'No se pudo guardar el registro.';
  }

  saveGoal(): void {
    if (this.goalForm.invalid) {
      this.goalForm.markAllAsTouched();
      return;
    }
    const success = this.activity.setStepsGoal(this.goalForm.getRawValue().goal);
    this.feedback = success ? 'Meta de pasos actualizada.' : 'No se pudo guardar la meta.';
  }

  deleteEntry(id: string): void {
    this.activity.deleteRecord(id);
    this.feedback = 'Registro eliminado.';
  }
}


import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { Food } from '../../../core/models/food.model';

import {
  MacronutrientCalculatorService
} from '../../../core/services/macronutrient-calculator.service';

import {
  DailyActivityService
} from '../../../core/services/daily-activity.service';

@Component({
  selector: 'app-macronutrient-chart',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './macronutrient-chart.html',
  styleUrl: './macronutrient-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MacronutrientChart {

  // Comidas de la cuenta activa.
  foods = input.required<Food[]>();

  private readonly calculator =
    inject(MacronutrientCalculatorService);

  private readonly activity =
    inject(DailyActivityService);

  // Solo las comidas registradas en la fecha actual.
  protected readonly todayFoods = computed(() => {
    const today = this.activity.today();

    return this.foods().filter(
      food => food.consumedOn === today
    );
  });

  // Totales calculados a partir de las comidas de hoy.
  protected readonly totals = computed(() =>
    this.calculator.calculateTotals(this.todayFoods())
  );

  protected readonly foodsWithMacros = computed(() =>
    this.todayFoods().length -
    this.totals().foodsWithoutMacros
  );

  // Energía aproximada aportada por los macros conocidos.
  protected readonly macroEnergy = computed(() => {
    const totals = this.totals();

    return (
      totals.proteinG * 4 +
      totals.carbsG * 4 +
      totals.fatG * 9
    );
  });

  protected readonly nutrients = computed(() => {
    const totals = this.totals();
    const energy = this.macroEnergy();

    const items = [
      {
        name: 'Proteínas',
        grams: totals.proteinG,
        kcal: totals.proteinG * 4,
        color: '#438b69'
      },
      {
        name: 'Carbohidratos',
        grams: totals.carbsG,
        kcal: totals.carbsG * 4,
        color: '#d2a14a'
      },
      {
        name: 'Grasas',
        grams: totals.fatG,
        kcal: totals.fatG * 9,
        color: '#6596c3'
      }
    ];

    return items.map(item => ({
      ...item,
      percentage: energy > 0
        ? item.kcal / energy * 100
        : 0
    }));
  });
}

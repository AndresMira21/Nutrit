
import { Injectable } from '@angular/core';
import { Food } from '../models/food.model';

export interface MacroTotals {
  proteinG: number;
  carbsG: number;
  fatG: number;
  foodsWithoutMacros: number;
}

@Injectable({
  providedIn: 'root'
})
export class MacronutrientCalculatorService {

  // Calcula nutrientes según la cantidad consumida.
  calculatePortion(
    grams: number,
    per100g: {
      proteinPer100g: number;
      carbsPer100g: number;
      fatPer100g: number;
    }
  ) {
    if (!Number.isFinite(grams) || grams <= 0) {
      return { proteinG: 0, carbsG: 0, fatG: 0 };
    }

    const factor = grams / 100;

    return {
      proteinG: Number(
        (per100g.proteinPer100g * factor).toFixed(2)
      ),
      carbsG: Number(
        (per100g.carbsPer100g * factor).toFixed(2)
      ),
      fatG: Number(
        (per100g.fatPer100g * factor).toFixed(2)
      )
    };
  }

  // Suma los macronutrientes de las comidas indicadas.
  calculateTotals(foods: Food[]): MacroTotals {
    return foods.reduce<MacroTotals>(
      (totals, food) => {
        const hasMacros =
          food.proteinG !== undefined &&
          food.carbsG !== undefined &&
          food.fatG !== undefined;

        if (!hasMacros) {
          totals.foodsWithoutMacros++;
          return totals;
        }

        totals.proteinG += food.proteinG!;
        totals.carbsG += food.carbsG!;
        totals.fatG += food.fatG!;

        return totals;
      },
      {
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        foodsWithoutMacros: 0
      }
    );
  }
}

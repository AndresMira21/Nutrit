
export interface Food {
  id: number;
  name: string;
  kcal: number;
  grams?: number;
  consumedOn?: string;

  // Macronutrientes de la porción consumida, en gramos.
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
}

export type FoodEntry =
  Omit<Food, 'id' | 'grams' | 'consumedOn'> & {
    grams: number;
  };

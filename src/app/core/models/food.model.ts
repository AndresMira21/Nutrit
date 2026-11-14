export interface Food {
  id: number;
  name: string;
  kcal: number;
  grams?: number;
}

export type FoodEntry = Omit<Food, 'id' | 'grams'> & { grams: number };

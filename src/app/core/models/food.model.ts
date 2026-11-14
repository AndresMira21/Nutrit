export interface Food {
  id: number;
  name: string;
  kcal: number;
  grams?: number;
  consumedOn?: string;
}

export type FoodEntry = Omit<Food, 'id' | 'grams'> & { grams: number };

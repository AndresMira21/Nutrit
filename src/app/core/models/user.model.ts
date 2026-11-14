export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'intense';
export type Goal = 'lose' | 'maintain' | 'gain';
export type DietType = 'omnivore' | 'vegetarian' | 'vegan' | 'other';

export interface Habits {
  exercises: boolean;
  exerciseType: string;
  exerciseDaysPerWeek: number;
  exerciseMinutes: number;
  activityLevel: ActivityLevel;
  mealsPerDay: number;
  meals: { breakfast: boolean; lunch: boolean; dinner: boolean; snacks: boolean };
  waterGlasses: number;
  dietType: DietType;
  goal: Goal;
  restrictions: string;
}

export interface User {
  id: number; name: string; email: string; weight: number;
  height: number; age: number; gender: 'male' | 'female';
  startingWeight?: number;
  isProfileComplete: boolean;
  habits?: Habits;
}

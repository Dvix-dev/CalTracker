export type Sex = 'male' | 'female' | 'other';
export type Goal = 'lose' | 'define' | 'maintain';
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type MealType = 'Desayuno' | 'Media mañana' | 'Comida' | 'Merienda' | 'Cena' | 'Otros';
export type ThemeMode = 'system' | 'light' | 'dark';
export type Units = 'metric' | 'imperial';

export interface MacroTargets { protein: number; carbs: number; fat: number }
export interface Profile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activity: Activity;
  goal: Goal;
  calorieTarget: number;
  macros: MacroTargets;
  units: Units;
}
export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  favorite: boolean;
  custom: boolean;
}
export interface MealEntry {
  id: string;
  foodId: string;
  name: string;
  mealType: MealType;
  date: string;
  quantity: number;
  unit: 'g' | 'porción';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
export interface WeightEntry { id: string; date: string; weightKg: number }
export interface AppData {
  profile: Profile | null;
  onboardingComplete: boolean;
  theme: ThemeMode;
  foods: Food[];
  meals: MealEntry[];
  weights: WeightEntry[];
}

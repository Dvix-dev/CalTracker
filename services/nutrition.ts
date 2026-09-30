import type { Activity, Goal, MacroTargets, Profile } from '@/types';

export const ACTIVITY_FACTORS: Record<Activity, number> = {
  sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, veryActive: 1.9,
};

export function calculateBMR(input: Pick<Profile, 'sex' | 'age' | 'heightCm' | 'weightKg'>): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return Math.round(base + (input.sex === 'male' ? 5 : input.sex === 'female' ? -161 : -78));
}
export function calculateTDEE(input: Pick<Profile, 'sex' | 'age' | 'heightCm' | 'weightKg' | 'activity'>): number {
  return Math.round(calculateBMR(input) * ACTIVITY_FACTORS[input.activity]);
}
export function calculateCalorieTarget(tdee: number, goal: Goal): number {
  const adjustment = goal === 'maintain' ? 0 : goal === 'lose' ? -400 : -250;
  return Math.max(1200, Math.round((tdee + adjustment) / 10) * 10);
}
export function calculateMacroTargets(calories: number, weightKg: number, goal: Goal): MacroTargets {
  const protein = Math.round(weightKg * (goal === 'maintain' ? 1.6 : 1.8));
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { protein, carbs, fat };
}
export const calculateMacrosTarget = calculateMacroTargets;
export function calculateProgress(start: number, current: number, target: number): number {
  const distance = Math.abs(start - target);
  if (distance === 0) return 100;
  return Math.max(0, Math.min(100, Math.round((Math.abs(start - current) / distance) * 100)));
}
export function validateProfileField(field: string, value: number): string | null {
  if (!Number.isFinite(value)) return 'Introduce un número válido.';
  const ranges: Record<string, [number, number, string]> = {
    age: [16, 100, 'La edad debe estar entre 16 y 100 años.'],
    heightCm: [120, 230, 'La altura debe estar entre 120 y 230 cm.'],
    weightKg: [35, 300, 'El peso debe estar entre 35 y 300 kg.'],
    targetWeightKg: [35, 300, 'El peso objetivo debe estar entre 35 y 300 kg.'],
    calorieTarget: [1200, 6000, 'El objetivo debe estar entre 1.200 y 6.000 kcal.'],
  };
  const range = ranges[field];
  return range && (value < range[0] || value > range[1]) ? range[2] : null;
}

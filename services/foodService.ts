import type { Food } from '@/types';

export const starterFoods: Food[] = [
  { id: 'oats', name: 'Avena', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, favorite: false, custom: false },
  { id: 'banana', name: 'Plátano', calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3, favorite: false, custom: false },
  { id: 'chicken', name: 'Pechuga de pollo', calories: 165, protein: 31, carbs: 0, fat: 3.6, favorite: false, custom: false },
  { id: 'rice', name: 'Arroz cocido', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, favorite: false, custom: false },
  { id: 'egg', name: 'Huevo', calories: 155, protein: 13, carbs: 1.1, fat: 11, favorite: false, custom: false },
  { id: 'yogurt', name: 'Yogur griego natural', calories: 97, protein: 9, carbs: 3.6, fat: 5, favorite: false, custom: false },
  { id: 'avocado', name: 'Aguacate', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, favorite: false, custom: false },
  { id: 'salmon', name: 'Salmón', calories: 208, protein: 20, carbs: 0, fat: 13, favorite: false, custom: false },
];
export function searchFoods(foods: Food[], query: string): Food[] {
  const normalized = query.trim().toLocaleLowerCase();
  return [...foods].filter((food) => !normalized || food.name.toLocaleLowerCase().includes(normalized))
    .sort((a, b) => Number(b.favorite) - Number(a.favorite));
}

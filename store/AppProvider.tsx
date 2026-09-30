import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppData, Food, MealEntry, Profile, ThemeMode, WeightEntry } from '@/types';
import { appRepository, initialData } from '@/services/storage';

interface AppContextValue extends AppData {
  ready: boolean;
  saveProfile: (profile: Profile) => Promise<void>;
  addMeal: (meal: MealEntry) => Promise<void>;
  updateMeal: (meal: MealEntry) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  addFood: (food: Food) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addWeight: (entry: WeightEntry) => Promise<void>;
  setTheme: (theme: ThemeMode) => Promise<void>;
  clearAll: () => Promise<void>;
  updateData: (updates: Partial<AppData>) => Promise<void>;
}
const Context = createContext<AppContextValue | null>(null);
export function AppProvider({ children }: React.PropsWithChildren) {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  useEffect(() => { appRepository.load().then(setData).catch(() => setData(initialData)).finally(() => setReady(true)); }, []);
  const commit = useCallback(async (next: AppData) => {
    setData(next);
    try { await appRepository.save(next); } catch { /* La UI conserva los cambios en sesión si falla el dispositivo. */ }
  }, []);
  const updateData = useCallback((updates: Partial<AppData>) => commit({ ...data, ...updates }), [commit, data]);
  const value = useMemo<AppContextValue>(() => ({
    ...data, ready, updateData,
    saveProfile: async (profile) => commit({ ...data, profile, onboardingComplete: true }),
    addMeal: async (meal) => commit({ ...data, meals: [meal, ...data.meals] }),
    updateMeal: async (meal) => commit({ ...data, meals: data.meals.map((item) => item.id === meal.id ? meal : item) }),
    deleteMeal: async (id) => commit({ ...data, meals: data.meals.filter((item) => item.id !== id) }),
    addFood: async (food) => commit({ ...data, foods: [food, ...data.foods.filter((item) => item.id !== food.id)] }),
    toggleFavorite: async (id) => commit({ ...data, foods: data.foods.map((food) => food.id === id ? { ...food, favorite: !food.favorite } : food) }),
    addWeight: async (entry) => commit({ ...data, weights: [entry, ...data.weights.filter((item) => item.date !== entry.date)] }),
    setTheme: async (theme) => commit({ ...data, theme }),
    clearAll: async () => { await AsyncStorage.removeItem('@caltracker/data-v1'); setData(initialData); },
  }), [data, ready, commit, updateData]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('useApp debe usarse dentro de AppProvider');
  return value;
}

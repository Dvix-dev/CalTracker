import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AppData } from '@/types';
import { starterFoods } from './foodService';

const STORAGE_KEY = '@caltracker/data-v1';
export const initialData: AppData = {
  profile: null, onboardingComplete: false, theme: 'system', foods: starterFoods, meals: [], weights: [],
};
export const appRepository = {
  async load(): Promise<AppData> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return initialData;
    try {
      const saved = JSON.parse(raw) as Partial<AppData>;
      return { ...initialData, ...saved, foods: saved.foods?.length ? saved.foods : starterFoods };
    } catch {
      return initialData;
    }
  },
  async save(data: AppData): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },
  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};

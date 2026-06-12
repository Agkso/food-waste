import AsyncStorage from '@react-native-async-storage/async-storage';
import { FoodItem } from '@/types';

const KEY = '@food_waste_app:items';

export async function loadItems(): Promise<FoodItem[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as FoodItem[]) : [];
  } catch {
    return [];
  }
}

export async function saveItems(items: FoodItem[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

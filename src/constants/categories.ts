import { FoodCategory } from '@/types';

export interface CategoryInfo {
  key: FoodCategory;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryInfo[] = [
  { key: 'fruta', label: 'Fruta', icon: 'food-apple-outline' },
  { key: 'vegetal', label: 'Vegetal', icon: 'carrot' },
  { key: 'laticinio', label: 'Laticínio', icon: 'cheese' },
  { key: 'carne', label: 'Carne/Peixe', icon: 'food-drumstick-outline' },
  { key: 'graos', label: 'Grãos/Massas', icon: 'rice' },
  { key: 'bebida', label: 'Bebida', icon: 'cup-outline' },
  { key: 'outro', label: 'Outro', icon: 'food-variant' },
];

export const CATEGORY_MAP: Record<FoodCategory, CategoryInfo> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: c }),
  {} as Record<FoodCategory, CategoryInfo>,
);

export function categoryIcon(category?: FoodCategory): string {
  return category ? CATEGORY_MAP[category].icon : CATEGORY_MAP.outro.icon;
}

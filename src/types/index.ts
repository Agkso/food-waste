export type FoodCategory =
  | 'fruta'
  | 'vegetal'
  | 'laticinio'
  | 'carne'
  | 'graos'
  | 'bebida'
  | 'outro';

export interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expirationDate: string; // ISO
  addedAt: string;
  imageUri?: string;
  category?: FoodCategory;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  matchScore?: number;
}

export type ExpirationStatus = 'fresh' | 'soon' | 'expired';

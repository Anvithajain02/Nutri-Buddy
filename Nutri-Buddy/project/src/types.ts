export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  dietType: 'vegetarian' | 'non-vegetarian';
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active';
  dailyCalorieGoal: number;
}

export interface FoodEntry {
  id: string;
  foodName: string;
  calories: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface WaterIntake {
  glasses: number;
  goal: number;
  lastUpdate: string; // date string
}

export interface Recipe {
  id: string;
  name: string;
  calories: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
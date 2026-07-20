export type AgeGroupId = '6_meses' | '7_8_meses' | '9_11_meses' | '12_23_meses' | '2_5_anos';

export interface Recipe {
  id: string;
  name: string;
  age: AgeGroupId;
  ingredients: string; // List or comma-separated / newline-separated
  quantities?: string; // Optional detailed quantities
  preparation: string; // Steps
  portionSize: string;
  texture: string;
  nutritionalBenefits: string;
  ironRichIngredients: string;
  prepTime: string;
  cookTime: string;
  difficulty: 'Fácil' | 'Medio' | 'Difícil';
  imageUrl: string;
  videoUrl: string;
  qrUrl: string; // Can be a URL or custom text to render QR
  isCustom?: boolean; // True if added by admin in this session / DB
}

export interface AgeCategoryInfo {
  id: AgeGroupId;
  title: string;
  ageRange: string;
  nutritionalGuide: string;
  mealsCount: string;
  texture: string;
  portionSize: string;
  healthyDrinks: string;
  hygieneRecs: string;
  hungerSigns: string;
  satietySigns: string;
}

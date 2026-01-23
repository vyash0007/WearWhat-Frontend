/**
 * API Types - Shared type definitions for API requests/responses
 */

// ============ User Types ============

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

// ============ Auth Types ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// ============ Wardrobe Types ============

export interface WardrobeItemAttributes {
  color?: string;
  season?: string;
  material?: string;
  pattern?: string;
  occasion?: string;
  // Upper wear specific
  neckline?: string;
  sleeveLength?: string;
  topLength?: string;
  // Bottom wear specific
  fit?: string;
  length?: string;
  rise?: string;
  // Outer wear specific
  thickness?: string;
  // Footwear specific
  usageType?: string;
}

export interface WardrobeItem {
  id: string;
  image_url: string;
  categoryGroup: 'upperWear' | 'bottomWear' | 'outerWear' | 'footwear' | 'otherItems';
  category: string;
  attributes: WardrobeItemAttributes;
  created_at?: string;
  saved?: boolean;
  saved_image_id?: string;
}

export interface WardrobeUploadResponse {
  success: boolean;
  count: number;
  user_id: string;
  items: WardrobeItem[];
}

export interface WardrobeListResponse {
  success: boolean;
  count: number;
  items: WardrobeItem[];
}

export interface WardrobeDeleteResponse {
  success: boolean;
  message: string;
}

// ============ Category Groups ============

// ============ Saved Images Types ============

export interface SavedImage {
  id: string;
  user_id: string;
  image_id: string;
  image_url?: string; // May not always be present
  note: string | null;
  saved_at: string;
}

export interface UpdateNoteRequest {
  saved_image_id: string;
  note: string;
}

export interface SaveImageRequest {
  image_id: string; // Wardrobe item ID (UUID)
  note?: string | null;
}

export interface SavedImageResponse {
  id: string;
  user_id: string;
  image_id: string;
  note: string | null;
  saved_at: string;
}

export type SavedImageListResponse = SavedImage[];

export const CATEGORY_GROUPS = {
  upperWear: ['T-Shirt', 'Shirt', 'Blouse', 'Sweater', 'Hoodie', 'Cardigan', 'Tank Top', 'Crop Top', 'Polo', 'Tunic'],
  bottomWear: ['Jeans', 'Trousers', 'Shorts', 'Skirt', 'Leggings', 'Joggers', 'Chinos', 'Culottes'],
  outerWear: ['Jacket', 'Coat', 'Blazer', 'Vest', 'Parka', 'Windbreaker', 'Puffer', 'Trench Coat'],
  footwear: ['Sneakers', 'Boots', 'Sandals', 'Loafers', 'Heels', 'Flats', 'Oxfords'],
  otherItems: ['Hat', 'Bag', 'Scarf', 'Belt', 'Watch', 'Sunglasses', 'Jewelry'],
} as const;

export const ATTRIBUTE_LABELS: Record<string, string> = {
  color: 'Color',
  season: 'Season',
  material: 'Material',
  pattern: 'Pattern',
  occasion: 'Occasion',
  neckline: 'Neckline',
  sleeveLength: 'Sleeve Length',
  topLength: 'Top Length',
  fit: 'Fit',
  length: 'Length',
  rise: 'Rise',
  thickness: 'Thickness',
  usageType: 'Usage Type',
};

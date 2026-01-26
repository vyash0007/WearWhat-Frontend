/**
 * Styling API - AI outfit recommendations
 */

import { apiClient } from './client';
import type { WardrobeItem } from './types';

// Response for item-based style recommendation
export interface MatchedItem extends WardrobeItem {
  is_source?: boolean;
  match_score: number;
}

export interface StyleRecommendationResponse {
  success: boolean;
  source_item: WardrobeItem;
  combined_image_url: string;
  matched_items: MatchedItem[];
  total_items: number;
}

// Weather data types
export interface WeatherLocation {
  city: string;
  country: string;
  lat?: number;
  lon?: number;
}

export interface WeatherCurrent {
  temp: number;
  feels_like: number;
  humidity: number;
  condition: string;
  description: string;
  icon: string;
}

export interface WeatherForecast {
  avg_temp: number;
  min_temp: number;
  max_temp: number;
  dominant_condition: string;
}

export interface WeatherData {
  success: boolean;
  date?: string;
  location: WeatherLocation;
  current: WeatherCurrent;
  forecast: WeatherForecast;
  suggestion: string;
}

// Request params for prompt-based recommendation
export interface RecommendationRequest {
  prompt: string;
  lat?: number;
  lon?: number;
  city?: string;
  date?: string;
}

// Response for prompt-based recommendation (used in planning)
export interface StylingRecommendationResponse {
  success: boolean;
  prompt: string;
  reasoning?: string;
  selected_categories: string[];
  combined_image_url: string;
  items: WardrobeItem[];
  weather?: WeatherData;
}

export const stylingService = {
  /**
   * Get style recommendation based on a selected wardrobe item
   */
  getStyleRecommendation: async (itemId: string): Promise<StyleRecommendationResponse> => {
    return apiClient.post<StyleRecommendationResponse>('/recommendation/style', { item_id: itemId });
  },

  /**
   * Get outfit recommendation based on a text prompt with optional location and date (used in planning)
   */
  getRecommendation: async (params: RecommendationRequest): Promise<StylingRecommendationResponse> => {
    return apiClient.post<StylingRecommendationResponse>('/recommendation', params);
  },
};

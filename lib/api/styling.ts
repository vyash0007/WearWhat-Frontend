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

// Response for prompt-based recommendation (used in planning)
export interface StylingRecommendationResponse {
  success: boolean;
  prompt: string;
  selected_categories: string[];
  combined_image_url: string;
  items: WardrobeItem[];
}

export const stylingService = {
  /**
   * Get style recommendation based on a selected wardrobe item
   */
  getStyleRecommendation: async (itemId: string): Promise<StyleRecommendationResponse> => {
    return apiClient.post<StyleRecommendationResponse>('/recommendation/style', { item_id: itemId });
  },

  /**
   * Get outfit recommendation based on a text prompt (used in planning)
   */
  getRecommendation: async (prompt: string): Promise<StylingRecommendationResponse> => {
    return apiClient.post<StylingRecommendationResponse>('/recommendation', { prompt });
  },
};

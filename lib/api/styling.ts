/**
 * Styling API - AI outfit recommendations
 */

import { apiClient } from './client';
import type { WardrobeItem } from './types';

export interface StylingRecommendationResponse {
  success: boolean;
  prompt: string;
  selected_categories: string[];
  combined_image_url: string;
  items: WardrobeItem[];
}

export const stylingService = {
  getRecommendation: async (prompt: string): Promise<StylingRecommendationResponse> => {
    return apiClient.post<StylingRecommendationResponse>('/recommendation', { prompt });
  },
};

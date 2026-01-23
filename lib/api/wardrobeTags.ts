/**
 * Wardrobe Tags Service - Handles wardrobe tags API calls
 */

import { apiClient } from './client';

export interface WardrobeTagsResponse {
  tags_by_category: {
    [categoryGroup: string]: {
      [category: string]: string[]; // Array of item IDs
    };
  };
}

export const wardrobeTagsService = {
  /**
   * Get all wardrobe tags organized by category
   */
  async getTags(): Promise<WardrobeTagsResponse> {
    return apiClient.get<WardrobeTagsResponse>('/wardrobe-tags');
  },
};


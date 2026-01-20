/**
 * Wardrobe Service - Handles wardrobe/clothing API calls
 */

import { apiClient } from './client';
import type { WardrobeUploadResponse, WardrobeListResponse, WardrobeDeleteResponse } from './types';

export const wardrobeService = {
  /**
   * Upload a single clothing image
   * Image is auto-tagged by the backend
   */
  async uploadImage(file: File): Promise<WardrobeUploadResponse> {
    const formData = new FormData();
    formData.append('files', file);

    return apiClient.post<WardrobeUploadResponse>('/wardrobe/upload', formData);
  },

  /**
   * Get all wardrobe items for the current user
   */
  async getItems(): Promise<WardrobeListResponse> {
    return apiClient.get<WardrobeListResponse>('/wardrobe/');
  },

  /**
   * Delete a wardrobe item by ID
   */
  async deleteItem(itemId: string): Promise<WardrobeDeleteResponse> {
    return apiClient.delete<WardrobeDeleteResponse>(`/wardrobe/${itemId}`);
  },
};

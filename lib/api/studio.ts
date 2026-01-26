/**
 * Studio API Service - Handles studio image generation and retrieval
 */

import { apiClient } from './client';

export interface StudioImage {
  id: string;
  item_id: string;
  original_image_url: string;
  studio_image_url: string;
  category_group: string;
  created_at: string;
}

export interface GenerateStudioImageRequest {
  item_id: string;
}

export interface GenerateStudioImageResponse {
  success: boolean;
  id?: string;
  image_url?: string;
  item_id?: string;
  category_group?: string;
  original_image_url?: string;
  created_at?: string;
  tokens: number;
  message?: string;
}

export interface GetStudioImagesResponse {
  success: boolean;
  count: number;
  tokens: number;
  images: StudioImage[];
}

export interface GetTokensResponse {
  success: boolean;
  tokens: number;
}

export const studioService = {
  /**
   * Generate a studio-quality image from a wardrobe item
   */
  async generate(itemId: string): Promise<GenerateStudioImageResponse> {
    return apiClient.post<GenerateStudioImageResponse>('/studio/generate', { item_id: itemId });
  },

  /**
   * Get all studio images for the logged-in user
   */
  async getAll(limit = 20, offset = 0): Promise<GetStudioImagesResponse> {
    return apiClient.get<GetStudioImagesResponse>(`/studio/all?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get current token balance
   */
  async getTokens(): Promise<GetTokensResponse> {
    return apiClient.get<GetTokensResponse>('/studio/tokens');
  },
};

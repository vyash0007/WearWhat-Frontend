/**
 * Calendar Outfits API - Save and retrieve outfits for specific dates
 */

import { apiClient } from './client';
import type { WardrobeItem } from './types';

export interface CalendarOutfit {
  id: string;
  user_id: string;
  outfit_date: string;
  combined_image_url: string;
  prompt: string;
  temperature?: number;
  weather?: string;
  selected_categories: string[];
  items: WardrobeItem[];
  created_at: string;
}

export interface CalendarOutfitsListResponse {
  success: boolean;
  count: number;
  outfits: CalendarOutfit[];
}

export interface SaveCalendarOutfitRequest {
  outfit_date: string;
  combined_image_url: string;
  prompt: string;
  temperature?: number;
  weather?: string;
  selected_categories: string[];
  items: WardrobeItem[];
}

export interface SaveCalendarOutfitResponse {
  success: boolean;
  message: string;
}

export interface DeleteCalendarOutfitResponse {
  success: boolean;
  message: string;
}

export const calendarOutfitsService = {
  // Save outfit for a date
  save: async (data: SaveCalendarOutfitRequest): Promise<SaveCalendarOutfitResponse> => {
    return apiClient.post<SaveCalendarOutfitResponse>('/calendar-outfits', data);
  },

  // Get all saved outfits (max 5)
  getAll: async (): Promise<CalendarOutfit[]> => {
    const response = await apiClient.get<CalendarOutfitsListResponse>('/calendar-outfits');
    return response.outfits;
  },

  // Get outfit for specific date
  getByDate: async (date: string): Promise<CalendarOutfit | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; outfit?: CalendarOutfit; message?: string }>(`/calendar-outfits/${date}`);
      if (response.success && response.outfit) {
        return response.outfit;
      }
      return null;
    } catch (err: any) {
      // If 404 or not found, return null (this is expected when no outfit exists)
      if (err.status === 404 || err.status === 0) {
        return null;
      }
      // Check if it's a "not found" message
      if (err.message && (err.message.includes("not found") || err.message.includes("No outfit"))) {
        return null;
      }
      console.error("Error fetching calendar outfit:", err);
      return null;
    }
  },

  // Delete outfit for a date
  delete: async (date: string): Promise<DeleteCalendarOutfitResponse> => {
    return apiClient.delete<DeleteCalendarOutfitResponse>(`/calendar-outfits/${date}`);
  },
};

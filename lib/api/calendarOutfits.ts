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
  temperature: number;
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
  temperature: number;
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
      return await apiClient.get<CalendarOutfit>(`/calendar-outfits/${date}`);
    } catch {
      return null;
    }
  },

  // Delete outfit for a date
  delete: async (date: string): Promise<DeleteCalendarOutfitResponse> => {
    return apiClient.delete<DeleteCalendarOutfitResponse>(`/calendar-outfits/${date}`);
  },
};

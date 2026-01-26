/**
 * Posts API Service - Handles all post-related API calls
 */

import { apiClient } from './client';

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_profile_image?: string | null;
  image_url: string;
  text?: string;
  likes_count: number;
  comments_count: number;
  liked_by_user_ids: string[];
  is_liked: boolean;
  saved_by_user_ids: string[];
  is_saved: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  user_profile_image?: string | null;
  text: string;
  created_at: string;
}

export interface CreatePostRequest {
  image_url: string;
  text?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post: Post;
}

export interface GetPostsResponse {
  success: boolean;
  count: number;
  posts: Post[];
}

export interface LikePostResponse {
  success: boolean;
  liked: boolean;
  likes_count: number;
  message?: string;
}

export interface SavePostResponse {
  success: boolean;
  saved: boolean;
  message?: string;
}

export interface GetCommentsResponse {
  success: boolean;
  count: number;
  comments: Comment[];
}

export interface CreateCommentRequest {
  text: string;
}

export interface CreateCommentResponse {
  success: boolean;
  comment: Comment;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export const postsService = {
  /**
   * Create a new post
   */
  async create(data: CreatePostRequest): Promise<CreatePostResponse> {
    return apiClient.post<CreatePostResponse>('/posts/', data);
  },

  /**
   * Get feed (all posts, newest first)
   */
  async getFeed(limit = 20, offset = 0): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>(`/posts/?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get current user's posts only
   */
  async getMyPosts(limit = 20, offset = 0): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>(`/posts/me?limit=${limit}&offset=${offset}`);
  },

  /**
   * Delete own post
   */
  async delete(postId: string): Promise<DeleteResponse> {
    return apiClient.delete<DeleteResponse>(`/posts/${postId}`);
  },

  /**
   * Like a post
   */
  async like(postId: string): Promise<LikePostResponse> {
    return apiClient.post<LikePostResponse>(`/posts/${postId}/like`);
  },

  /**
   * Save a post
   */
  async save(postId: string): Promise<SavePostResponse> {
    return apiClient.post<SavePostResponse>(`/posts/${postId}/save`);
  },

  /**
   * Get posts saved by current user
   */
  async getSavedPosts(limit = 20, offset = 0): Promise<GetPostsResponse> {
    return apiClient.get<GetPostsResponse>(`/posts/saved?limit=${limit}&offset=${offset}`);
  },

  /**
   * Get comments for a post
   */
  async getComments(postId: string, limit = 50, offset = 0): Promise<GetCommentsResponse> {
    return apiClient.get<GetCommentsResponse>(`/posts/${postId}/comments?limit=${limit}&offset=${offset}`);
  },

  /**
   * Add a comment to a post
   */
  async addComment(postId: string, text: string): Promise<CreateCommentResponse> {
    return apiClient.post<CreateCommentResponse>(`/posts/${postId}/comments`, { text });
  },

  /**
   * Delete own comment
   */
  async deleteComment(commentId: string): Promise<DeleteResponse> {
    return apiClient.delete<DeleteResponse>(`/posts/comments/${commentId}`);
  },
};

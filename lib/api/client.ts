/**
 * API Client - Base HTTP client for all API requests
 * Handles request/response interceptors, error handling, and auth
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  status: number;
}

// Function to get Clerk token - will be set by Clerk auth context
let getToken: (() => Promise<string | null>) | null = null;

export function setTokenGetter(tokenGetter: () => Promise<string | null>) {
  getToken = tokenGetter;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get Clerk JWT token if available
    let authToken: string | null = null;
    if (getToken) {
      authToken = await getToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add Clerk JWT token to headers if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers,
    };

    // Don't set Content-Type for FormData (browser sets it with boundary)
    if (options.body instanceof FormData) {
      delete (config.headers as Record<string, string>)['Content-Type'];
    }

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          // Handle 401 Unauthorized - redirect to login
          if (response.status === 401) {
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
              window.location.href = '/login';
            }
          }
          throw {
            success: false,
            message: 'Server error',
            status: response.status,
          } as ApiError;
        }
        return {} as T;
      }

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - redirect to login
        if (response.status === 401) {
          // Only redirect if we're in the browser and not already on login page
          if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login';
          }
        }

        throw {
          success: false,
          message: data.detail || data.message || 'Request failed',
          status: response.status,
        } as ApiError;
      }

      // Log response for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`API Response [${options.method || 'GET'} ${endpoint}]:`, data);
      }

      return data as T;
    } catch (error) {
      if ((error as ApiError).status) {
        throw error;
      }
      throw {
        success: false,
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async upload<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

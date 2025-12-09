/**
 * API Client Helper
 * 
 * Provides methods for making HTTP requests with JSON handling.
 * Throws clear errors on non-JSON or non-2xx responses.
 */

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface ApiClientOptions extends RequestInit {
  method?: HttpMethod;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public url: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base fetch wrapper with JSON handling
 */
async function request<T = any>(
  url: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const headers = new Headers(options.headers);
  
  // Set Content-Type for requests with body
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Check if response is OK (status 200-299)
    if (!response.ok) {
      const statusText = response.statusText || 'Unknown Error';
      let errorMessage = `Request failed: ${response.status} ${statusText}`;
      
      // Try to get error message from JSON response
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const errorData = await response.json();
          // Build detailed error message
          const parts = [errorData.error || errorData.message || errorMessage];
          if (errorData.details) parts.push(`Details: ${errorData.details}`);
          if (errorData.hint) parts.push(`Hint: ${errorData.hint}`);
          if (errorData.code) parts.push(`Code: ${errorData.code}`);
          errorMessage = parts.join('. ');
        } else {
          const text = await response.text();
          if (text) {
            errorMessage = `${errorMessage}. Response: ${text.substring(0, 200)}`;
          }
        }
      } catch {
        // Ignore parsing errors, use default message
      }
      
      throw new ApiError(errorMessage, response.status, statusText, url);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // Validate content-type header
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      const preview = text.substring(0, 200);
      throw new ApiError(
        `Expected JSON but got ${contentType}. Response preview: ${preview}`,
        response.status,
        response.statusText,
        url
      );
    }

    // Parse and return JSON
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'Network Error',
      url
    );
  }
}

/**
 * API Client with methods for common HTTP operations
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T = any>(url: string, options?: RequestInit): Promise<T> {
    return request<T>(url, { ...options, method: 'GET' });
  },

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options?: RequestInit): Promise<T> {
    return request<T>(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  /**
   * DELETE request
   */
  async del<T = any>(url: string, options?: RequestInit): Promise<T> {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
};

export { ApiError };


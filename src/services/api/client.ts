import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { axiosInstance } from './config';

// Interface untuk response API
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  status: number;
}

// Interface untuk error response dari API
export interface ApiErrorResponse {
  message: string;
  [key: string]: unknown;
}

/**
 * Fungsi utama untuk melakukan request API dengan axios
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options,
    });
    
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      return {
        data: null,
        error: axiosError.response?.data?.message || axiosError.message || 'Terjadi kesalahan pada server',
        status: axiosError.response?.status || 0,
      };
    }
    
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan pada jaringan',
      status: 0,
    };
  }
};

/**
 * Fungsi helper untuk request GET
 */
export const get = <T>(endpoint: string, params?: Record<string, unknown>, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { 
    ...options, 
    method: 'GET',
    params: params && Object.keys(params).length > 0 ? params : undefined 
  });
};

/**
 * Fungsi helper untuk request POST
 */
export const post = <T, D = unknown>(endpoint: string, data?: D, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    data,
  });
};

/**
 * Fungsi helper untuk request PUT
 */
export const put = <T, D = unknown>(endpoint: string, data?: D, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    data,
  });
};

/**
 * Fungsi helper untuk request PATCH
 */
export const patch = <T, D = unknown>(endpoint: string, data?: D, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PATCH',
    data,
  });
};

/**
 * Fungsi helper untuk request DELETE
 */
export const del = <T>(endpoint: string, options?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, { 
    ...options, 
    method: 'DELETE' 
  });
}; 
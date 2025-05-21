// Re-ekspor semua fungsi API dari client.ts
export { 
  get, 
  post, 
  put, 
  patch, 
  del, 
  apiRequest,
  type ApiResponse,
  type ApiErrorResponse 
} from './client';

// Re-ekspor konfigurasi API dan axios instance
export { 
  API_BASE_URL,
  DEFAULT_REQUEST_CONFIG,
  axiosInstance
} from './config'; 
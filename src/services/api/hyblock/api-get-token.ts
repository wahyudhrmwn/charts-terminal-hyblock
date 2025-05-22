import { ApiResponse } from '../index';
import axios, { AxiosError } from 'axios';

// Interface untuk respons data token
export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

// Endpoint API Hyblock untuk token
const TOKEN_ENDPOINT = 'https://auth-api.hyblockcapital.com/oauth2/token';

/**
 * Parameter untuk mendapatkan token
 */
export interface TokenParams {
  /**
   * Client ID dari Hyblock
   */
  client_id: string;
  
  /**
   * Client Secret dari Hyblock
   */
  client_secret: string;
}

/**
 * Mendapatkan token autentikasi dari API Hyblock
 */
export const getToken = async (
  params: TokenParams
): Promise<ApiResponse<TokenResponse>> => {
  try {
    // Format body sebagai application/x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', params.client_id);
    formData.append('client_secret', params.client_secret);
    
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    };
    
    // Gunakan axios langsung untuk request token
    const response = await axios.post(TOKEN_ENDPOINT, formData, { headers });
    
    return {
      data: response.data,
      error: null,
      status: response.status,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Error getting token:', 
      axiosError.response?.data || axiosError.message);
    
    return {
      data: null,
      error: typeof axiosError.response?.data === 'object' && axiosError.response?.data && 'message' in axiosError.response.data
        ? (axiosError.response.data as {message: string}).message 
        : axiosError.message || 'Gagal mendapatkan token',
      status: axiosError.response?.status || 0,
    };
  }
}; 
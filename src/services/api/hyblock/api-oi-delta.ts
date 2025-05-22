import { ApiResponse } from '../index';
import { getStoredToken } from '../utils/tokenStorage';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config';

// Interface untuk respons data OI Delta
export interface OIDataDelta {
  openDate: number;
  cumulativeDelta: number;
}

// Endpoint API Hyblock Capital
const HYBLOCK_ENDPOINTS = {
  OI_DELTA: '/anchoredOIDelta',
};

/**
 * Parameter untuk mendapatkan data OI Delta
 */
export interface OIDeltaParams {
  // Required parameters
  /**
   * Masukkan coin yang valid.
   * Daftar coin beserta exchange yang mendukung tersedia di endpoint `/catalog`.
   * Contoh: "BTC"
   */
  coin: string;
  
  /**
   * Pilih jangka waktu data.
   * Tersedia: 1m, 5m, 15m, 1h, 4h, 1d
   * Contoh: "1m"
   */
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  
  // Optional parameters
  /**
   * Masukkan exchange yang valid. Bisa satu atau lebih, dipisahkan koma.
   * Default: Semua exchange
   * Contoh: "binance,coinbase"
   */
  exchange?: string;
  
  /**
   * Masukkan anchor period yang diinginkan.
   * Default: 1d
   * Contoh: "4h"
   * Pilihan Umum: 1h, 4h, 1d
   */
  anchor?: '1h' | '4h' | '1d';
  
  /**
   * Urutan hasil data.
   * Default: asc (Lama ke baru)
   * Contoh: "desc" (Baru ke lama)
   */
  sort?: 'asc' | 'desc';
  
  /**
   * Waktu mulai dalam format Unix timestamp (detik).
   * Default: Saat ini jika tidak diisi
   * Contoh: 1661236020
   */
  startTime?: number;
  
  /**
   * Waktu akhir dalam format Unix timestamp (detik).
   * Default: Saat ini jika tidak diisi
   * Contoh: 1661236035
   */
  endTime?: number;
  
  /**
   * Jumlah maksimum hasil yang ditampilkan.
   * Pilihan: 5, 10, 20, 50, 100, 500, 1000
   * Default: 50
   * Contoh: 100
   */
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000;
}

/**
 * Mendapatkan data OI Delta dengan parameter yang diperlukan
 */
export const getOIDelta = async (
  params: OIDeltaParams
): Promise<ApiResponse<OIDataDelta>> => {
  try {
    // Membangun URL dengan parameter query
    let url = `${API_BASE_URL}${HYBLOCK_ENDPOINTS.OI_DELTA}?coin=${params.coin}&timeframe=${params.timeframe}`;
    
    // Menambahkan parameter opsional jika ada
    if (params.exchange) url += `&exchange=${params.exchange}`;
    if (params.anchor) url += `&anchor=${params.anchor}`;
    if (params.sort) url += `&sort=${params.sort}`;
    if (params.startTime) url += `&startTime=${params.startTime}`;
    if (params.endTime) url += `&endTime=${params.endTime}`;
    if (params.limit) url += `&limit=${params.limit}`;
    
    // Ambil token dari localStorage
    const storedToken = getStoredToken();
    
    // Set headers secara eksplisit
    const headers = {
      'x-api-key': 'vun2VlZziE3xE8DCX37CWJadjV7XI3A7xVAXRmb7',
      'Authorization': `Bearer ${storedToken || ''}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    console.log('Request to:', url);
    console.log('With headers:', headers);
    
    // Gunakan axios langsung untuk request data
    const response = await axios.get(url, { headers });
    
    console.log('Response:', response.data);
    
    return {
      data: response.data,
      error: null,
      status: response.status
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Error fetching OI delta data:', 
      axiosError.response?.data || axiosError.message);
    
    return {
      data: null,
      error: typeof axiosError.response?.data === 'object' && axiosError.response?.data && 'message' in axiosError.response.data
        ? (axiosError.response.data as {message: string}).message 
        : axiosError.message || 'Gagal mendapatkan data OI delta',
      status: axiosError.response?.status || 0
    };
  }
}; 
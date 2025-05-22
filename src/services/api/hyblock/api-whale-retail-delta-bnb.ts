import { ApiResponse } from '../index';
import { getStoredToken } from '../utils/tokenStorage';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config';

// Interface untuk respons data Whale Retail Delta
export interface WhaleRetailDeltaData {
  openDate: number;
  whaleRetailDelta: number;
}

// Endpoint API Hyblock Capital
const HYBLOCK_ENDPOINTS = {
  WHALE_RETAIL_DELTA: '/binanceWhaleRetailDelta',
};

/**
 * Parameter untuk mendapatkan data Whale Retail Delta
 */
export interface WhaleRetailDeltaParams {
  // Required parameters
  /**
   * Masukkan coin yang valid.
   * Daftar coin beserta exchange yang mendukung tersedia di endpoint `/catalog`.
   * Contoh: "BTC"
   */
  coin: string;
  
  /**
   * Masukkan exchange yang valid.
   * Hanya satu exchange yang diperbolehkan. Lihat daftar exchange melalui endpoint `/catalog`.
   * Contoh: "binance"
   */
  exchange: string;
  
  /**
   * Pilih jangka waktu data.
   * Tersedia: 1m, 5m, 15m, 1h, 4h, 1d
   * Default: 1m
   * Contoh: "15m"
   */
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  
  // Optional parameters
  /**
   * Urutan hasil data.
   * Default: asc (Lama ke baru)
   * Contoh: "desc" (Baru ke lama)
   */
  sort?: 'asc' | 'desc';
  
  /**
   * Waktu mulai dalam format Unix timestamp (detik).
   * Default: Waktu saat ini jika tidak diisi
   * Contoh: 1661236020
   */
  startTime?: number;
  
  /**
   * Waktu akhir dalam format Unix timestamp (detik).
   * Default: Waktu saat ini jika tidak diisi
   * Contoh: 1661236120
   */
  endTime?: number;
  
  /**
   * Jumlah maksimum data yang ingin ditampilkan.
   * Pilihan: 5, 10, 20, 50, 100, 500, 1000
   * Default: 50
   * Contoh: 100
   */
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000;
}

/**
 * Mendapatkan data Whale Retail Delta dengan parameter yang diperlukan
 */
export const getWhaleRetailDelta = async (
  params: WhaleRetailDeltaParams
): Promise<ApiResponse<WhaleRetailDeltaData>> => {
  try {
    // Membangun URL dengan parameter query
    let url = `${API_BASE_URL}${HYBLOCK_ENDPOINTS.WHALE_RETAIL_DELTA}?coin=${params.coin}&exchange=${params.exchange}&timeframe=${params.timeframe}`;
    
    // Menambahkan parameter opsional jika ada
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
    console.error('Error fetching whale retail delta data:', 
      axiosError.response?.data || axiosError.message);
    
    return {
      data: null,
      error: typeof axiosError.response?.data === 'object' && axiosError.response?.data && 'message' in axiosError.response.data
        ? (axiosError.response.data as {message: string}).message 
        : axiosError.message || 'Gagal mendapatkan data whale retail delta',
      status: axiosError.response?.status || 0
    };
  }
}; 
import { ApiResponse } from '../index';
import { getStoredToken } from '../utils/tokenStorage';
import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../config';

// Interface untuk respons data True Retail Long Short
export interface TopTraderLongShortData {
  openDate: number;
  longPct: number;
  shortPct: number;
  lsRatio: number;
}

// Endpoint API Hyblock Capital
const HYBLOCK_ENDPOINTS = {
  TOP_TRADER_LONG_SHORT: '/binanceTopTraderPositions',
};

/**
 * ## 📘 API Parameter Guide – Market Data Endpoint
 */
export interface TopTraderLongShortParams {
  // 🔑 Required Parameters
  
  /**
   * **Deskripsi:** Masukkan coin yang valid.
   * **Catatan:** Semua coin yang didukung beserta exchange-nya dapat dilihat melalui endpoint `/catalog`.
   * **Contoh:** `"BTC"`
   */
  coin: string;
  
  /**
   * **Deskripsi:** Masukkan exchange yang valid.
   * **Catatan:** Hanya satu exchange yang diperbolehkan. Daftar lengkap tersedia di endpoint `/catalog`.
   * **Contoh:** `"binance"`
   */
  exchange: string;
  
  /**
   * **Deskripsi:** Pilih interval waktu data.
   * **Pilihan Tersedia:**
   * * `1m`
   * * `5m`
   * * `15m`
   * * `1h`
   * * `4h`
   * * `1d`
   * **Default:** `1m`
   * **Contoh:** `"5m"`
   */
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  
  // ⚙️ Optional Parameters
  
  /**
   * **Deskripsi:** Urutan data yang ditampilkan.
   * **Pilihan Tersedia:**
   * * `asc` → Urut dari lama ke baru
   * * `desc` → Urut dari baru ke lama
   * **Default:** `asc`
   * **Contoh:** `"desc"`
   */
  sort?: 'asc' | 'desc';
  
  /**
   * **Deskripsi:** Waktu mulai dalam Unix timestamp (detik).
   * **Default:** Saat ini jika tidak diisi
   * **Contoh:** `1661236020`
   */
  startTime?: number;
  
  /**
   * **Deskripsi:** Waktu akhir dalam Unix timestamp (detik).
   * **Default:** Saat ini jika tidak diisi
   * **Contoh:** `1661236120`
   */
  endTime?: number;
  
  /**
   * **Deskripsi:** Jumlah maksimum hasil yang dikembalikan.
   * **Pilihan Tersedia:**
   * * `5`
   * * `10`
   * * `20`
   * * `50`
   * * `100`
   * * `500`
   * * `1000`
   * **Default:** `50`
   * **Contoh:** `100`
   */
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000;
}

/**
 * Mendapatkan data True Retail Long Short dengan parameter yang diperlukan
 */
export const getTopTraderLongShort = async (
  params: TopTraderLongShortParams
): Promise<ApiResponse<TopTraderLongShortData>> => {
  try {
    // Membangun URL dengan parameter query
    let url = `${API_BASE_URL}${HYBLOCK_ENDPOINTS.TOP_TRADER_LONG_SHORT}?coin=${params.coin}&exchange=${params.exchange}&timeframe=${params.timeframe}`;
    
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
    
    // Gunakan axios langsung untuk request data
    const response = await axios.get(url, { headers });
    
    return {
      data: response.data,
      error: null,
      status: response.status
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    console.error('Error fetching true retail long short data:', 
      axiosError.response?.data || axiosError.message);
    
    return {
      data: null,
      error: typeof axiosError.response?.data === 'object' && axiosError.response?.data && 'message' in axiosError.response.data
        ? (axiosError.response.data as {message: string}).message 
        : axiosError.message || 'Gagal mendapatkan data true retail long short',
      status: axiosError.response?.status || 0
    };
  }
}; 
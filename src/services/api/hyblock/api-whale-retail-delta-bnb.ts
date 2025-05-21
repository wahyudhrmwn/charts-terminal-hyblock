import { get, ApiResponse } from '../index';

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
export const getWhaleRetailDelta = (
  params: WhaleRetailDeltaParams
): Promise<ApiResponse<WhaleRetailDeltaData>> => {
  // Mengirim parameter required
  const queryParams: Record<string, unknown> = {
    coin: params.coin,
    exchange: params.exchange,
    timeframe: params.timeframe
  };
  
  // Menambahkan parameter opsional hanya jika disediakan
  if (params.sort !== undefined) queryParams.sort = params.sort;
  if (params.startTime !== undefined) queryParams.startTime = params.startTime;
  if (params.endTime !== undefined) queryParams.endTime = params.endTime;
  if (params.limit !== undefined) queryParams.limit = params.limit;
  
  return get<WhaleRetailDeltaData>(HYBLOCK_ENDPOINTS.WHALE_RETAIL_DELTA, queryParams);
}; 
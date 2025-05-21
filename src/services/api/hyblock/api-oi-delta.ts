import { get, ApiResponse } from '../index';

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
export const getOIDelta = (
  params: OIDeltaParams
): Promise<ApiResponse<OIDataDelta>> => {
  // Hanya mengirim parameter yang required (coin dan timeframe)
  const queryParams: Record<string, unknown> = {
    coin: params.coin,
    timeframe: params.timeframe
  };
  
  // Menambahkan parameter opsional hanya jika disediakan
  if (params.exchange !== undefined) queryParams.exchange = params.exchange;
  if (params.anchor !== undefined) queryParams.anchor = params.anchor;
  if (params.sort !== undefined) queryParams.sort = params.sort;
  if (params.startTime !== undefined) queryParams.startTime = params.startTime;
  if (params.endTime !== undefined) queryParams.endTime = params.endTime;
  if (params.limit !== undefined) queryParams.limit = params.limit;
  
  return get<OIDataDelta>(HYBLOCK_ENDPOINTS.OI_DELTA, queryParams);
}; 
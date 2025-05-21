import { get, ApiResponse } from '../index';

// Interface untuk respons data Volume Delta
export interface VolDeltaData {
  openDate: number;
  volumeDelta: number;
}

// Endpoint API Hyblock Capital
const HYBLOCK_ENDPOINTS = {
  VOL_DELTA: '/volumeDelta',
};

/**
 * Parameter untuk mendapatkan data Volume Delta
 */
export interface VolDeltaParams {
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
   * Jenis pasar yang ingin digunakan.
   * Default: All
   * Contoh: "Spot"
   */
  marketTypes?: 'All' | 'Spot' | 'Perpetuals';
  
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
   * Filter berdasarkan rentang volume transaksi. Bisa mengisi beberapa bucket dipisahkan koma.
   * Bucket Ranges:
   * `1` = 0–100
   * `2` = 100–1K
   * `3` = 1K–10K
   * `4` = 10K–100K
   * `5` = 100K–1M
   * `6` = 1M–10M
   * `7` = >10M
   * Default: Semua
   * Contoh: "2,3"
   */
  bucket?: string;
  
  /**
   * Jumlah maksimum hasil yang ditampilkan.
   * Pilihan: 5, 10, 20, 50, 100, 500, 1000
   * Default: 50
   * Contoh: 100
   */
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000;
}

/**
 * Mendapatkan data Volume Delta dengan parameter yang diperlukan
 */
export const getVolDelta = (
  params: VolDeltaParams
): Promise<ApiResponse<VolDeltaData>> => {
  // Hanya mengirim parameter yang required (coin dan timeframe)
  const queryParams: Record<string, unknown> = {
    coin: params.coin,
    timeframe: params.timeframe
  };
  
  // Menambahkan parameter opsional hanya jika disediakan
  if (params.exchange !== undefined) queryParams.exchange = params.exchange;
  if (params.marketTypes !== undefined) queryParams.marketTypes = params.marketTypes;
  if (params.sort !== undefined) queryParams.sort = params.sort;
  if (params.startTime !== undefined) queryParams.startTime = params.startTime;
  if (params.endTime !== undefined) queryParams.endTime = params.endTime;
  if (params.bucket !== undefined) queryParams.bucket = params.bucket;
  if (params.limit !== undefined) queryParams.limit = params.limit;
  
  return get<VolDeltaData>(HYBLOCK_ENDPOINTS.VOL_DELTA, queryParams);
}; 
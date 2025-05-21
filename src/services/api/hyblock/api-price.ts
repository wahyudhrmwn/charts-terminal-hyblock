import { get, ApiResponse } from '../index';

// Interface untuk respons data Bid/Ask
export interface BidAskData {
  openDate: number;
  ask: number;
  bid: number;
}

// Endpoint API Hyblock Capital
const HYBLOCK_ENDPOINTS = {
  BID_ASK: '/bidAsk',
};

/**
 * Parameter untuk mendapatkan data Bid/Ask
 */
export interface BidAskParams {
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
   * Kedalaman data orderbook yang ingin ditampilkan.
   * Format: Tuple berisi dua nilai, misalnya "quote,20"
   * Pilihan yang Valid: 0, quote, 1, 2, 5, 10, 20, full
   * Aturan Penggunaan:
   * - "0,full" → Semua depth (quote, 1, 2, 5, 10, 20, full)
   * - "quote,20" → quote hingga 20
   * Default: "0,full"
   * Contoh: "quote,10"
   */
  depth?: string;
  
  /**
   * Jumlah maksimum hasil yang ditampilkan.
   * Pilihan: 5, 10, 20, 50, 100, 500, 1000
   * Default: 50
   * Contoh: 100
   */
  limit?: 5 | 10 | 20 | 50 | 100 | 500 | 1000;
}

/**
 * Mendapatkan data Bid/Ask dengan parameter yang diperlukan
 */
export const getBidAsk = (
  params: BidAskParams
): Promise<ApiResponse<BidAskData>> => {
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
  if (params.depth !== undefined) queryParams.depth = params.depth;
  if (params.limit !== undefined) queryParams.limit = params.limit;
  
  return get<BidAskData>(HYBLOCK_ENDPOINTS.BID_ASK, queryParams);
}; 
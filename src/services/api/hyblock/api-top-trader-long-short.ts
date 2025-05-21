import { get, ApiResponse } from '../index';

// Interface untuk respons data True Retail Long Short
export interface TrueRetailLongShortData {
  openDate: number;
  longPct: number;
  shortPct: number;
  lsRatio: number;
}

// Endpoint API Hyblock Capital
const HYBLOCK_ENDPOINTS = {
  TRUE_RETAIL_LONG_SHORT: '/binanceTrueRetailLongShort',
};

/**
 * ## 📘 API Parameter Guide – Market Data Endpoint
 */
export interface TrueRetailLongShortParams {
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
export const getTrueRetailLongShort = (
  params: TrueRetailLongShortParams
): Promise<ApiResponse<TrueRetailLongShortData>> => {
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
  
  return get<TrueRetailLongShortData>(HYBLOCK_ENDPOINTS.TRUE_RETAIL_LONG_SHORT, queryParams);
}; 
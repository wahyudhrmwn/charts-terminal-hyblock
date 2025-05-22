import { getToken, TokenParams } from '../hyblock/api-get-token';

// Kunci untuk menyimpan token di localStorage
const TOKEN_KEY = 'hyblock_auth_token';
const TOKEN_EXPIRY_KEY = 'hyblock_auth_token_expiry';

/**
 * Mengambil token dari localStorage
 */
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Menyimpan token ke localStorage
 */
export const storeToken = (token: string, expiresIn: number): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  
  // Simpan waktu kedaluwarsa token (waktu saat ini + expiresIn dalam detik)
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Memeriksa apakah token masih valid
 */
export const isTokenValid = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(TOKEN_KEY);
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  
  if (!token || !expiryTime) return false;
  
  // Cek apakah token sudah kedaluwarsa
  return Date.now() < parseInt(expiryTime, 10);
};

/**
 * Mendapatkan token baru dan menyimpannya ke localStorage
 */
export const refreshToken = async (params: TokenParams): Promise<string | null> => {
  try {
    const response = await getToken(params);
    
    if (response.data && response.error === null) {
      const { access_token, expires_in } = response.data;
      storeToken(access_token, expires_in);
      return access_token;
    }
    
    console.error('Gagal mendapatkan token:', response.error);
    return null;
  } catch (error) {
    console.error('Error mendapatkan token:', error);
    return null;
  }
};

/**
 * Mendapatkan token yang valid (dari localStorage atau API jika perlu refresh)
 */
export const getValidToken = async (params: TokenParams): Promise<string | null> => {
  // Cek token di localStorage
  if (isTokenValid()) {
    return getStoredToken();
  }
  
  // Jika token tidak ada atau sudah kedaluwarsa, minta token baru
  return refreshToken(params);
}; 
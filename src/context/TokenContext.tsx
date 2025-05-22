'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getValidToken, isTokenValid, getStoredToken } from '@/services/api/utils/tokenStorage';

interface TokenContextProps {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
}

const TokenContext = createContext<TokenContextProps>({
  token: null,
  isLoading: true,
  error: null,
  refreshToken: async () => {}
});

export const useToken = () => useContext(TokenContext);

export const TokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // API key dan client secret yang benar
      const clientId = 'vun2VlZziE3xE8DCX37CWJadjV7XI3A7xVAXRmb7';
      const clientSecret = 'a7cc8c6f-d5f2-4ac1-8eba-7a49f8ed7cbf';
      
      console.log('Mengambil token baru dengan credentials:', { clientId });
      
      const newToken = await getValidToken({
        client_id: clientId,
        client_secret: clientSecret
      });
      
      if (newToken) {
        setToken(newToken);
        console.log('Token berhasil diperbarui');
      } else {
        throw new Error('Gagal mendapatkan token');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendapatkan token');
      console.error('Error mendapatkan token:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mendapatkan token saat aplikasi pertama kali load
  useEffect(() => {
    // Cek apakah token sudah ada dan masih valid
    if (isTokenValid()) {
      // Jika token valid, gunakan dari localStorage
      const storedToken = getStoredToken();
      setToken(storedToken);
      setIsLoading(false);
      console.log('Menggunakan token yang sudah ada di localStorage');
    } else {
      // Jika tidak ada token atau sudah expired, minta token baru
      fetchToken();
    }
  }, []);

  return (
    <TokenContext.Provider
      value={{
        token,
        isLoading,
        error,
        refreshToken: fetchToken
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}; 
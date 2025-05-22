import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { getStoredToken } from "./utils/tokenStorage";

// Konfigurasi dasar untuk API
export const API_BASE_URL = "https://api1.hyblockcapital.com/v1";

// Konfigurasi request default untuk axios
export const DEFAULT_REQUEST_CONFIG: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "vun2VlZziE3xE8DCX37CWJadjV7XI3A7xVAXRmb7",
  },
  timeout: 30000, // 30 detik
};

// Status kode untuk menentukan apakah request berhasil
export const SUCCESS_STATUS_CODES = [200, 201, 204];

// Membuat instance axios dengan konfigurasi default
export const axiosInstance = axios.create(DEFAULT_REQUEST_CONFIG);

// Interceptor untuk menangani request
axiosInstance.interceptors.request.use(
  (config) => {
    // Pastikan header selalu tersedia
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    // Ambil token dari localStorage pada saat request dibuat
    const storedToken = getStoredToken();

    // Tambahkan atau perbarui header
    config.headers["x-api-key"] = "vun2VlZziE3xE8DCX37CWJadjV7XI3A7xVAXRmb7";

    // Gunakan token dari localStorage jika tersedia
    if (storedToken) {
      config.headers["Authorization"] = `Bearer ${storedToken}`;
    }

    config.headers["Accept"] = "application/json";

    // Debug: Log headers
    console.log("Request headers:", config.headers);
    console.log("Request URL:", config.url);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug: Log response
    console.log("Response status:", response.status);
    return response;
  },
  (error) => {
    // Handle error global
    console.error("API error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

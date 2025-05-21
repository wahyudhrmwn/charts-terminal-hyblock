import axios, { AxiosRequestConfig } from 'axios';

// Konfigurasi dasar untuk API
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.hyblock.capital';

// Konfigurasi request default untuk axios
export const DEFAULT_REQUEST_CONFIG: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 detik
};

// Status kode untuk menentukan apakah request berhasil
export const SUCCESS_STATUS_CODES = [200, 201, 204];

// Membuat instance axios dengan konfigurasi default
export const axiosInstance = axios.create(DEFAULT_REQUEST_CONFIG);

// Interceptor untuk menangani request
axiosInstance.interceptors.request.use(
  (config) => {
    // Kode untuk menambahkan token auth atau manipulasi request disini
    // Contoh: const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error global, seperti error jaringan, timeout, dll.
    return Promise.reject(error);
  }
); 
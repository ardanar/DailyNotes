import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { router } from 'expo-router';

// API base URL - environment variable'dan alınabilir veya sabit değer
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Axios instance oluştur
// Bu instance tüm API isteklerinde kullanılacak
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 saniye timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Her istekten önce çalışır
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // AsyncStorage'dan token'ı al
      const token = await AsyncStorage.getItem('access_token');
      
      // Token varsa Authorization header'ına ekle
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Token alınırken hata:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Her cevaptan önce çalışır
// Burada hata yönetimi yapıyoruz
axiosInstance.interceptors.response.use(
  (response) => {
    // Başarılı cevapları olduğu gibi döndür
    return response;
  },
  async (error) => {
    // 401 Unauthorized - Token geçersiz veya süresi dolmuş
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('access_token');
      router.replace('/login');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;


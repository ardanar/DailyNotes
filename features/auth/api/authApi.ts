import { apiClient } from '@/shared/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './types';

// Auth API servisleri
// Backend'e istek gönderen fonksiyonlar

export const authApi = {
  // Kayıt ol
  // POST /auth/register
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      // Kayıt olduktan sonra token kaydedilmez, kullanıcı login sayfasına yönlendirilir
      // Token sadece login'de kaydedilir
      return response;
    } catch (error: any) {
      // Debug için
      console.log('Register error:', {
        url: '/auth/register',
        data,
        error: error?.message,
        status: error?.status,
        response: error?.response?.data,
      });
      throw error;
    }
  },

  // Giriş yap
  // POST /auth/login
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    // Token'ı AsyncStorage'a kaydet
    if (response.access_token) {
      await AsyncStorage.setItem('access_token', response.access_token);
    }
    return response;
  },

  // Kullanıcı profil bilgisi
  // GET /auth/me
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response;
  },

  // Çıkış yap
  // Token'ı AsyncStorage'dan sil
  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
  },
};


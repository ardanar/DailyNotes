import axios, { AxiosError } from 'axios';
import axiosInstance from './axiosInstance';
import { ApiError } from './types';

// API client wrapper fonksiyonları
// Her feature kendi API servisinde bu fonksiyonları kullanabilir
// Bu sayede hata yönetimi ve tip güvenliği merkezi bir yerde olur

export const apiClient = {
  // GET isteği - Veri çekmek için
  // Örnek: apiClient.get<Note[]>('/notes')
  async get<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // POST isteği - Yeni veri oluşturmak için
  // Örnek: apiClient.post<Note>('/notes', { title: '...', content: '...' })
  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // PUT isteği - Veri güncellemek için (tüm alanları günceller)
  // Örnek: apiClient.put<Note>('/notes/123', { title: '...', content: '...' })
  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // PATCH isteği - Veri güncellemek için (sadece gönderilen alanları günceller)
  // Örnek: apiClient.patch<Note>('/notes/123', { title: 'Yeni başlık' })
  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    try {
      const response = await axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // DELETE isteği - Veri silmek için
  // Örnek: apiClient.delete('/notes/123')
  async delete<T>(url: string, config?: any): Promise<T> {
    try {
      const response = await axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Hata yönetimi helper fonksiyonu
// Backend'den gelen hataları ApiError formatına çevirir
function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data;
    
    // Backend'den gelen hata mesajını al
    let message = 'Bir hata oluştu';
    
    // 404 Not Found hatası için özel mesaj
    if (axiosError.response?.status === 404) {
      message = 'Endpoint bulunamadı. Lütfen API URL\'ini kontrol edin.';
    }
    // FastAPI formatında detail array'i varsa
    else if (responseData?.detail) {
      if (Array.isArray(responseData.detail) && responseData.detail.length > 0) {
        // Array formatında: [{ loc: [...], msg: "...", type: "..." }]
        message = responseData.detail[0].msg || responseData.detail[0].message || message;
      } else if (typeof responseData.detail === 'string') {
        // String formatında: "Hata mesajı"
        message = responseData.detail;
      }
    } 
    // Backend direkt message gönderiyorsa
    else if (responseData?.message) {
      message = responseData.message;
    }
    // Axios'un kendi mesajı
    else if (axiosError.message) {
      message = axiosError.message;
    }
    
    return {
      message,
      status: axiosError.response?.status,
      detail: Array.isArray(responseData?.detail) ? responseData.detail : undefined,
    };
  }
  
  // Axios hatası değilse (network hatası vs.)
  return {
    message: 'Beklenmeyen bir hata oluştu',
  };
}


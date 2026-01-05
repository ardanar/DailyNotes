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

// Backend'den gelen hata mesajlarını Türkçe'ye çevir
function translateErrorMessage(englishMessage: string, field?: string): string {
  const lowerMessage = englishMessage.toLowerCase();
  
  // Email ile ilgili hatalar
  if (lowerMessage.includes('email') || lowerMessage.includes('e-posta') || field === 'email') {
    if (lowerMessage.includes('required') || lowerMessage.includes('field required')) {
      return 'E-posta adresi gereklidir';
    }
    if (lowerMessage.includes('invalid') || lowerMessage.includes('value error') || lowerMessage.includes('not a valid')) {
      return 'Geçerli bir e-posta adresi giriniz';
    }
    if (lowerMessage.includes('already exists') || lowerMessage.includes('already registered') || lowerMessage.includes('duplicate')) {
      return 'Bu e-posta adresi zaten kullanılıyor';
    }
    if (lowerMessage.includes('not found')) {
      return 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı';
    }
  }
  
  // Şifre ile ilgili hatalar
  if (lowerMessage.includes('password') || lowerMessage.includes('şifre') || field === 'password') {
    if (lowerMessage.includes('required') || lowerMessage.includes('field required')) {
      return 'Şifre gereklidir';
    }
    if (lowerMessage.includes('too short') || lowerMessage.includes('minimum') || lowerMessage.includes('at least')) {
      return 'Şifre en az 6 karakter olmalıdır';
    }
    if (lowerMessage.includes('incorrect') || lowerMessage.includes('wrong') || lowerMessage.includes('invalid')) {
      return 'Şifre hatalı';
    }
  }
  
  // Ad soyad ile ilgili hatalar
  if (lowerMessage.includes('full_name') || lowerMessage.includes('full name') || field === 'full_name') {
    if (lowerMessage.includes('required') || lowerMessage.includes('field required')) {
      return 'Ad soyad gereklidir';
    }
  }
  
  // Genel hata mesajları
  if (lowerMessage.includes('unauthorized') || lowerMessage.includes('invalid credentials')) {
    return 'E-posta veya şifre hatalı';
  }
  if (lowerMessage.includes('not found')) {
    return 'Bulunamadı';
  }
  if (lowerMessage.includes('bad request') || lowerMessage.includes('validation error')) {
    return 'Geçersiz bilgiler. Lütfen kontrol edin';
  }
  if (lowerMessage.includes('network') || lowerMessage.includes('timeout')) {
    return 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin';
  }
  if (lowerMessage.includes('server error') || lowerMessage.includes('internal error')) {
    return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin';
  }
  
  // Eğer mesaj zaten Türkçe karakterler içeriyorsa olduğu gibi döndür
  if (/[ğüşıöçĞÜŞİÖÇ]/.test(englishMessage)) {
    return englishMessage;
  }
  
  // Diğer durumlarda genel mesaj
  return 'Bir hata oluştu. Lütfen tekrar deneyin';
}

// Hata yönetimi helper fonksiyonu
// Backend'den gelen hataları ApiError formatına çevirir
function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data;
    
    // Backend'den gelen hata mesajını al
    let message = 'Bir hata oluştu';
    
    // HTTP status koduna göre özel mesajlar
    if (axiosError.response?.status === 401) {
      message = 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.';
    } else if (axiosError.response?.status === 404) {
      message = 'İstenen kaynak bulunamadı';
    } else if (axiosError.response?.status === 400) {
      message = 'Geçersiz bilgiler. Lütfen kontrol edin.';
    } else if (axiosError.response?.status === 409) {
      message = 'Bu e-posta adresi zaten kullanılıyor.';
    } else if (axiosError.response?.status === 500) {
      message = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
    } else if (axiosError.response?.status === 0 || !axiosError.response) {
      message = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
    }
    // FastAPI formatında detail array'i varsa
    else if (responseData?.detail) {
      if (Array.isArray(responseData.detail) && responseData.detail.length > 0) {
        // Array formatında: [{ loc: [...], msg: "...", type: "..." }]
        const firstError = responseData.detail[0];
        const field = firstError.loc?.[firstError.loc.length - 1];
        const englishMsg = firstError.msg || firstError.message || '';
        message = translateErrorMessage(englishMsg, field);
      } else if (typeof responseData.detail === 'string') {
        // String formatında: "Hata mesajı"
        message = translateErrorMessage(responseData.detail);
      }
    } 
    // Backend direkt message gönderiyorsa
    else if (responseData?.message) {
      message = translateErrorMessage(responseData.message);
    }
    // Axios'un kendi mesajı
    else if (axiosError.message) {
      message = translateErrorMessage(axiosError.message);
    }
    
    return {
      message,
      status: axiosError.response?.status,
      detail: Array.isArray(responseData?.detail) ? responseData.detail : undefined,
    };
  }
  
  // Axios hatası değilse (network hatası vs.)
  return {
    message: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
  };
}


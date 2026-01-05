// shared/api/types.ts
// Tüm feature'lar tarafından kullanılabilecek
// genel API response ve error tipleri

// Backend genelde şu yapıda cevap döner:
// { success: boolean; message?: string; data: T }
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// FastAPI validation error formatı
export interface ValidationErrorDetail {
  loc: (string | number)[]; // Hatanın hangi field'da olduğu (örn: ["body", "email"])
  msg: string; // Hata mesajı
  type: string; // Hata tipi (örn: "value_error")
}

// Backend'den gelen hata formatı
export interface BackendErrorResponse {
  detail: ValidationErrorDetail[];
}

// Hata durumunda kullanacağımız tip
export interface ApiError {
  message: string;
  status?: number;
  // FastAPI validation errors
  detail?: ValidationErrorDetail[];
}

// Sayfalama (listeleme endpoint'leri için)
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}



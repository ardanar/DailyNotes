// Auth API Request ve Response tipleri

// Kayıt ol request
export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
}

// Giriş yap request
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth response (login ve register'dan dönen)
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Kullanıcı bilgileri (GET /auth/me)
export interface User {
  id: number;
  full_name: string;
  email: string;
  created_at: string; // ISO date string
}


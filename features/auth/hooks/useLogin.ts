import { useState } from 'react';
import { authApi } from '../api/authApi';
import { LoginRequest, AuthResponse } from '../api/types';
import { ApiError } from '@/shared/api/types';

// useLogin hook'u
// Giriş yapmak için kullanılır

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const login = async (data: LoginRequest): Promise<AuthResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
}


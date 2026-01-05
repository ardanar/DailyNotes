import { useState } from 'react';
import { authApi } from '../api/authApi';
import { RegisterRequest, AuthResponse } from '../api/types';
import { ApiError } from '@/shared/api/types';

// useRegister hook'u
// Kayıt olmak için kullanılır

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const register = async (data: RegisterRequest): Promise<AuthResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(data);
      return response;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
}


import { ApiError } from '@/shared/api/types';
import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { User } from '../api/types';

// useProfile hook'u
// Kullanıcı profil bilgisini getirmek için kullanılır

export function useProfile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = await authApi.getProfile();
      setProfile(user);
    } catch (err) {
      setError(err as ApiError);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}


import { ApiError } from '@/shared/api/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { notesApi } from '../api/notesApi';
import { Note } from '../types';

// useNotes hook'u
// Tüm notları API'den çeker ve yönetir
// Component'lerde kullanım: const { notes, loading, error, refetch } = useNotes();

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Notları API'den çek
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (err) {
      setError(err as ApiError);
      // Hata durumunda notları temizle
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda ve token değiştiğinde notları çek
  useEffect(() => {
    const checkTokenAndFetch = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        // Token varsa notları çek
        fetchNotes();
      } else {
        // Token yoksa notları temizle
        setNotes([]);
        setLoading(false);
      }
    };

    checkTokenAndFetch();
  }, []);

  return {
    notes,        
    loading,      
    error,        
    refetch: fetchNotes,
  };
}


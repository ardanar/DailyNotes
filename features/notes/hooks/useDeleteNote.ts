import { ApiError } from '@/shared/api/types';
import { useState } from 'react';
import { notesApi } from '../api/notesApi';

// useDeleteNote hook'u
// Bir notu silmek için kullanılır
// Component'lerde kullanım: const { deleteNote, loading, error } = useDeleteNote();

export function useDeleteNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Notu sil
  const deleteNote = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await notesApi.delete(id);
      return true; // Başarılı
    } catch (err) {
      setError(err as ApiError);
      return false; // Hata
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteNote,
    loading,
    error,
  };
}


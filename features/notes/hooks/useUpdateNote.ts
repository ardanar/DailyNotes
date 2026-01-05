import { useState } from 'react';
import { notesApi } from '../api/notesApi';
import { UpdateNoteRequest } from '../api/types';
import { Note } from '../types';
import { ApiError } from '@/shared/api/types';

// useUpdateNote hook'u
// Mevcut bir notu güncellemek için kullanılır
// Component'lerde kullanım: const { updateNote, loading, error } = useUpdateNote();

export function useUpdateNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Notu güncelle
  const updateNote = async (id: string, note: UpdateNoteRequest): Promise<Note | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedNote = await notesApi.update(id, note);
      return updatedNote;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateNote,
    loading,
    error,
  };
}


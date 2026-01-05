import { ApiError } from '@/shared/api/types';
import { useState } from 'react';
import { notesApi } from '../api/notesApi';
import { CreateNoteRequest } from '../api/types';
import { Note } from '../types';

// useCreateNote hook'u
// Yeni not oluşturmak için kullanılır
// Component'lerde kullanım: const { createNote, loading, error } = useCreateNote();

export function useCreateNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  // Yeni not oluştur
  const createNote = async (note: CreateNoteRequest): Promise<Note | null> => {
    try {
      setLoading(true);
      setError(null);
      const createdNote = await notesApi.create(note);
      return createdNote;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createNote,  
    loading,     
    error,        
  };
}


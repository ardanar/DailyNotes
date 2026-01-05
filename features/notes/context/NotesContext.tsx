import { ApiError } from '@/shared/api/types';
import React, { createContext, ReactNode, useContext } from 'react';
import { CreateNoteRequest, UpdateNoteRequest } from '../api/types';
import { useCreateNote, useDeleteNote, useNotes as useNotesHook, useUpdateNote } from '../hooks';
import { Note } from '../types';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  error: ApiError | null;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  updateNote: (id: string, note: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  refetch: () => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: ReactNode }) {
  // API hooks'larını kullan
  const { notes, loading, error: notesError, refetch } = useNotesHook();
  const { createNote: createNoteApi, loading: creating } = useCreateNote();
  const { updateNote: updateNoteApi, loading: updating } = useUpdateNote();
  const { deleteNote: deleteNoteApi, loading: deleting } = useDeleteNote();

  // Not oluştur
  const addNote = async (note: Omit<Note, 'id' | 'createdAt'>) => {
    const createRequest: CreateNoteRequest = {
      title: note.title,
      content: note.content,
      mod: note.mod,
      energy_level: note.energy_level,
    };

    const createdNote = await createNoteApi(createRequest);
    if (createdNote) {
      // Başarılı - liste otomatik yenilenecek (useNotes hook'u refetch edecek)
      refetch();
    } else {
      throw new Error('Not oluşturulamadı');
    }
  };

  // Notu güncelle
  const updateNote = async (id: string, note: Omit<Note, 'id' | 'createdAt'>) => {
    const updateRequest: UpdateNoteRequest = {
      title: note.title,
      content: note.content,
      mod: note.mod,
      energy_level: note.energy_level,
    };

    const updatedNote = await updateNoteApi(id, updateRequest);
    if (updatedNote) {
      // Başarılı - liste otomatik yenilenecek
      refetch();
    } else {
      throw new Error('Not güncellenemedi');
    }
  };

  // Notu sil
  const deleteNote = async (id: string) => {
    const success = await deleteNoteApi(id);
    if (success) {
      // Başarılı - liste otomatik yenilenecek
      refetch();
    } else {
      throw new Error('Not silinemedi');
    }
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading: loading || creating || updating || deleting,
        error: notesError,
        addNote,
        updateNote,
        deleteNote,
        refetch,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}


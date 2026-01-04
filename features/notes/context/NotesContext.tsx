import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Note } from '../types';

interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  updateNote: (id: string, note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Proje Toplantısı',
    content: 'Yarın saat 14:00\'te ekibimizle yeni proje hakkında toplantı yapacağız. Gündem maddelerini hazırlamayı unutma.',
    mod: 'important',
    energyLevel: 'high',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 saat önce
  },
  {
    id: '2',
    title: 'Alışveriş Listesi',
    content: 'Market alışverişi: Süt, yumurta, ekmek, meyve ve sebze. Ayrıca temizlik malzemeleri de alınmalı.',
    mod: 'normal',
    energyLevel: 'medium',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 saat önce
  },
  {
    id: '3',
    title: 'Acil: Faturalar',
    content: 'Elektrik ve su faturalarını bu hafta içinde ödemem gerekiyor. Son ödeme tarihi: 15 Ocak',
    mod: 'urgent',
    energyLevel: 'high',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 gün önce
  },
  {
    id: '4',
    title: 'Spor Programı',
    content: 'Haftalık spor rutinimi güncelle: Pazartesi koşu, Çarşamba yoga, Cuma ağırlık antrenmanı',
    mod: 'normal',
    energyLevel: 'medium',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 gün önce
  },
];

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>(mockNotes);

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, note: Omit<Note, 'id' | 'createdAt'>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            ...note,
          };
        }
        return n;
      })
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
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


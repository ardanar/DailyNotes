import { apiClient } from '@/shared/api';
import { Note } from '../types';
import { CreateNoteRequest, NoteResponse, noteResponseToNote, UpdateNoteRequest } from './types';

// Notes API servisleri
// Backend'e istek gönderen fonksiyonlar
// Her fonksiyon apiClient'ı kullanarak backend ile iletişim kurar

export const notesApi = {
  // Tüm notları getir
  // GET /notes
  async getAll(): Promise<Note[]> {
    const response = await apiClient.get<NoteResponse[]>('/notes');
    // Backend'den gelen her notu uygulama formatına çevir
    return response.map(noteResponseToNote);
  },

  // Tek bir notu getir
  // GET /notes/:note_id
  async getById(id: string): Promise<Note> {
    const response = await apiClient.get<NoteResponse>(`/notes/${id}`);
    // Backend'den gelen notu uygulama formatına çevir
    return noteResponseToNote(response);
  },

  // Yeni not oluştur
  // POST /notes
  async create(note: CreateNoteRequest): Promise<Note> {
    const response = await apiClient.post<NoteResponse>('/notes', note);
    // Backend'den gelen notu uygulama formatına çevir
    return noteResponseToNote(response);
  },

  // Notu güncelle
  // PUT /notes/:note_id
  async update(id: string, note: UpdateNoteRequest): Promise<Note> {
    const response = await apiClient.put<NoteResponse>(`/notes/${id}`, note);
    // Backend'den gelen notu uygulama formatına çevir
    return noteResponseToNote(response);
  },

  // Notu sil
  // DELETE /notes/:note_id
  async delete(id: string): Promise<void> {
    await apiClient.delete<void>(`/notes/${id}`);
  },
};


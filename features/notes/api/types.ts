import { Note } from '../types';

// API Request tipleri - Backend'e gönderilecek veri formatları
// Uygulama ve backend aynı formatı (snake_case) kullandığı için dönüşüm gerekmez

// Yeni not oluştururken gönderilecek veri
// id ve createdAt backend tarafından oluşturulacak, bu yüzden burada yok
export interface CreateNoteRequest {
  title: string;
  content: string;
  mod: 'normal' | 'urgent' | 'important';
  energy_level: 'low' | 'medium' | 'high';
}

// Not güncellerken gönderilecek veri
// Tüm alanlar opsiyonel - sadece güncellenmek istenen alanlar gönderilir
export interface UpdateNoteRequest {
  title?: string;
  content?: string;
  mod?: 'normal' | 'urgent' | 'important';
  energy_level?: 'low' | 'medium' | 'high';
}

// API Response tipi - Backend'den gelen not formatı
// Backend'den created_at string olarak gelir (ISO date string)
export interface NoteResponse {
  id: string; // UUID formatında (dokümantasyona göre id, ama backend note_id döndürüyorsa note_id olabilir)
  title: string;
  content: string;
  mod: 'normal' | 'urgent' | 'important';
  energy_level: 'low' | 'medium' | 'high';
  created_at: string; // ISO date string (örn: "2024-01-15T10:30:00Z")
  user_id?: number; // Opsiyonel - dokümantasyonda var
}

// Helper fonksiyon: Backend'den gelen NoteResponse'u uygulama içinde kullandığımız Note tipine çevirir
// created_at string'den Date'e çevrilir
// id veya note_id'yi id'ye çevirir (uygulama içinde id kullanıyoruz)
export const noteResponseToNote = (response: NoteResponse | any): Note => ({
  id: response.note_id || response.id, // Backend note_id döndürüyorsa note_id, yoksa id kullan
  title: response.title,
  content: response.content,
  mod: response.mod,
  energy_level: response.energy_level,
  createdAt: new Date(response.created_at || response.createdAt), // Her iki formatı da destekle
});


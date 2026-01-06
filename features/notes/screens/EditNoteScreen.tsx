import AuthButton from '@/features/auth/components/AuthButton';
import AuthInput from '@/features/auth/components/AuthInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/NotesContext';
import { EnergyLevel, NoteMod } from '../types';
import { editNoteScreenStyles } from '../styles';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote, loading, updateError } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mod, setMod] = useState<NoteMod>('normal');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const note = notes.find((n) => n.id === id);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setMod(note.mod);
      setEnergyLevel(note.energy_level);
    }
  }, [note]);

  // Hata geldiğinde mesajı göster
  useEffect(() => {
    if (updateError) {
      const message = updateError.message || 'Not güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
      setErrorMessage(message);
    } else {
      setErrorMessage(null);
    }
  }, [updateError]);

  const handleUpdate = async () => {
    // Önce hata mesajını temizle
    setErrorMessage(null);

    if (!title.trim() || !content.trim() || !id) {
      setErrorMessage('Başlık ve not içeriği gereklidir.');
      return;
    }

    try {
      await updateNote(id, {
        title: title.trim(),
        content: content.trim(),
        mod,
        energy_level: energyLevel,
      });
      router.back();
    } catch (error) {
      // Hata durumunda kullanıcıya gösterilebilir
      const message = error instanceof Error ? error.message : 'Not güncellenirken bir hata oluştu. Lütfen tekrar deneyin.';
      setErrorMessage(message);
    }
  };

  const handleDelete = async () => {
    if (!id || !note) {
      return;
    }

    // Onay dialog'u göster
    Alert.alert(
      'Notu Sil',
      `"${note.title}" notunu silmek istediğinize emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(id);
              // Başarılı - ana sayfaya dön
              router.back();
            } catch (error) {
              console.error('Not silinirken hata:', error);
              Alert.alert('Hata', 'Not silinirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  if (!note) {
    return (
      <View style={editNoteScreenStyles.container}>
        <View style={editNoteScreenStyles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={editNoteScreenStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={editNoteScreenStyles.headerTitle}>Not Bulunamadı</Text>
          <View style={editNoteScreenStyles.deleteButton} />
        </View>
      </View>
    );
  }

  const modOptions: { value: NoteMod; label: string }[] = [
    { value: 'normal', label: 'Normal' },
    { value: 'important', label: 'Önemli' },
    { value: 'urgent', label: 'Acil' },
  ];

  const energyOptions: { value: EnergyLevel; label: string }[] = [
    { value: 'low', label: 'Düşük' },
    { value: 'medium', label: 'Orta' },
    { value: 'high', label: 'Yüksek' },
  ];

  return (
    <SafeAreaView style={editNoteScreenStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={editNoteScreenStyles.container}
      >
        <StatusBar style="auto" />
        {/* Header */}
        <View style={editNoteScreenStyles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={editNoteScreenStyles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={editNoteScreenStyles.headerTitle}>Notu Düzenle</Text>
          <TouchableOpacity
            onPress={handleDelete}
            style={editNoteScreenStyles.deleteButton}
            disabled={loading}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={editNoteScreenStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={editNoteScreenStyles.scrollView}
        >
          <View style={editNoteScreenStyles.content}>
            {/* Form */}
            <View style={editNoteScreenStyles.form}>
              <View style={editNoteScreenStyles.formContent}>
                {/* Title Input */}
                <View style={editNoteScreenStyles.inputWrapper}>
                  <AuthInput
                    label="Başlık"
                    placeholder="Not başlığını girin"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Content Input */}
                <View style={editNoteScreenStyles.textAreaContainer}>
                  <Text style={editNoteScreenStyles.label}>Not</Text>
                  <TextInput
                    style={editNoteScreenStyles.textArea}
                    placeholder="Notunuzu yazın..."
                    placeholderTextColor="#9CA3AF"
                    value={content}
                    onChangeText={setContent}
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                  />
                </View>

                {/* Mod Selection */}
                <View style={editNoteScreenStyles.selectionContainer}>
                  <Text style={editNoteScreenStyles.label}>Mod</Text>
                  <View style={editNoteScreenStyles.optionsContainer}>
                    {modOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          editNoteScreenStyles.optionButton,
                          mod === option.value && editNoteScreenStyles.optionButtonActive,
                        ]}
                        onPress={() => setMod(option.value)}
                      >
                        <Text
                          style={[
                            editNoteScreenStyles.optionText,
                            mod === option.value && editNoteScreenStyles.optionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Energy Level Selection */}
                <View style={editNoteScreenStyles.selectionContainer}>
                  <Text style={editNoteScreenStyles.label}>Enerji Durumu</Text>
                  <View style={editNoteScreenStyles.optionsContainer}>
                    {energyOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          editNoteScreenStyles.optionButton,
                          energyLevel === option.value && editNoteScreenStyles.optionButtonActive,
                        ]}
                        onPress={() => setEnergyLevel(option.value)}
                      >
                        <Text
                          style={[
                            editNoteScreenStyles.optionText,
                            energyLevel === option.value && editNoteScreenStyles.optionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              {/* Error Message */}
              {errorMessage && (
                <View style={editNoteScreenStyles.errorContainer}>
                  <Text style={editNoteScreenStyles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Update Button */}
              <AuthButton
                title={loading ? "Güncelleniyor..." : "Güncelle"}
                onPress={handleUpdate}
                style={editNoteScreenStyles.updateButton}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


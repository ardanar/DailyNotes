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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNotes } from '../context/NotesContext';
import { EnergyLevel, NoteMod } from '../types';

export default function EditNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, updateNote, deleteNote, loading } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mod, setMod] = useState<NoteMod>('normal');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');

  const note = notes.find((n) => n.id === id);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setMod(note.mod);
      setEnergyLevel(note.energy_level);
    }
  }, [note]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim() || !id) {
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
      console.error('Not güncellenemedi:', error);
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
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Bulunamadı</Text>
          <View style={styles.deleteButton} />
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="auto" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notu Düzenle</Text>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={loading}
        >
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <View style={styles.content}>
          {/* Form */}
          <View style={styles.form}>
            <View style={styles.formContent}>
              {/* Title Input */}
              <View style={styles.inputWrapper}>
                <AuthInput
                  label="Başlık"
                  placeholder="Not başlığını girin"
                  value={title}
                  onChangeText={setTitle}
                />
              </View>

              {/* Content Input */}
              <View style={styles.textAreaContainer}>
                <Text style={styles.label}>Not</Text>
                <TextInput
                  style={styles.textArea}
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
              <View style={styles.selectionContainer}>
                <Text style={styles.label}>Mod</Text>
                <View style={styles.optionsContainer}>
                  {modOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        mod === option.value && styles.optionButtonActive,
                      ]}
                      onPress={() => setMod(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          mod === option.value && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Energy Level Selection */}
              <View style={styles.selectionContainer}>
                <Text style={styles.label}>Enerji Durumu</Text>
                <View style={styles.optionsContainer}>
                  {energyOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        energyLevel === option.value && styles.optionButtonActive,
                      ]}
                      onPress={() => setEnergyLevel(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          energyLevel === option.value && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Update Button */}
            <AuthButton
              title={loading ? "Güncelleniyor..." : "Güncelle"}
              onPress={handleUpdate}
              style={styles.updateButton}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'space-between',
  },
  formContent: {
    gap: 20,
  },
  inputWrapper: {
    marginBottom: -4,
  },
  textAreaContainer: {
    marginBottom: -4,
  },
  textArea: {
    width: '100%',
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    fontSize: 16,
    color: '#111827',
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  selectionContainer: {
    marginBottom: 0,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
  updateButton: {
    marginTop: 0,
  },
});


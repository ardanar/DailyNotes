import AuthButton from '@/features/auth/components/AuthButton';
import AuthInput from '@/features/auth/components/AuthInput';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/NotesContext';
import { EnergyLevel, NoteMod } from '../types';

export default function CreateNoteScreen() {
  const { addNote, loading, createError } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mod, setMod] = useState<NoteMod>('normal');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('medium');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hata geldiğinde mesajı göster
  useEffect(() => {
    if (createError) {
      const message = createError.message || 'Not oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
      setErrorMessage(message);
    } else {
      setErrorMessage(null);
    }
  }, [createError]);

  const handleCreate = async () => {
    // Önce hata mesajını temizle
    setErrorMessage(null);

    if (!title.trim() || !content.trim()) {
      setErrorMessage('Başlık ve not içeriği gereklidir.');
      return;
    }

    try {
      await addNote({
        title: title.trim(),
        content: content.trim(),
        mod,
        energy_level: energyLevel,
      });
      router.back();
    } catch (error) {
      // Hata durumunda kullanıcıya gösterilebilir
      const message = error instanceof Error ? error.message : 'Not oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
      setErrorMessage(message);
    }
  };

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar style="auto" />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Yeni Not</Text>
              <View style={styles.placeholder} />
            </View>

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

              {/* Error Message */}
              {errorMessage && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Create Button */}
              <AuthButton
                title={loading ? "Oluşturuluyor..." : "Oluştur"}
                onPress={handleCreate}
                style={styles.createButton}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 48,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
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
  placeholder: {
    width: 40,
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
  createButton: {
    marginTop: 0,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
});


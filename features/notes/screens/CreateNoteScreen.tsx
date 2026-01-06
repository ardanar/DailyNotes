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
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/NotesContext';
import { createNoteScreenStyles } from '../styles';
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
    <SafeAreaView style={createNoteScreenStyles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={createNoteScreenStyles.container}
      >
        <StatusBar style="auto" />
        <ScrollView
          contentContainerStyle={createNoteScreenStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={createNoteScreenStyles.content}>
            {/* Header */}
            <View style={createNoteScreenStyles.header}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={createNoteScreenStyles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={createNoteScreenStyles.headerTitle}>Yeni Not</Text>
              <View style={createNoteScreenStyles.placeholder} />
            </View>

            {/* Form */}
            <View style={createNoteScreenStyles.form}>
              <View style={createNoteScreenStyles.formContent}>
                {/* Title Input */}
                <View style={createNoteScreenStyles.inputWrapper}>
                  <AuthInput
                    label="Başlık"
                    placeholder="Not başlığını girin"
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>

                {/* Content Input */}
                <View style={createNoteScreenStyles.textAreaContainer}>
                  <Text style={createNoteScreenStyles.label}>Not</Text>
                  <TextInput
                    style={createNoteScreenStyles.textArea}
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
                <View style={createNoteScreenStyles.selectionContainer}>
                  <Text style={createNoteScreenStyles.label}>Mod</Text>
                  <View style={createNoteScreenStyles.optionsContainer}>
                    {modOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          createNoteScreenStyles.optionButton,
                          mod === option.value && createNoteScreenStyles.optionButtonActive,
                        ]}
                        onPress={() => setMod(option.value)}
                      >
                        <Text
                          style={[
                            createNoteScreenStyles.optionText,
                            mod === option.value && createNoteScreenStyles.optionTextActive,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Energy Level Selection */}
                <View style={createNoteScreenStyles.selectionContainer}>
                  <Text style={createNoteScreenStyles.label}>Enerji Durumu</Text>
                  <View style={createNoteScreenStyles.optionsContainer}>
                    {energyOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          createNoteScreenStyles.optionButton,
                          energyLevel === option.value && createNoteScreenStyles.optionButtonActive,
                        ]}
                        onPress={() => setEnergyLevel(option.value)}
                      >
                        <Text
                          style={[
                            createNoteScreenStyles.optionText,
                            energyLevel === option.value && createNoteScreenStyles.optionTextActive,
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
                <View style={createNoteScreenStyles.errorContainer}>
                  <Text style={createNoteScreenStyles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Create Button */}
              <AuthButton
                title={loading ? "Oluşturuluyor..." : "Oluştur"}
                onPress={handleCreate}
                style={createNoteScreenStyles.createButton}
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


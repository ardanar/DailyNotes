import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNotes } from '@/features/notes/context/NotesContext';
import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';
import AuthPasswordInput from '../components/AuthPasswordInput';
import { useLogin } from '../hooks';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { login, loading, error } = useLogin();
  const { refetch } = useNotes();

  // Hata geldiğinde parse et ve ilgili alanlara ata
  const parseError = useCallback((error: any) => {
    // Önce tüm hataları temizle
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    if (!error) return;

    console.log('Parsing error:', { error, status: error.status, message: error.message });

    // Backend'den gelen validation error'ları parse et
    if (error.detail && Array.isArray(error.detail)) {
      error.detail.forEach((detail: any) => {
        const field = detail.loc?.[detail.loc.length - 1]; // Son eleman field adı
        const englishMessage = detail.msg || detail.message || '';

        // Türkçe hata mesajına çevir
        let turkishMessage = '';
        if (field === 'email') {
          if (englishMessage.toLowerCase().includes('required')) {
            turkishMessage = 'E-posta adresi gereklidir';
          } else if (englishMessage.toLowerCase().includes('invalid') || englishMessage.toLowerCase().includes('not a valid')) {
            turkishMessage = 'Geçerli bir e-posta adresi giriniz (örn: ornek@email.com)';
          } else if (englishMessage.toLowerCase().includes('not found')) {
            turkishMessage = 'Bu e-posta adresine kayıtlı kullanıcı bulunamadı';
          } else {
            turkishMessage = 'E-posta adresi geçersiz';
          }
          setEmailError(turkishMessage);
        } else if (field === 'password') {
          if (englishMessage.toLowerCase().includes('required')) {
            turkishMessage = 'Şifre gereklidir';
          } else if (englishMessage.toLowerCase().includes('too short') || englishMessage.toLowerCase().includes('minimum')) {
            turkishMessage = 'Şifre en az 6 karakter olmalıdır';
          } else if (englishMessage.toLowerCase().includes('incorrect') || englishMessage.toLowerCase().includes('wrong')) {
            turkishMessage = 'Şifre hatalı';
          } else {
            turkishMessage = 'Şifre geçersiz';
          }
          setPasswordError(turkishMessage);
        } else {
          // Türkçe karakter içeriyorsa olduğu gibi, yoksa genel mesaj
          turkishMessage = /[ğüşıöçĞÜŞİÖÇ]/.test(englishMessage) ? englishMessage : 'Geçersiz bilgi';
          setGeneralError(turkishMessage);
        }
      });
    } else {
      // Genel hata mesajı
      const errorMessage = error.message || 'Bir hata oluştu';
      
      // HTTP status koduna göre özel mesajlar
      if (error.status === 401) {
        setGeneralError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
      } else if (error.status === 404) {
        setGeneralError('Kullanıcı bulunamadı. Lütfen e-posta adresinizi kontrol edin.');
      } else if (error.status === 400) {
        setGeneralError('Geçersiz bilgiler. Lütfen kontrol edin.');
      } else if (error.status === 0 || !error.status) {
        setGeneralError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.');
      } else {
        // Türkçe karakter içeriyorsa olduğu gibi göster
        if (/[ğüşıöçĞÜŞİÖÇ]/.test(errorMessage)) {
          setGeneralError(errorMessage);
        } else {
          setGeneralError('Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      }
    }
  }, []);

  // Error değiştiğinde parse et
  useEffect(() => {
    if (error) {
      console.log('Login error detected:', error);
      parseError(error);
    } else {
      // Error null olduğunda hataları temizle
      setEmailError(null);
      setPasswordError(null);
      setGeneralError(null);
    }
  }, [error, parseError]);

  const handleLogin = async () => {
    // Önce hataları temizle
    setEmailError(null);
    setPasswordError(null);
    setGeneralError(null);

    if (!email.trim() || !password.trim()) {
      if (!email.trim()) {
        setEmailError('E-posta adresi gereklidir');
      }
      if (!password.trim()) {
        setPasswordError('Şifre gereklidir');
      }
      return;
    }

    const response = await login({
      email: email.trim(),
      password: password.trim(),
    });

    if (response) {
      // Başarılı - token otomatik kaydedildi
      // Notları yeniden çek (yeni kullanıcının notları için)
      refetch();
      router.replace('/(tabs)');
    }
  };

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
              <Text style={styles.title}>Hoş Geldiniz</Text>
              <Text style={styles.subtitle}>Giriş yaparak devam edin</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <AuthInput
                label="E-posta"
                placeholder="ornek@email.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError(null);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={emailError || undefined}
              />

              {/* Password Input */}
              <AuthPasswordInput
                label="Şifre"
                placeholder="Şifrenizi girin"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError(null);
                }}
                error={passwordError || undefined}
              />

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
              </TouchableOpacity>

              {/* General Error Message */}
              {generalError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{generalError}</Text>
                </View>
              )}

              {/* Login Button */}
              <AuthButton
                title={loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                onPress={handleLogin}
                disabled={loading}
              />

              {/* Register Link */}
              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Hesabınız yok mu? </Text>
                <TouchableOpacity onPress={() => router.push('/register')}>
                  <Text style={styles.registerLink}>Kayıt Ol</Text>
                </TouchableOpacity>
              </View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  registerLink: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
});

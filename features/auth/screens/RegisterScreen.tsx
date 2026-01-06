import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';
import AuthPasswordInput from '../components/AuthPasswordInput';
import { useRegister } from '../hooks';
import { registerScreenStyles } from '../styles';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullNameError, setFullNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const { register, loading, error } = useRegister();

  // Hata geldiğinde parse et ve ilgili alanlara ata
  const parseError = (error: any) => {
    // Önce tüm hataları temizle
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);

    if (!error) return;

    // Backend'den gelen validation error'ları parse et
    if (error.detail && Array.isArray(error.detail)) {
      error.detail.forEach((detail: any) => {
        const field = detail.loc?.[detail.loc.length - 1]; // Son eleman field adı
        const englishMessage = detail.msg || detail.message || '';

        // Türkçe hata mesajına çevir
        let turkishMessage = '';
        if (field === 'full_name') {
          if (englishMessage.toLowerCase().includes('required')) {
            turkishMessage = 'Ad soyad gereklidir';
          } else {
            turkishMessage = 'Ad soyad geçersiz';
          }
          setFullNameError(turkishMessage);
        } else if (field === 'email') {
          if (englishMessage.toLowerCase().includes('required')) {
            turkishMessage = 'E-posta adresi gereklidir';
          } else if (englishMessage.toLowerCase().includes('invalid') || englishMessage.toLowerCase().includes('not a valid')) {
            turkishMessage = 'Geçerli bir e-posta adresi giriniz (örn: ornek@email.com)';
          } else if (englishMessage.toLowerCase().includes('already exists') || englishMessage.toLowerCase().includes('already registered') || englishMessage.toLowerCase().includes('duplicate')) {
            turkishMessage = 'Bu e-posta adresi zaten kullanılıyor';
          } else {
            turkishMessage = 'E-posta adresi geçersiz';
          }
          setEmailError(turkishMessage);
        } else if (field === 'password') {
          if (englishMessage.toLowerCase().includes('required')) {
            turkishMessage = 'Şifre gereklidir';
          } else if (englishMessage.toLowerCase().includes('too short') || englishMessage.toLowerCase().includes('minimum') || englishMessage.toLowerCase().includes('at least')) {
            turkishMessage = 'Şifre en az 6 karakter olmalıdır';
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
      if (error.status === 400) {
        setGeneralError('Geçersiz bilgiler. Lütfen kontrol edin.');
      } else if (error.status === 409) {
        setEmailError('Bu e-posta adresi zaten kullanılıyor.');
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
  };

  // Error değiştiğinde parse et
  React.useEffect(() => {
    parseError(error);
  }, [error]);

  const handleRegister = async () => {
    // Önce tüm hataları temizle
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    setGeneralError(null);

    // Validasyon kontrolleri
    let hasError = false;

    if (!fullName.trim()) {
      setFullNameError('Ad soyad gereklidir');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('E-posta adresi gereklidir');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Geçerli bir e-posta adresi giriniz (örn: ornek@email.com)');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Şifre gereklidir');
      hasError = true;
    } else if (password.trim().length < 6) {
      setPasswordError('Şifre en az 6 karakter olmalıdır');
      hasError = true;
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Şifre tekrar gereklidir');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor. Lütfen tekrar kontrol edin.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const response = await register({
      full_name: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
    });

    if (response) {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={registerScreenStyles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={registerScreenStyles.container}
      >
        <StatusBar style="auto" />
        <ScrollView 
          contentContainerStyle={registerScreenStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={registerScreenStyles.content}>
            {/* Header */}
            <View style={registerScreenStyles.header}>
              <Text style={registerScreenStyles.title}>Kayıt Ol</Text>
              <Text style={registerScreenStyles.subtitle}>Hesabınızı oluşturun</Text>
            </View>

            {/* Form */}
            <View style={registerScreenStyles.form}>
              {/* Full Name Input */}
              <AuthInput
                label="Ad Soyad"
                placeholder="Adınız Soyadınız"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (fullNameError) setFullNameError(null);
                }}
                autoCapitalize="words"
                autoComplete="name"
                error={fullNameError || undefined}
              />

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
                  // Şifre değiştiğinde confirm password hatasını da kontrol et
                  if (confirmPassword && text !== confirmPassword) {
                    setConfirmPasswordError('Şifreler eşleşmiyor');
                  } else if (confirmPasswordError && text === confirmPassword) {
                    setConfirmPasswordError(null);
                  }
                }}
                error={passwordError || undefined}
              />

              {/* Confirm Password Input */}
              <AuthPasswordInput
                label="Şifre Tekrar"
                placeholder="Şifrenizi tekrar girin"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError(null);
                  // Şifreler eşleşmiyorsa hata göster
                  if (password && text !== password) {
                    setConfirmPasswordError('Şifreler eşleşmiyor');
                  }
                }}
                error={confirmPasswordError || undefined}
              />

              {/* General Error Message */}
              {generalError && (
                <View style={registerScreenStyles.errorContainer}>
                  <Text style={registerScreenStyles.errorText}>{generalError}</Text>
                </View>
              )}

              {/* Register Button */}
              <AuthButton
                title={loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                onPress={handleRegister}
                disabled={loading}
              />

              {/* Login Link */}
              <View style={registerScreenStyles.loginContainer}>
                <Text style={registerScreenStyles.loginText}>Zaten hesabınız var mı? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={registerScreenStyles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


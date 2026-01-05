import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import AuthButton from '../components/AuthButton';
import AuthInput from '../components/AuthInput';
import AuthPasswordInput from '../components/AuthPasswordInput';
import { useRegister } from '../hooks';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { register, loading, error } = useRegister();

  const handleRegister = async () => {
    setPasswordError(null);

    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Şifreler eşleşmiyor. Lütfen tekrar kontrol edin.');
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
            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>Hesabınızı oluşturun</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <AuthInput
              label="Ad Soyad"
              placeholder="Adınız Soyadınız"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoComplete="name"
            />

            {/* Email Input */}
            <AuthInput
              label="E-posta"
              placeholder="ornek@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {/* Password Input */}
            <AuthPasswordInput
              label="Şifre"
              placeholder="Şifrenizi girin"
              value={password}
              onChangeText={setPassword}
            />

            {/* Confirm Password Input */}
            <AuthPasswordInput
              label="Şifre Tekrar"
              placeholder="Şifrenizi tekrar girin"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                // Şifre değiştiğinde hata mesajını temizle
                if (passwordError) {
                  setPasswordError(null);
                }
              }}
            />

            {/* Password Mismatch Error */}
            {passwordError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{passwordError}</Text>
              </View>
            )}

            {/* API Error Message */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error.message}</Text>
              </View>
            )}

            {/* Register Button */}
            <AuthButton
              title={loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
              onPress={handleRegister}
              disabled={loading}
            />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
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

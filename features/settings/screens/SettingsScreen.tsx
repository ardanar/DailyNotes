import { authApi } from '@/features/auth/api/authApi';
import { useProfile } from '@/features/auth/hooks';
import { useNotes } from '@/features/notes/context/NotesContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { settingsScreenStyles } from '../styles';

export default function SettingsScreen() {
  const { refetch } = useNotes();
  const { profile, loading: profileLoading } = useProfile();

  const handleLogout = async () => {
    // Token'ı temizle
    await authApi.logout();
    // Notları temizlemek için refetch yap (token olmadığı için boş liste dönecek)
    refetch();
    // Login sayfasına yönlendir
    router.replace('/login');
  };

  return (
    <SafeAreaView style={settingsScreenStyles.safeArea}>
      <View style={settingsScreenStyles.container}>
        {/* Header */}
        <View style={settingsScreenStyles.header}>
          <View style={settingsScreenStyles.headerContent}>
            <Text style={settingsScreenStyles.headerTitle}>Ayarlar</Text>
          </View>
        </View>

        <ScrollView
          style={settingsScreenStyles.scrollView}
          contentContainerStyle={settingsScreenStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={settingsScreenStyles.contentInner}>
            {/* User Info Section */}
            <View style={settingsScreenStyles.userInfoSection}>
              <View style={settingsScreenStyles.avatarContainer}>
                <Ionicons name="person" size={40} color="#2563EB" />
              </View>
              <Text style={settingsScreenStyles.userName}>{profile?.full_name || 'Kullanıcı'}</Text>
              <Text style={settingsScreenStyles.userEmail}>{profile?.email || 'Email bilgisi yüklenemedi'}</Text>
            </View>

            {/* Spacer */}
            <View style={settingsScreenStyles.spacer} />

            {/* Logout Button */}
            <TouchableOpacity
              style={settingsScreenStyles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={settingsScreenStyles.logoutButtonText}>Çıkış Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}


import { authApi } from '@/features/auth/api/authApi';
import { useProfile } from '@/features/auth/hooks';
import { useNotes } from '@/features/notes/context/NotesContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ayarlar</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#2563EB" />
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'Kullanıcı'}</Text>
          <Text style={styles.userEmail}>{profile?.email || 'Email bilgisi yüklenemedi'}</Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  userInfoSection: {
    alignItems: 'center',
    paddingTop: 32,
  },
  spacer: {
    flex: 1,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingIndicator: {
    marginVertical: 8,
  },
  logoutButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

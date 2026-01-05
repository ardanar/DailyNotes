import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Token kontrolü
      const token = await AsyncStorage.getItem('access_token');
      
      if (token) {
        // Token varsa ana sayfaya yönlendir
        router.replace('/(tabs)');
      } else {
        // Token yoksa login sayfasına yönlendir
        router.replace('/login');
      }
    } catch (error) {
      // Hata durumunda login sayfasına yönlendir
      router.replace('/login');
    } finally {
      setIsLoading(false);
    }
  };

  // Yükleme sırasında spinner göster
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

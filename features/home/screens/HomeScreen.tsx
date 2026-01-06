import { useNotes } from '@/features/notes/context/NotesContext';
import { Note } from '@/features/notes/types';
import {
  formatDate,
  getEnergyText,
  getModColor,
  getModText,
} from '@/features/notes/utils/noteHelpers';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeScreenStyles } from '../styles';

export default function HomeScreen() {
  const { notes, loading, error, refetch } = useNotes();

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={homeScreenStyles.noteCard}
      onPress={() => router.push({ pathname: '/edit-note', params: { id: item.id } } as any)}
      activeOpacity={0.7}
    >
      <View style={homeScreenStyles.noteHeader}>
        <Text style={homeScreenStyles.noteTitle}>{item.title}</Text>
        <View
          style={[
            homeScreenStyles.modBadge,
            { backgroundColor: getModColor(item.mod) + '20' },
          ]}
        >
          <Text style={[homeScreenStyles.modText, { color: getModColor(item.mod) }]}>
            {getModText(item.mod)}
          </Text>
        </View>
      </View>
      <Text style={homeScreenStyles.noteContent} numberOfLines={3}>
        {item.content}
      </Text>
      <View style={homeScreenStyles.noteFooter}>
        <Text style={homeScreenStyles.noteDate}>{formatDate(item.createdAt)}</Text>
        <Text style={homeScreenStyles.energyText}>
          Enerji: {getEnergyText(item.energy_level)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={homeScreenStyles.safeArea}>
      <View style={homeScreenStyles.container}>
        {/* Header */}
        <View style={homeScreenStyles.header}>
          <View style={homeScreenStyles.headerContent}>
            <Text style={homeScreenStyles.headerTitle}>Günlük Notlarım</Text>
          </View>
        </View>

        {/* Notes List */}
        {loading && notes.length === 0 ? (
          <View style={[homeScreenStyles.loadingContainer, homeScreenStyles.maxWidthContainer]}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={homeScreenStyles.loadingText}>Notlar yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={[homeScreenStyles.errorContainer, homeScreenStyles.maxWidthContainer]}>
            <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
            <Text style={homeScreenStyles.errorText}>Bir hata oluştu</Text>
            <Text style={homeScreenStyles.errorSubtext}>{error.message}</Text>
            <TouchableOpacity
              style={homeScreenStyles.retryButton}
              onPress={refetch}
            >
              <Text style={homeScreenStyles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : notes.length === 0 ? (
          <View style={[homeScreenStyles.emptyContainer, homeScreenStyles.maxWidthContainer]}>
            <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
            <Text style={homeScreenStyles.emptyText}>Henüz notunuz yok</Text>
            <Text style={homeScreenStyles.emptySubtext}>
              Sağ alttaki butona basarak ilk notunuzu oluşturun
            </Text>
          </View>
        ) : (
          <FlatList
            data={notes}
            renderItem={renderNoteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[homeScreenStyles.listContent, homeScreenStyles.maxWidthContainer]}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={refetch}
          />
        )}

        {/* Floating Action Button */}
        <TouchableOpacity
          style={homeScreenStyles.fab}
          onPress={() => router.push('/create-note' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


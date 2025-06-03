import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  Search,
  Mic,
  Play,
  Pause,
  BadgeCheck,
  MapPin,
  Clock,
} from 'lucide-react-native';
import VoiceRecordModal from '@/components/VoiceRecordModal';

const MOCK_REQUESTS = [
  {
    id: '1',
    userImage:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    userName: 'John Smith',
    isVerified: true,
    timeAgo: '2h ago',
    transcription:
      'Need an emergency plumber for a leaking pipe in the kitchen.',
    distance: '2.5 km',
    location: 'San Francisco',
    status: 'Accepted by 3 providers',
    statusColor: '#4CAF50',
  },
  {
    id: '2',
    userImage:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    userName: 'Emma Wilson',
    isVerified: true,
    timeAgo: '4h ago',
    transcription: 'Looking for an electrician to fix power outlet issues.',
    distance: '1.2 km',
    location: 'San Francisco',
    status: 'Successfully completed',
    statusColor: '#2196F3',
  },
  {
    id: '3',
    userImage:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    userName: 'Michael Chen',
    isVerified: false,
    timeAgo: '6h ago',
    transcription: 'AC not working, need urgent repair service.',
    distance: '3.8 km',
    location: 'San Francisco',
    status: 'Everything fixed',
    statusColor: '#4CAF50',
  },
  {
    id: '4',
    userImage:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
    userName: 'Sarah Johnson',
    isVerified: true,
    timeAgo: '8h ago',
    transcription: 'Need help with moving furniture to new apartment.',
    distance: '4.1 km',
    location: 'San Francisco',
    status: 'Processing request',
    statusColor: '#FF9800',
  },
];

export default function VoiceHelpRequestsScreen() {
  const [search, setSearch] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleVoiceSubmit = (audioUri: string) => {
    console.log('Audio recorded:', audioUri);
    // Handle the recorded audio
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.userImage }} style={styles.userImage} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.userName}>{item.userName}</Text>
              {item.isVerified && (
                <BadgeCheck
                  size={16}
                  color={COLORS.surface}
                  fill={COLORS.accent}
                />
              )}
            </View>
            <Text style={styles.timeAgo}>{item.timeAgo}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setPlayingId(playingId === item.id ? null : item.id)}
        >
          {playingId === item.id ? (
            <Pause size={20} color={COLORS.accent} />
          ) : (
            <Play size={20} color={COLORS.accent} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.transcription}>{item.transcription}</Text>

      <View style={styles.requestFooter}>
        <View style={styles.locationInfo}>
          <MapPin size={16} color="#9E9E9E" />
          <Text style={styles.distance}>{item.distance}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: `${item.statusColor}10` },
        ]}
      >
        <Text style={[styles.statusText, { color: item.statusColor }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Voice Requests</Text>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9E9E9E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={MOCK_REQUESTS}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestsList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowRecordModal(true)}
        activeOpacity={0.8}
      >
        <Mic size={20} color="white" />
        <Text style={styles.fabText}>Ask for help</Text>
      </TouchableOpacity>

      <VoiceRecordModal
        visible={showRecordModal}
        onClose={() => setShowRecordModal(false)}
        onSubmit={handleVoiceSubmit}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 12,
    ...SHADOWS.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  requestsList: {
    padding: 20,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  timeAgo: {
    fontSize: 12,
    color: COLORS.text.body,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transcription: {
    fontSize: 14,
    color: COLORS.text.body,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  requestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
  },
  location: {
    fontSize: 12,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    paddingHorizontal: 40,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 8,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.card,
  },
  fabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

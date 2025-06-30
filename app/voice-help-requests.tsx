import React, { useEffect, useState } from 'react';
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
  ChevronLeft,
  Edit2,
} from 'lucide-react-native';
import VoiceRecordModal from '@/components/VoiceRecordModal';
import { supabase } from '@/lib/supabase';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

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
    location: 'Patna, India',
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
    location: 'Patna, India',
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
    location: 'Patna, India',
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
    location: 'Patna, India',
    status: 'Processing request',
    statusColor: '#FF9800',
  },
];

export default function VoiceHelpRequestsScreen() {
  const [search, setSearch] = useState('');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const audioPlayer = useAudioPlayer();
  const status = useAudioPlayerStatus(audioPlayer);

  // Reset playingId when audio finishes
  useEffect(() => {
    if (status?.didJustFinish) {
      setPlayingId(null);
    }
  }, [status?.didJustFinish]);

  // Create a single audio player instance

  const playAudio = async (audio_url, id) => {
    console.log('Playing audio:', audio_url);

    await audioPlayer.replace(audio_url);
    await audioPlayer.play();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Realtime offline search
  useEffect(() => {
    if (!search.trim()) {
      setFilteredRequests(requests);
    } else {
      const q = search.trim().toLowerCase();
      setFilteredRequests(
        requests.filter((item) => {
          const userName = item.user_details?.name?.toLowerCase() || '';
          const text = (item.text || '').toLowerCase();
          const status = (item.status || '').toLowerCase();
          return userName.includes(q) || text.includes(q) || status.includes(q);
        })
      );
    }
  }, [search, requests]);

  const fetchRequests = async () => {
    setLoading(true); // ensure loading is set on fetch
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(
          `
          *,
          user_details:users (
            name,
            profile_image,
            verified
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add refresh function
  const refreshRequests = async () => {
    await fetchRequests();
  };

  const handleVoiceSubmit = async (audioUri) => {
    console.log('audioUri', audioUri);

    const file_name = Date.now() + '.m4a';
    const fileType = 'audio/m4a';

    try {
      // Step 1: fetch the file URI
      const response = await fetch(audioUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }

      // Step 2: convert to ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Step 3: upload as ArrayBuffer
      const { data, error } = await supabase.storage
        .from('voices')
        .upload(file_name, arrayBuffer, {
          contentType: fileType,
        });

      const audio_url = `https://npibtopuvjbftkstecht.supabase.co/storage/v1/object/public/voices/${file_name}`;

      // Insert into 'requests' table
      const { data: insertData, error: insertError } = await supabase
        .from('requests')
        .insert({
          text: 'Processing audio...',
          audio: audio_url,
          user: '55b68d62-d947-44f9-bcf1-78345d0e6f3e',
          status: 'Processing...',
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Insert failed:', insertError);
        return;
      }

      // Call Edge Function
      const resp = await supabase.functions.invoke('operations', {
        body: JSON.stringify({ audio_url, doc_id: insertData.id }),
      });

      fetchRequests();

      console.log('Function response:', resp);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  // Helper to format time ago
  function timeAgo(dateString: string) {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  }

  // UI: Card status color logic
  const getStatusColor = (status: string) => {
    if (status?.toLowerCase().includes('processed')) return COLORS.accent;
    if (status?.toLowerCase().includes('accepted')) return '#00BCD4';
    if (status?.toLowerCase().includes('completed')) return '#2196F3';
    if (status?.toLowerCase().includes('processing')) return '#FF9800';
    return COLORS.accent;
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeaderRow}>
        <View style={styles.avatarCircle}>
          {item.user_details?.profile_image ? (
            <Image
              source={{ uri: item.user_details.profile_image }}
              style={styles.avatarImg}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {item.user_details?.name?.[0] || 'U'}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.userName}>
              {item.user_details?.name || 'User'}
            </Text>
            {item.user_details?.verified && (
              <BadgeCheck
                size={16}
                color={COLORS.surface}
                fill={COLORS.accent}
              />
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Clock size={13} color="#9E9E9E" />
            <Text style={styles.timeAgo}>
              {timeAgo(item.created_at)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => {
            setPlayingId(playingId === item.id ? null : item.id);
            playAudio(item.audio, item.id);
          }}
        >
          {playingId === item.id ? (
            <Pause size={20} color={COLORS.accent} />
          ) : (
            <Play size={20} color={COLORS.accent} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.transcription}>{item.text}</Text>

      <View style={styles.locationRow}>
        <MapPin size={15} color="#9E9E9E" />
        <Text style={styles.locationText}>Unknown distance • Patna, Bihar</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Edit2 size={16} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.statusBtn,
          {
            borderColor: getStatusColor(item.status),
            backgroundColor: getStatusColor(item.status) + '10',
          },
        ]}
        activeOpacity={1}
      >
        <Text
          style={[styles.statusBtnText, { color: getStatusColor(item.status) }]}
        >
          {item.status || 'Processed'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBackBtn}
        >
          <ChevronLeft size={26} color={COLORS.text.heading} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Search size={20} color="#9E9E9E" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Voice Requests"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#B0B0B0"
          />
        </View>
      </View>

      <FlatList
        data={filteredRequests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.requestsList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refreshRequests}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowRecordModal(true)}
        activeOpacity={0.8}
      >
        <Mic size={20} color="white" />
        <Text style={styles.fabText}>Ask for Help</Text>
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
    backgroundColor: '#F7FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F7FAFC',
    gap: 8,
  },
  headerBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 40,
    ...SHADOWS.card,
    marginRight: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  requestsList: {
    padding: 14,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    ...SHADOWS.card,
    borderWidth: 1,
    borderColor: '#E6F1F8',
  },
  requestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent + '22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  timeAgo: {
    fontSize: 13,
    color: '#9E9E9E',
    fontFamily: 'Inter-Regular',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  transcription: {
    fontSize: 15,
    color: COLORS.text.body,
    lineHeight: 22,
    marginBottom: 10,
    fontFamily: 'Inter-Regular',
    marginLeft: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#9E9E9E',
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
    flex: 1,
  },
  editBtn: {
    marginLeft: 'auto',
    padding: 4,
  },
  statusBtn: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    width: '100%',
  },
  statusBtnText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    backgroundColor: COLORS.accent,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.card,
    elevation: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

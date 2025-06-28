import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Search,
  Mic,
  Calendar,
  User,
} from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import VoiceRecordModal from '@/components/VoiceRecordModal';
import { useTabBar } from '@/context/TabBarContext';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';

function BoltBadge() {
  return (
    <View style={styles.boltBadgeContainer}>
      <Text style={styles.boltBadgeText}>Built on Bolt</Text>
    </View>
  );
}

export default function TabLayout() {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const { tabBarHeight } = useTabBar();

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

      console.log('Function response:', resp);
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopWidth: 0,
            elevation: 0,
            height: tabBarHeight,
            backgroundColor: 'white',
            transform: [
              {
                translateY: tabBarHeight.interpolate({
                  inputRange: [0, 49],
                  outputRange: [49, 0],
                }),
              },
            ],
          },
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <Search size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="placeholder"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setShowVoiceModal(true)}
              >
                <Mic size={24} color="white" />
              </TouchableOpacity>
            ),
            tabBarIconStyle: {
              marginTop: -20,
            },
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowVoiceModal(true);
            },
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
          }}
        />
      </Tabs>
      <BoltBadge />

      <VoiceRecordModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSubmit={handleVoiceSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  boltBadgeContainer: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    zIndex: 1000,
  },
  boltBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    elevation: 4,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#fff',
  },
});

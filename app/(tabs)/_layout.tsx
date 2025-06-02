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
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import VoiceRecordModal from '@/components/VoiceRecordModal';

function BoltBadge() {
  return (
    <View style={styles.boltBadgeContainer}>
      <Text style={styles.boltBadgeText}>Built on Bolt</Text>
    </View>
  );
}

export default function TabLayout() {
  const [showVoiceModal, setShowVoiceModal] = useState(false);

  const handleVoiceSubmit = (audioUri) => {
    // Handle the recorded audio
    console.log('Audio recorded:', audioUri);
    // Show success snackbar
    // You might want to use a snackbar library like react-native-toast-message
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarStyle: {
            position: 'relative',
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
          name="voice-help-requests"
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

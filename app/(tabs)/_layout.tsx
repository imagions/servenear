import React, { useState, useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Search,
  Mic,
  Calendar,
  User,
  Plus, // add Plus icon
} from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  Easing,
} from 'react-native';
import VoiceRecordModal from '@/components/VoiceRecordModal';
import { useTabBar } from '@/context/TabBarContext';
import { supabase } from '@/lib/supabase';
import * as FileSystem from 'expo-file-system';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSnackbar } from '@/context/SnackbarContext';
import { useAuthStore } from '@/store/useAuthStore';

function BoltBadge({ visible, onPress }) {
  if (!visible) return null;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const spinCount = useRef(0);

  useEffect(() => {
    let isMounted = true;
    let animation;

    const startSpin = () => {
      animation = Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 6000,
        useNativeDriver: true,
        easing: Easing.linear,
      });

      animation.start(({ finished }) => {
        if (!isMounted) return;
        spinCount.current += 1;
        if (spinCount.current % 2 === 0) {
          setTimeout(() => {
            if (!isMounted) return;
            rotateAnim.setValue(0);
            startSpin();
          }, 1000);
        } else {
          rotateAnim.setValue(0);
          startSpin();
        }
      });
    };

    startSpin();

    return () => {
      isMounted = false;
      rotateAnim.stopAnimation();
    };
  }, [rotateAnim]);

  // Spin anti-clockwise
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.boltBadgeImageContainer,
        { transform: [{ rotate: spin }] },
      ]}
    >
      <Image
        source={require('../../assets/images/bolt-badge.png')}
        style={styles.boltBadgeImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const { tabBarHeight, handleScroll } = useTabBar(); // get handleScroll
  const insets = useSafeAreaInsets();

  const { showSnackbar } = useSnackbar();
  const isProviderMode = useAuthStore((s) => s.isProviderMode);
  const [showBoltBadge, setShowBoltBadge] = useState(true);

  const handleVoiceSubmit = async (audioUri) => {

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
      showSnackbar({
        message: 'Will notify providers nearby shortly',
        icon: 'check-circle',
        iconColor: '#4CAF50',
        duration: 2000,
      });

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
            left: 0,
            right: 0,
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'white',
            // Hide/show tab bar using translateY
            transform: [
              {
                translateY: tabBarHeight.interpolate({
                  inputRange: [0, 50],
                  outputRange: [90 + insets.bottom, 0],
                }),
              },
            ],
            height: 55 + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarShowLabel: true,
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
        }}
        // Pass handleScroll to all screens as a prop
        sceneContainerStyle={{
          // This is not required for scroll, but can be used for background
          backgroundColor: 'transparent',
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
                activeOpacity={0.7}
                style={styles.floatingButton}
                onPress={() => {
                  if (isProviderMode) {
                    // Navigate to add-service screen for providers
                    // Use router from expo-router
                    require('expo-router').router.push('/add-service');
                  } else {
                    setShowVoiceModal(true);
                  }
                }}
              >
                {isProviderMode ? (
                  <Plus size={28} color="white" />
                ) : (
                  <Mic size={24} color="white" />
                )}
              </TouchableOpacity>
            ),
            tabBarIconStyle: {
              marginTop: -16,
            },
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              if (isProviderMode) {
                require('expo-router').router.push('/add-service');
              } else {
                setShowVoiceModal(true);
              }
            },
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: isProviderMode ? 'Requests' : 'Bookings',
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
      <BoltBadge
        visible={showBoltBadge}
        onPress={() => setShowBoltBadge(false)}
      />

      <VoiceRecordModal
        visible={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onSubmit={handleVoiceSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  boltBadgeImageContainer: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: 'transparent',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    // Add a little shadow for visibility
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
  },
  boltBadgeImage: {
    width: 80,
    height: 80,
    borderRadius: 27,
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

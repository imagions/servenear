import React from 'react';
import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  Search,
  Mic,
  Calendar,
  User,
} from 'lucide-react-native';
import { COLORS } from '@/constants/theme';
import { View, Text, StyleSheet } from 'react-native';

function BoltBadge() {
  return (
    <View style={styles.boltBadgeContainer}>
      <Text style={styles.boltBadgeText}>Built on Bolt</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.accent,
          tabBarInactiveTintColor: '#A0A0A0',
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
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
          name="voice-help"
          options={{
            title: '',
            tabBarIcon: ({ color }) => (
              <View style={styles.floatingButton}>
                <Mic size={24} color="white" />
              </View>
            ),
            tabBarIconStyle: {
              marginTop: -20,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              marginTop: -15,
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
    </>
  );
}

const styles = StyleSheet.create({
  boltBadgeContainer: {
    position: 'absolute',
    bottom: 70,
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

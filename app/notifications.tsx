import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, SHADOWS } from '@/constants/theme';
import {
  ArrowLeft,
  Bell,
  Tag,
  MessageCircle,
  Gift,
  AlertCircle,
  CreditCard,
  Clock,
  Megaphone,
  TrendingDown,
} from 'lucide-react-native';
import Animated, { FadeInRight, FadeOutRight } from 'react-native-reanimated';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    message:
      'Your AC Service booking has been confirmed for tomorrow at 10:00 AM',
    time: '2m ago',
    icon: 'check-circle',
    color: '#4CAF50',
  },
  {
    id: '2',
    type: 'offer',
    title: 'Special Discount',
    message: 'Get 20% off on all Beauty services this weekend!',
    time: '1h ago',
    icon: 'tag',
    color: '#F44336',
  },
  {
    id: '5',
    type: 'chat',
    title: 'New Message',
    message: "Rajesh: I'll be there in 15 minutes",
    time: '2h ago',
    icon: 'message-circle',
    color: '#2196F3', // Blue
  },
  {
    id: '6',
    type: 'service',
    title: 'New Service Available',
    message: 'Try our new Car Washing service at your doorstep',
    time: '5h ago',
    icon: 'gift',
    color: '#9C27B0', // Purple
  },
  {
    id: '7',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment of ₹799 received for AC Service',
    time: '1d ago',
    icon: 'credit-card',
    color: '#4CAF50', // Green
  },
  {
    id: '8',
    type: 'reminder',
    title: 'Service Reminder',
    message: 'Your plumbing service is scheduled for tomorrow',
    time: '1d ago',
    icon: 'clock',
    color: '#FF9800', // Orange
  },
  {
    id: '9',
    type: 'promo',
    title: 'Weekend Sale',
    message: 'Flat 15% off on all Appliance Repairs',
    time: '2d ago',
    icon: 'megaphone',
    color: '#F44336', // Red
  },
  {
    id: '10',
    type: 'update',
    title: 'Price Drop',
    message: 'AC Service now starts at just ₹499',
    time: '3d ago',
    icon: 'trending-down',
    color: '#2196F3', // Blue
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <AlertCircle size={20} color="#4CAF50" />;
      case 'offer':
        return <Tag size={20} color="#F44336" />;
      case 'chat':
        return <MessageCircle size={20} color="#2196F3" />;
      case 'service':
        return <Gift size={20} color="#9C27B0" />;
      case 'payment':
        return <CreditCard size={20} color="#4CAF50" />;
      case 'reminder':
        return <Clock size={20} color="#FF9800" />;
      case 'promo':
        return <Megaphone size={20} color="#F44336" />;
      case 'update':
        return <TrendingDown size={20} color="#2196F3" />;
      default:
        return <Bell size={20} color={COLORS.accent} />;
    }
  };

  const clearAllNotifications = () => {
    Alert.alert('Clear all notifications?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: () => setNotifications([]),
      },
    ]);
  };

  const renderNotification = ({ item }: { item: any }) => (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutRight}
      style={styles.notificationCard}
    >
      <View
        style={[styles.iconContainer, { backgroundColor: `${item.color}10` }]}
      >
        {getIcon(item.type)}
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={clearAllNotifications}>
            <Text style={styles.clearButton}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={64} color={`${COLORS.accent}80`} />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  clearButton: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  notificationMessage: {
    fontSize: 13,
    color: COLORS.text.body,
    marginBottom: 4,
    fontFamily: 'Inter-Regular',
  },
  notificationTime: {
    fontSize: 11,
    color: COLORS.text.body,
    opacity: 0.5,
    fontFamily: 'Inter-Medium',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginTop: 16,
    fontFamily: 'Inter-SemiBold',
  },
});

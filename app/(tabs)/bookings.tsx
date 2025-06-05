import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router } from 'expo-router';
import { Calendar, Clock, Check, X } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { BookingItem } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';

export default function BookingsScreen() {
  const { bookings } = useServiceStore();
  const { isProviderMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState('upcoming');

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'upcoming') {
      return booking.status === 'upcoming' || booking.status === 'pending';
    } else if (activeTab === 'completed') {
      return booking.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    }
    return true;
  });

  const renderBookingItem = ({ item }: { item: BookingItem }) => {
    const isPending = item.status === 'pending';
    const isUpcoming = item.status === 'upcoming';
    const isCompleted = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';

    return (
      <TouchableOpacity
        style={styles.bookingItem}
        onPress={() => router.push(`/service/${item.serviceId}`)}
      >
        <Image
          source={{ uri: item.serviceImage }}
          style={styles.bookingImage}
        />

        <View style={styles.bookingContent}>
          <View>
            <Text style={styles.bookingTitle}>{item.serviceTitle}</Text>
            <Text style={styles.bookingProvider}>{item.providerName}</Text>

            <View style={styles.bookingSchedule}>
              <View style={styles.scheduleItem}>
                <Calendar size={14} color="#9E9E9E" />
                <Text style={styles.scheduleText}>{item.date}</Text>
              </View>

              <View style={styles.scheduleItem}>
                <Clock size={14} color="#9E9E9E" />
                <Text style={styles.scheduleText}>{item.time}</Text>
              </View>
            </View>
          </View>

          <View style={styles.bookingFooter}>
            <Text style={styles.bookingPrice}>${item.price}</Text>

            <View
              style={[
                styles.bookingStatus,
                isPending && styles.pendingStatus,
                isUpcoming && styles.upcomingStatus,
                isCompleted && styles.completedStatus,
                isCancelled && styles.cancelledStatus,
              ]}
            >
              <Text
                style={[
                  styles.bookingStatusText,
                  isPending && styles.pendingStatusText,
                  isUpcoming && styles.upcomingStatusText,
                  isCompleted && styles.completedStatusText,
                  isCancelled && styles.cancelledStatusText,
                ]}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {isProviderMode ? 'Help Requests' : 'My Bookings'}
        </Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            {isProviderMode ? 'New Requests' : 'Upcoming'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'completed' && styles.activeTabText,
            ]}
          >
            {isProviderMode ? 'Completed Jobs' : 'Completed'}
          </Text>
        </TouchableOpacity>

        {!isProviderMode && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
            onPress={() => setActiveTab('cancelled')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'cancelled' && styles.activeTabText,
              ]}
            >
              Cancelled
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={{
                uri: 'https://images.pexels.com/photos/7173043/pexels-photo-7173043.jpeg',
              }}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>
              No {isProviderMode ? 'help requests' : activeTab + ' bookings'}
            </Text>
            <Text style={styles.emptySubText}>
              {isProviderMode
                ? activeTab === 'upcoming'
                  ? 'You have no new help requests at the moment'
                  : 'You have not completed any jobs yet'
                : activeTab === 'upcoming'
                ? 'You have no upcoming bookings at the moment'
                : activeTab === 'completed'
                ? 'You have not completed any bookings yet'
                : 'You have not cancelled any bookings'}
            </Text>

            {!isProviderMode && activeTab === 'upcoming' && (
              <TouchableOpacity
                style={styles.exploreButton}
                onPress={() => router.push('/explore')}
              >
                <Text style={styles.exploreButtonText}>Explore Services</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {isProviderMode && activeTab === 'upcoming' && (
        <TouchableOpacity
          style={styles.toggleAvailabilityButton}
          onPress={() => router.push('/provider/availability')}
        >
          <Text style={styles.toggleAvailabilityText}>Manage Availability</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  bookingsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  bookingImage: {
    width: 100,
    height: '100%',
  },
  bookingContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  bookingProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  bookingSchedule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  bookingStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
  },
  pendingStatus: {
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
  },
  upcomingStatus: {
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
  },
  completedStatus: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  cancelledStatus: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  bookingStatusText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  pendingStatusText: {
    color: '#FFB800',
  },
  upcomingStatusText: {
    color: COLORS.accent,
  },
  completedStatusText: {
    color: '#4CAF50',
  },
  cancelledStatusText: {
    color: '#F44336',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyImage: {
    width: 200,
    height: '100%',
    borderRadius: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.text.body,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  exploreButton: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  toggleAvailabilityButton: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: COLORS.accent,
    padding: 16,
    borderRadius: RADIUS.card,
    ...SHADOWS.card,
  },
  toggleAvailabilityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
});

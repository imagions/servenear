import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router } from 'expo-router';
import { Calendar, Clock, Check, X, Inbox } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { BookingItem } from '@/types';
import { useAuthStore } from '@/store/useAuthStore';
import { useScrollToHide } from '@/hooks/useScrollToHide';

export default function BookingsScreen() {
  const { bookings } = useServiceStore();
  const [localBookings, setLocalBookings] = useState(bookings);
  const { isProviderMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState('upcoming');
  const { scrollProps } = useScrollToHide();

  // Accept booking handler (for providers)
  const handleAccept = (bookingId: string) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'upcoming' } : b))
    );
  };

  // Reject booking handler (for providers)
  const handleReject = (bookingId: string) => {
    setLocalBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'rejected' } : b))
    );
  };

  // Filter bookings based on tab and provider mode
  const filteredBookings = localBookings.filter((booking) => {
    if (isProviderMode) {
      if (activeTab === 'upcoming') {
        return booking.status === 'pending';
      } else if (activeTab === 'completed') {
        return booking.status === 'completed';
      } else if (activeTab === 'rejected') {
        return booking.status === 'rejected';
      }
    } else {
      if (activeTab === 'upcoming') {
        return booking.status === 'upcoming' || booking.status === 'pending';
      } else if (activeTab === 'completed') {
        return booking.status === 'completed';
      } else if (activeTab === 'cancelled') {
        return booking.status === 'cancelled';
      }
    }
    return true;
  });

  // Add more dummy data if list is empty
  useEffect(() => {
    if (localBookings.length === 0) {
      setLocalBookings([
        {
          id: 'b1',
          serviceId: 's1',
          serviceTitle: 'Plumbing Repair',
          serviceImage:
            'https://images.pexels.com/photos/191574/pexels-photo-191574.jpeg?w=300&auto=compress&cs=tinysrgb',
          providerName: 'John Smith',
          date: '2025-07-20',
          time: '10:00 AM',
          price: 120,
          status: 'pending',
        },
        {
          id: 'b2',
          serviceId: 's2',
          serviceTitle: 'House Cleaning',
          serviceImage:
            'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?w=300&auto=compress&cs=tinysrgb',
          providerName: 'Maria Garcia',
          date: '2025-07-22',
          time: '2:00 PM',
          price: 80,
          status: 'upcoming',
        },
        {
          id: 'b3',
          serviceId: 's3',
          serviceTitle: 'AC Maintenance',
          serviceImage:
            'https://images.pexels.com/photos/3768916/pexels-photo-3768916.jpeg?w=300&auto=compress&cs=tinysrgb',
          providerName: 'Alex Lee',
          date: '2025-07-18',
          time: '4:00 PM',
          price: 150,
          status: 'completed',
        },
        {
          id: 'b4',
          serviceId: 's4',
          serviceTitle: 'Carpet Cleaning',
          serviceImage:
            'https://images.pexels.com/photos/38325/vacuum-cleaner-carpet-cleaner-housework-housekeeping-38325.jpeg?w=300&auto=compress&cs=tinysrgb',
          providerName: 'Sophie Turner',
          date: '2025-07-15',
          time: '11:00 AM',
          price: 60,
          status: 'cancelled',
        },
        {
          id: 'b5',
          serviceId: 's5',
          serviceTitle: 'Gardening',
          serviceImage:
            'https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?w=300&auto=compress&cs=tinysrgb',
          providerName: 'Mike Green',
          date: '2025-07-10',
          time: '9:00 AM',
          price: 90,
          status: 'rejected',
        },
        {
          id: 'b6',
          serviceId: 's6',
          serviceTitle: 'Electrician Visit',
          serviceImage:
            'https://images.pexels.com/photos/4239149/pexels-photo-4239149.jpeg?w=300&auto=compress&cs=tinysrgb',
          providerName: 'Priya Patel',
          date: '2025-07-25',
          time: '1:00 PM',
          price: 110,
          status: 'pending',
        },
      ]);
    }
  }, [localBookings.length]);

  const renderBookingItem = ({ item }: { item: BookingItem }) => {
    const isPending = item.status === 'pending';
    const isUpcoming = item.status === 'upcoming';
    const isCompleted = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';
    const isRejected = item.status === 'rejected';

    return (
      <TouchableOpacity activeOpacity={0.7}
        style={styles.bookingItem}
        disabled={isProviderMode && isPending}
      >
        <View style={styles.bookingRow}>
          <Image
            source={{ uri: item.serviceImage }}
            style={styles.bookingImageSmall}
          />

          <View style={styles.bookingContent}>
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
            <View style={styles.bookingFooter}>
              <Text style={styles.bookingPrice}>₹{item.price}</Text>
              <View
                style={[
                  styles.bookingStatus,
                  isPending && styles.pendingStatus,
                  isUpcoming && styles.upcomingStatus,
                  isCompleted && styles.completedStatus,
                  isCancelled && styles.cancelledStatus,
                  isRejected && styles.rejectedStatus,
                ]}
              >
                <Text
                  style={[
                    styles.bookingStatusText,
                    isPending && styles.pendingStatusText,
                    isUpcoming && styles.upcomingStatusText,
                    isCompleted && styles.completedStatusText,
                    isCancelled && styles.cancelledStatusText,
                    isRejected && styles.rejectedStatusText,
                  ]}
                >
                  {isRejected
                    ? 'Rejected'
                    : item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Provider mode: show Accept/Reject for pending requests */}
        {isProviderMode && isPending && (
          <View style={styles.actionRowBottom}>
            <TouchableOpacity activeOpacity={0.7}
              style={[styles.actionButtonOutlined, styles.acceptButtonOutlined]}
              onPress={() => handleAccept(item.id)}
            >
              <Check size={18} color={COLORS.accent} />
              <Text
                style={[
                  styles.actionButtonTextOutlined,
                  { color: COLORS.accent },
                ]}
              >
                Accept
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}
              style={[styles.actionButtonOutlined, styles.rejectButtonOutlined]}
              onPress={() => handleReject(item.id)}
            >
              <X size={18} color="#F44336" />
              <Text
                style={[styles.actionButtonTextOutlined, { color: '#F44336' }]}
              >
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
        <TouchableOpacity activeOpacity={0.7}
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

        <TouchableOpacity activeOpacity={0.7}
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

        {isProviderMode ? (
          <TouchableOpacity activeOpacity={0.7}
            style={[styles.tab, activeTab === 'rejected' && styles.activeTab]}
            onPress={() => setActiveTab('rejected')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'rejected' && styles.activeTabText,
              ]}
            >
              Rejected
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity activeOpacity={0.7}
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
        {...scrollProps}
        data={filteredBookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Inbox size={40} color={COLORS.accent} />
            </View>
            <Text style={styles.emptyText}>
              {isProviderMode
                ? activeTab === 'upcoming'
                  ? 'No new help requests'
                  : activeTab === 'completed'
                  ? 'No completed jobs yet'
                  : 'No rejected requests'
                : activeTab === 'upcoming'
                ? 'You have no upcoming bookings at the moment'
                : activeTab === 'completed'
                ? 'You have not completed any bookings yet'
                : 'You have not cancelled any bookings'}
            </Text>
            <Text style={styles.emptySubText}>
              {isProviderMode
                ? activeTab === 'upcoming'
                  ? 'You have no new help requests at the moment'
                  : activeTab === 'completed'
                  ? 'You have not completed any jobs yet'
                  : 'You have not rejected any requests'
                : activeTab === 'upcoming'
                ? 'Book a service to see it here!'
                : activeTab === 'completed'
                ? 'Complete a booking to see it here!'
                : 'Cancelled bookings will appear here.'}
            </Text>
            {!isProviderMode && activeTab === 'upcoming' && (
              <TouchableOpacity activeOpacity={0.7}
                style={styles.exploreButton}
                onPress={() => router.push('/explore')}
              >
                <Text style={styles.exploreButtonText}>Explore Services</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
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
    paddingBottom: 5,
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
    padding: 14,
  },
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bookingImageSmall: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginRight: 14,
    backgroundColor: '#f2f2f2',
  },
  bookingContent: {
    flex: 1,
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
  rejectedStatus: {
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
  rejectedStatusText: {
    color: '#F44336',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 15,
    color: COLORS.text.body,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: COLORS.accent,
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  actionRowBottom: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
    justifyContent: 'space-between',
  },
  actionButtonOutlined: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingVertical: 8,
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 2,
  },
  acceptButtonOutlined: {
    borderColor: COLORS.accent,
  },
  rejectButtonOutlined: {
    borderColor: '#F44336',
  },
  actionButtonTextOutlined: {
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    marginLeft: 8,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  Star,
  MapPin,
  BadgeCheck,
  Clock,
  Calendar,
  Leaf,
  UserCheck,
  MessageCircle,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Mock data for the user profile
const USER_DATA = {
  id: '1',
  name: 'Emma Johnson',
  image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  verified: true,
  memberSince: 'March 2023',
  location: 'San Francisco, CA',
  about:
    'Passionate about finding quality service providers and maintaining a sustainable lifestyle. Always looking for eco-friendly solutions for home maintenance.',
  stats: {
    totalBookings: 48,
    completionRate: 96,
    averageRating: 4.8,
  },
  sustainabilityScore: {
    score: 4.7,
    wasteReduced: '12.5 kg',
    co2Saved: '8.3 kg',
  },
  ratingsReceived: {
    communication: 4.9,
    punctuality: 4.8,
    paymentReliability: 5.0,
    respect: 4.9,
  },
  verifiedBy: 15,
  reviews: [
    {
      id: '1',
      providerName: 'John Smith',
      providerImage:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      serviceType: 'Plumbing Service',
      rating: 5,
      date: 'May 15, 2024',
      comment:
        'Excellent service! Fixed our kitchen sink perfectly. Very professional and punctual.',
    },
    {
      id: '2',
      providerName: 'Sarah Wilson',
      providerImage:
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
      serviceType: 'House Cleaning',
      rating: 4.8,
      date: 'May 10, 2024',
      comment:
        'Great attention to detail and very thorough with the cleaning. Would recommend!',
    },
  ],
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const user = USER_DATA; // In real app, fetch based on id

  const renderReview = ({ item }) => (
    <TouchableOpacity
      style={styles.reviewCard}
      onPress={() => router.push(`/provider/${item.providerId}`)}
    >
      <View style={styles.reviewHeader}>
        <Image
          source={{ uri: item.providerImage }}
          style={styles.providerImage}
        />
        <View style={styles.reviewInfo}>
          <Text style={styles.providerName}>{item.providerName}</Text>
          <Text style={styles.serviceType}>{item.serviceType}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Star size={16} color="#FFB800" fill="#FFB800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <Text style={styles.reviewDate}>{item.date}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: user.image }} style={styles.profileImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.headerOverlay}
          >
            <View style={styles.headerContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user.name}</Text>
                {user.verified && (
                  <BadgeCheck size={20} color={COLORS.accent} />
                )}
              </View>

              <View style={styles.locationContainer}>
                <MapPin size={16} color="white" />
                <Text style={styles.location}>{user.location}</Text>
              </View>

              <View style={styles.memberSince}>
                <Clock size={16} color="white" />
                <Text style={styles.memberSinceText}>
                  Member since {user.memberSince}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.completionRate}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.stats.averageRating}</Text>
            <Text style={styles.statLabel}>Avg. Rating</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{user.about}</Text>
        </View>

        {/* Sustainability Impact */}
        <View style={styles.impactSection}>
          <LinearGradient
            colors={['rgba(232, 245, 233, 1)', 'rgba(200, 230, 201, 1)']}
            style={styles.impactCard}
          >
            <View style={styles.impactHeader}>
              <Leaf size={24} color="#4CAF50" />
              <Text style={styles.impactTitle}>Sustainability Impact</Text>
              <View style={styles.impactScore}>
                <Text style={styles.impactScoreText}>
                  {user.sustainabilityScore.score}
                </Text>
                <Star size={16} color="#4CAF50" fill="#4CAF50" />
              </View>
            </View>

            <View style={styles.impactStats}>
              <View style={styles.impactStatCard}>
                <Text style={styles.impactValue}>
                  {user.sustainabilityScore.wasteReduced}
                </Text>
                <Text style={styles.impactLabel}>e-waste reduced</Text>
              </View>

              <View style={styles.impactStatCard}>
                <Text style={styles.impactValue}>
                  {user.sustainabilityScore.co2Saved}
                </Text>
                <Text style={styles.impactLabel}>CO₂ saved</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Ratings Received */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings Received</Text>
          <View style={styles.ratingsContainer}>
            {Object.entries(user.ratingsReceived).map(([key, value]) => (
              <View key={key} style={styles.ratingItem}>
                <Text style={styles.ratingLabel}>
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, ' $1')}
                </Text>
                <View style={styles.ratingBar}>
                  <View
                    style={[
                      styles.ratingFill,
                      { width: `${(value / 5) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.ratingValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Verification Status */}
        <View style={styles.verificationSection}>
          <View style={styles.verificationCard}>
            <UserCheck size={24} color={COLORS.accent} />
            <Text style={styles.verificationText}>
              Verified by {user.verifiedBy} service providers
            </Text>
          </View>
        </View>

        {/* Reviews Given */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews Given</Text>
          <FlatList
            data={user.reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Message Button */}
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => router.push(`/chat/${user.id}` as any)}
      >
        <MessageCircle size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerContent: {
    gap: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberSinceText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    margin: 20,
    padding: 16,
    ...SHADOWS.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  aboutText: {
    fontSize: 16,
    color: COLORS.text.body,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  impactSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  impactCard: {
    borderRadius: RADIUS.card,
    padding: 20,
    ...SHADOWS.card,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  impactTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 12,
    fontFamily: 'Inter-Bold',
  },
  impactScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  impactScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    fontFamily: 'Inter-Bold',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  impactStatCard: {
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  impactLabel: {
    fontSize: 14,
    color: '#2E7D32',
    fontFamily: 'Inter-Regular',
  },
  ratingsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOWS.card,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    width: 140,
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginHorizontal: 12,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  ratingValue: {
    width: 32,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.heading,
    textAlign: 'right',
    fontFamily: 'Inter-Medium',
  },
  verificationSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  verificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  verificationText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.heading,
    fontFamily: 'Inter-Medium',
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 2,
    fontFamily: 'Inter-SemiBold',
  },
  serviceType: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
    fontFamily: 'Inter-SemiBold',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.text.body,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  messageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
});

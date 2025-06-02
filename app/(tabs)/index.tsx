import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  Search,
  Bell,
  MapPin,
  Star,
  Mic,
  ShoppingCart,
} from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { ServiceCategory, TrendingService } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const {
    categories,
    trendingServices,
    nearbyServices,
    fetchCategories,
    fetchTrendingServices,
    fetchNearbyServices,
  } = useServiceStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCategories();
    fetchTrendingServices();

    // Request location permissions and fetch nearby services
    const getLocationAndServices = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        fetchNearbyServices({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        // Use default location if permission not granted
        fetchNearbyServices({
          latitude: 37.7749,
          longitude: -122.4194,
        });
      }
    };

    getLocationAndServices();
  }, []);

  const renderCategoryItem = ({ item }: { item: ServiceCategory }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/category/${item.id}`)}
    >
      <View style={styles.categoryIcon}>
        <MaterialIcons
          name={item.icon as any}
          size={28}
          color={COLORS.accent}
        />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTrendingItem = ({ item }: { item: TrendingService }) => (
    <TouchableOpacity
      style={styles.trendingItem}
      onPress={() => router.push(`/service/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.trendingImage} />
      <View style={styles.trendingContent}>
        <View style={styles.trendingHeader}>
          <Text style={styles.trendingTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.providerName}>{item.provider}</Text>
        <View style={styles.trendingFooter}>
          <Text style={styles.priceText}>${item.price}/hr</Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#9E9E9E" />
            <Text style={styles.locationText}>{item.distance} mi</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNearbyItem = ({ item }: { item: TrendingService }) => (
    <TouchableOpacity
      style={styles.nearbyItem}
      onPress={() => router.push(`/service/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.nearbyImage} />
      <View style={styles.nearbyOverlay}>
        <View style={styles.nearbyContent}>
          <Text style={styles.nearbyTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.nearbyInfo}>
            <View style={styles.nearbyRating}>
              <Star size={12} color="#FFB800" fill="#FFB800" />
              <Text style={styles.nearbyRatingText}>{item.rating}</Text>
            </View>
            <Text style={styles.nearbyPrice}>${item.price}/hr</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      edges={['top', 'left', 'right',]}
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hi {user?.name || 'there'}!</Text>
              <View style={styles.locationRow}>
                <MapPin size={16} color={COLORS.accent} />
                <Text style={styles.locationText}>San Francisco, CA</Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity onPress={() => router.push('/notifications')}>
                <Bell size={24} color={COLORS.text.heading} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/voice-help-requests')}>
                <MaterialIcons
                  name="record-voice-over"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/cart')}>
                <ShoppingCart size={24} color={COLORS.text.heading} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.accent} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services nearby"
              placeholderTextColor="#9E9E9E"
              onFocus={() => router.push('/explore')}
            />
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>

          <View style={styles.nearbySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Near You</Text>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={nearbyServices}
              renderItem={renderNearbyItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.nearbyList}
            />
          </View>

          <View style={styles.trendingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <TouchableOpacity onPress={() => router.push('/explore')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.trendingList}>
              {trendingServices.map((item) => (
                <View key={item.id} style={styles.trendingItemWrapper}>
                  {renderTrendingItem({ item })}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bannerSection}>
            <View style={styles.banner}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>
                  Become a Service Provider
                </Text>
                <Text style={styles.bannerText}>
                  Share your skills and earn extra income
                </Text>
                <TouchableOpacity
                  style={styles.bannerButton}
                  onPress={() => router.push('/add-service')}
                >
                  <Text style={styles.bannerButtonText}>Get Started</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg',
                }}
                style={styles.bannerImage}
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.voiceHelpButton}
          onPress={() => router.push('/ai-assistance')}
        >
          <MaterialIcons name="assistant" size={18} color="white" />
          <View style={{ width: 8 }} />
          <Text style={{ color: 'white', fontSize: 15 }}>AI Help</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 1,
    // Updated shadow properties to match the desired effect
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  categorySection: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  categoryList: {
    paddingRight: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: COLORS.text.body,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  nearbySection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
  },
  nearbyList: {
    paddingRight: 20,
  },
  nearbyItem: {
    width: 150,
    height: 200,
    marginRight: 16,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  nearbyImage: {
    width: '100%',
    height: '100%',
  },
  nearbyOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  nearbyContent: {
    justifyContent: 'flex-end',
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  nearbyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nearbyRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearbyRatingText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  nearbyPrice: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  trendingSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  trendingList: {
    marginBottom: 8,
  },
  trendingItemWrapper: {
    marginBottom: 16,
  },
  trendingItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  trendingImage: {
    width: 100,
    height: 100,
  },
  trendingContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    flex: 1,
    fontFamily: 'Inter-SemiBold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFB800',
    marginLeft: 2,
    fontFamily: 'Inter-Medium',
  },
  providerName: {
    fontSize: 14,
    color: COLORS.text.body,
    marginVertical: 4,
    fontFamily: 'Inter-Regular',
  },
  trendingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    height: 150,
    ...SHADOWS.card,
  },
  bannerContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  bannerText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  bannerButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
  },
  bannerImage: {
    width: '40%',
    height: '100%',
  },
  voiceHelpButton: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    right: 20,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
});

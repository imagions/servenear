import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
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
import ServiceCard from '@/components/ServiceCard';
import { useSnackbar } from '@/context/SnackbarContext';
import { useTabBar } from '@/context/TabBarContext';
import { useScrollToHide } from '@/hooks/useScrollToHide';
import { useCartStore } from '@/store/useCartStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const {
    categories,
    trendingServices,
    nearbyServices,
    fetchCategories,
    fetchTrendingServices,
    fetchNearbyServices,
    services,
    loading,
    error,
  } = useServiceStore();
  const { user } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const { handleScroll } = useTabBar();
  const { scrollProps } = useScrollToHide();
  const [searchQuery, setSearchQuery] = useState('');
  const { items: cartItems } = useCartStore();
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        // Add console.log for debugging
        console.log('Initializing data...');

        await fetchCategories();
        await fetchTrendingServices();

        // Request location permissions and fetch nearby services
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          await fetchNearbyServices({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          await fetchNearbyServices({
            latitude: 37.7749,
            longitude: -122.4194,
          });
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    initData();
  }, []);

  useEffect(() => {
    const checkDemoModal = async () => {
      const seen = await AsyncStorage.getItem('demo_modal_seen');
      if (!seen) setShowDemoModal(true);
    };
    checkDemoModal();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/explore',
        params: { q: searchQuery.trim() },
      });
    }
  };

  const handleDemoModalClose = async () => {
    setShowDemoModal(false);
    await AsyncStorage.setItem('demo_modal_seen', '1');
  };

  const renderCategoryItem = useCallback(
    ({ item }: { item: ServiceCategory }) => (
      <TouchableOpacity
        style={styles.categoryItem}
        onPress={() => {
          console.log('Category pressed:', item);
          router.push(`/category/${item.id}`);
        }}
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
    ),
    []
  );

  const renderNearbyItem = ({ item }: { item: TrendingService }) => {
    const distance =
      item.lat && item.long
        ? calculateDistance(item.lat, item.long, item.lat || 0, item.long || 0)
        : item.distance;

    const displayDistance = distance
      ? `${distance.toFixed(1)} km`
      : 'Distance N/A';

    return (
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
              <View style={styles.locationInfo}>
                <MapPin size={12} color="white" />
                <Text style={styles.distanceText}>{displayDistance}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Replace trending items section with ServiceCard
  const renderTrendingItem = ({ item }) => (
    <ServiceCard service={item} icon={item.icon || 'trending-up'} />
  );

  // Add console.log to debug categories data
  console.log('Current categories:', categories);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading services</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{
        backgroundColor: COLORS.background,
      }}
    >
      <View style={styles.container}>
        <ScrollView {...scrollProps} showsVerticalScrollIndicator={false}>
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
                  <Text style={styles.badgeText}>8</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/voice-help-requests')}
              >
                <MaterialIcons
                  name="record-voice-over"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/cart')}>
                <ShoppingCart size={24} color={COLORS.text.heading} />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItems.reduce(
                      (sum, item) => sum + (item.quantity || 1),
                      0
                    )}
                  </Text>
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {loading ? (
              <ActivityIndicator color={COLORS.accent} />
            ) : categories?.length > 0 ? (
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              />
            ) : (
              <Text style={styles.emptyText}>No categories found</Text>
            )}
          </View>

          <View style={styles.nearbySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Near You</Text>
              <TouchableOpacity
                onPress={() => router.push('/services?type=nearby')}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator color={COLORS.accent} />
            ) : services?.length > 0 ? (
              <ScrollView
                contentContainerStyle={{ flexDirection: 'row' }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {services.map((item) => (
                  <View key={item.id}>
                    {renderNearbyItem({
                      item: { ...item, provider: item.provider ?? '' },
                    })}
                  </View>
                ))}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>No services found nearby</Text>
            )}
          </View>

          <View style={styles.trendingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <TouchableOpacity
                onPress={() => router.push('/services?type=trending')}
              >
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator color={COLORS.accent} />
            ) : trendingServices?.length > 0 ? (
              <View style={{ flexDirection: 'column' }}>
                {trendingServices.map((item) => (
                  <View key={item.id}>{renderTrendingItem({ item })}</View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>No trending services</Text>
            )}
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

      <Modal
        visible={showDemoModal}
        transparent
        animationType="fade"
        onRequestClose={handleDemoModalClose}
      >
        <View style={demoModalStyles.overlay}>
          <View style={demoModalStyles.dialog}>
            <View style={demoModalStyles.iconCircle}>
              <Text style={demoModalStyles.iconText}>🧪</Text>
            </View>
            <Text style={demoModalStyles.title}>Welcome to Demo Version</Text>
            <Text style={demoModalStyles.body}>
              Please note that some features{'\n'}
              may be limited or not working.{'\n'}
              This version is for testing{'\n'}
              purposes only.
            </Text>
            <Text style={demoModalStyles.info}>
              <Text style={{ color: '#00CFE8' }}>
                More advanced AI features are{'\n'}
                coming soon, stay tuned!
              </Text>
            </Text>
            <TouchableOpacity
              style={demoModalStyles.button}
              onPress={handleDemoModalClose}
            >
              <Text style={demoModalStyles.buttonText}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
  nearbyItem: {
    width: 150,
    height: 200,
    marginRight: 16,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
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
  nearbyItemContainer: {
    width: 300,
    marginRight: 16,
  },
  nearbyList: {
    paddingHorizontal: 5,
  },
  trendingSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  bannerSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
    marginTop: 20,
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
    marginBottom: 2,
    fontFamily: 'Inter-Bold',
  },
  bannerText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginVertical: 10,
  },
});

const demoModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: 320,
    borderRadius: 32,
    backgroundColor: 'white',
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 8,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F8FB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconText: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
    marginBottom: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  info: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    textAlign: 'center',
    color: '#00CFE8',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#00CFE8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Inter-SemiBold',
  },
});

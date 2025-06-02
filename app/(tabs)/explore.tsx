import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ScrollView
} from 'react-native';
import { useGlobalSearchParams } from 'expo-router'; // Change this line
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { Search, X, FileSliders as Sliders, Grid2x2 as Grid, List, Star, MapPin } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { ServiceItem } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Dummy Data
const TRENDING_SEARCHES = [
  { icon: 'home-repair-service', query: 'Electrician', count: '2.5k', color: '#FF6B6B' },
  { icon: 'plumbing', query: 'Plumber', count: '1.8k', color: '#4ECDC4' },
  { icon: 'cleaning-services', query: 'House Cleaning', count: '1.2k', color: '#45B7D1' },
  { icon: 'car-repair', query: 'Car Service', count: '950', color: '#96CEB4' },
];

const FEATURED_PROVIDERS = [
  {
    id: '1',
    name: 'John Doe',
    image: 'https://picsum.photos/200',
    rating: 4.8,
    verified: true,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    image: 'https://picsum.photos/201',
    rating: 4.9,
    verified: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    image: 'https://picsum.photos/202',
    rating: 4.7,
    verified: true,
  },
  {
    id: '4',
    name: 'Emily Brown',
    image: 'https://picsum.photos/203',
    rating: 4.6,
    verified: false,
  },
];

const SPECIAL_OFFERS = [
  {
    id: '1',
    discount: '20% OFF',
    title: 'On All AC Services',
    validUntil: 'Valid until June 30',
    gradient: ['#FF6B6B', '#EE5D5D'],
    icon: 'ac-unit',
  },
  {
    id: '2',
    discount: '15% OFF',
    title: 'Home Cleaning',
    validUntil: 'Valid until July 15',
    gradient: ['#4ECDC4', '#45B7D1'],
    icon: 'cleaning-services',
  },
  {
    id: '3',
    discount: '25% OFF',
    title: 'Plumbing Services',
    validUntil: 'Valid until July 20',
    gradient: ['#A18CD1', '#FBC2EB'],
    icon: 'plumbing',
  },
];

const RECOMMENDED_SERVICES = [
  {
    id: '1',
    title: 'Professional AC Repair',
    provider: 'CoolAir Services',
    rating: 4.8,
    price: 49,
    image: 'https://picsum.photos/300',
  },
  {
    id: '2',
    title: 'Deep House Cleaning',
    provider: 'CleanPro',
    rating: 4.9,
    price: 79,
    image: 'https://picsum.photos/301',
  },
  {
    id: '3',
    title: 'Electrical Maintenance',
    provider: 'PowerFix',
    rating: 4.7,
    price: 59,
    image: 'https://picsum.photos/302',
  },
];

// Update MapExploreButton component
const MapExploreButton = () => (
  <TouchableOpacity
    style={styles.mapExploreButton}
    onPress={() => router.push('/map')}>
    <LinearGradient
      colors={[COLORS.accent, COLORS.accent + 'CC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mapExploreGradient}>
      <View style={styles.mapExploreContent}>
        <MaterialIcons name="map" size={24} color="white" />
        <Text style={styles.mapExploreText}>Explore Services Nearby</Text>
        <MaterialIcons name="arrow-forward" size={20} color="white" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

// Update RecommendedServices component
const RecommendedServices = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <MaterialIcons name="recommend" size={24} color={COLORS.accent} />
      <Text style={styles.sectionTitle}>Recommended for You</Text>
    </View>
    <View style={styles.recommendedList}>
      {RECOMMENDED_SERVICES.map((service) => (
        <TouchableOpacity 
          key={service.id} 
          style={styles.recommendedCard}
          onPress={() => router.push(`/service/${service.id}`)}>
          <Image 
            source={{ uri: service.image }} 
            style={styles.recommendedImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.recommendedGradient}>
            <View style={styles.recommendedContent}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedTitle}>{service.title}</Text>
                <View style={styles.recommendedRating}>
                  <Star size={12} color="#FFB800" fill="#FFB800" />
                  <Text style={styles.recommendedRatingText}>{service.rating}</Text>
                </View>
              </View>
              <View style={styles.recommendedFooter}>
                <Text style={styles.recommendedProvider}>{service.provider}</Text>
                <Text style={styles.recommendedPrice}>${service.price}/hr</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const SearchHistory = ({ history, onSelect, onClear }) => (
  <View style={styles.searchHistoryContainer}>
    <View style={styles.searchHistoryHeader}>
      <Text style={styles.searchHistoryTitle}>Recent Searches</Text>
      {history.length > 0 && (
        <TouchableOpacity onPress={() => onClear(history)}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.searchHistoryList}>
      {history.map((query, index) => (
        <TouchableOpacity
          key={index}
          style={styles.searchHistoryItem}
          onPress={() => onSelect(query)}>
          <View style={styles.searchHistoryItemContent}>
            <MaterialIcons name="history" size={20} color={COLORS.text.body} />
            <Text style={styles.searchHistoryItemText}>{query}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onClear(query)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={16} color={COLORS.text.body} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ExploreScreen() {
  const params = useGlobalSearchParams(); // Change this line
  const query = params?.q as string;

  const [searchText, setSearchText] = useState(query || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const { services, categories, filterServices } = useServiceStore();
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  
  useEffect(() => {
    if (query) {
      setSearchText(query);
    }
    
    const filtered = filterServices(searchText, selectedCategories);
    setFilteredServices(filtered);
  }, [query, searchText, selectedCategories, services]);
  
  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  const handleClearSearch = () => {
    setSearchText('');
    setFilteredServices(services);
  };
  
  const renderServiceGridItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => router.push(`/service/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.gridItemImage} />
      <View style={styles.gridItemContent}>
        <Text style={styles.gridItemTitle} numberOfLines={1}>{item.title}</Text>
        
        <View style={styles.gridItemRating}>
          <Star size={12} color="#FFB800" fill="#FFB800" />
          <Text style={styles.gridItemRatingText}>{item.rating}</Text>
        </View>
        
        <View style={styles.gridItemFooter}>
          <Text style={styles.gridItemPrice}>${item.price}/hr</Text>
          <View style={styles.gridItemLocation}>
            <MapPin size={12} color="#9E9E9E" />
            <Text style={styles.gridItemLocationText}>{item.distance} mi</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  
  const renderServiceListItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.listItem}
      onPress={() => router.push(`/service/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listItemProvider}>{item.provider}</Text>
        
        <View style={styles.listItemDetails}>
          <View style={styles.listItemRating}>
            <Star size={12} color="#FFB800" fill="#FFB800" />
            <Text style={styles.listItemRatingText}>{item.rating}</Text>
          </View>
          
          <View style={styles.listItemLocation}>
            <MapPin size={12} color="#9E9E9E" />
            <Text style={styles.listItemLocationText}>{item.distance} mi</Text>
          </View>
        </View>
        
        <Text style={styles.listItemPrice}>${item.price}/hr</Text>
      </View>
    </TouchableOpacity>
  );
  
  const TrendingSearches = ({ data }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="local-fire-department" size={24} color={COLORS.accent} />
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.trendingItem}
            onPress={() => handleSearch(item.query)}>
            <View style={[styles.trendingIcon, { backgroundColor: item.color + '15' }]}>
              <MaterialIcons name={item.icon} size={28} color={item.color} />
            </View>
            <Text style={styles.trendingQuery}>{item.query}</Text>
            <Text style={styles.trendingCount}>{item.count} searches</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const MapExploreButton = () => (
    <TouchableOpacity
      style={styles.mapExploreButton}
      onPress={() => router.push('/map')}>
      <LinearGradient
        colors={[COLORS.accent, COLORS.accent + 'CC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mapExploreGradient}>
        <View style={styles.mapExploreContent}>
          <MaterialIcons name="map" size={24} color="white" />
          <Text style={styles.mapExploreText}>Explore Services Nearby</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const FeaturedProviders = ({ data }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="verified" size={20} color={COLORS.accent} />
          <Text style={styles.sectionTitle}>Featured Providers</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.providersList}>
        {data.map((provider, index) => (
          <TouchableOpacity key={index} style={styles.providerCard}>
            <Image 
              source={{ uri: provider.image }} 
              style={styles.providerImage} 
            />
            <View style={styles.providerInfo}>
              <View style={styles.providerNameRow}>
                <Text style={styles.providerName}>{provider.name}</Text>
                {provider.verified && (
                  <MaterialIcons name="verified" size={16} color={COLORS.accent} />
                )}
              </View>
              <View style={styles.providerRating}>
                <Star size={12} color="#FFB800" fill="#FFB800" />
                <Text style={styles.providerRatingText}>{provider.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const SpecialOffers = ({ data }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Special Offers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.map((offer, index) => (
          <TouchableOpacity key={index} style={styles.offerCard}>
          <LinearGradient
            colors={offer.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.offerGradient}>
            <View style={styles.offerIconContainer}>
              <MaterialIcons name={offer.icon} size={32} color="white" style={styles.offerIcon} />
            </View>
            <View style={styles.offerBadge}>
              <Text style={styles.offerDiscount}>{offer.discount}</Text>
            </View>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.offerValidity}>{offer.validUntil}</Text>
          </LinearGradient>
        </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const RecommendedServices = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="recommend" size={24} color={COLORS.accent} />
        <Text style={styles.sectionTitle}>Recommended for You</Text>
      </View>
      <View style={styles.recommendedList}>
        {RECOMMENDED_SERVICES.map((service) => (
          <TouchableOpacity 
            key={service.id} 
            style={styles.recommendedCard}
            onPress={() => router.push(`/service/${service.id}`)}>
            <Image 
              source={{ uri: service.image }} 
              style={styles.recommendedImage} 
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.recommendedGradient}>
              <View style={styles.recommendedContent}>
                <View style={styles.recommendedHeader}>
                  <Text style={styles.recommendedTitle}>{service.title}</Text>
                  <View style={styles.recommendedRating}>
                    <Star size={12} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.recommendedRatingText}>{service.rating}</Text>
                  </View>
                </View>
                <View style={styles.recommendedFooter}>
                  <Text style={styles.recommendedProvider}>{service.provider}</Text>
                  <Text style={styles.recommendedPrice}>${service.price}/hr</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={COLORS.text.body} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search services nearby..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={COLORS.text.body} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.mapButton}
          onPress={() => router.push('/map')}>
          <MapPin size={20} color={COLORS.text.heading} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton}>
          <Sliders size={20} color={COLORS.text.heading} />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* Search History or Main Content */}
        {isFocused ? (
          <SearchHistory 
            history={searchHistory}
            onSelect={(query) => {
              setSearchQuery(query);
              searchInputRef.current?.blur();
            }}
            onClear={(query) => {
              setSearchHistory(history => history.filter(h => h !== query));
            }}
          />
        ) : (
          <>
            <TrendingSearches data={TRENDING_SEARCHES} />
            <MapExploreButton />
            <FeaturedProviders data={FEATURED_PROVIDERS} />
            <SpecialOffers data={SPECIAL_OFFERS} />
            <RecommendedServices />
          </>
        )}
      </ScrollView>
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    ...SHADOWS.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...SHADOWS.card,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  categoryFilters: {
    paddingHorizontal: 20,
  },
  categoryFiltersContent: {
    paddingRight: 20,
  },
  categoryFilterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
    backgroundColor: COLORS.surface,
  },
  categoryFilterItemSelected: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
  },
  categoryFilterText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  categoryFilterTextSelected: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    ...SHADOWS.card,
  },
  viewToggleButton: {
    padding: 8,
    borderRadius: 8,
  },
  viewToggleButtonActive: {
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
  },
  servicesList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  gridItemImage: {
    width: '100%',
    height: 120,
  },
  gridItemContent: {
    padding: 12,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  gridItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridItemRatingText: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  gridItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  gridItemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridItemLocationText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  listItemImage: {
    width: 120,
    height: 120,
  },
  listItemContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  listItemProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  listItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  listItemRatingText: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  listItemLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemLocationText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  listItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
    color: COLORS.text.heading,
  },
  trendingList: {
    flexGrow: 0,
    marginBottom: 16,
  },
  trendingItem: {
    width: 130,
    padding: 16,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    ...SHADOWS.card,
    alignItems: 'center',
  },
  trendingIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingQuery: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  trendingCount: {
    fontSize: 12,
    color: COLORS.text.body,
    opacity: 0.7,
    fontFamily: 'Inter-Regular',
  },
  mapExploreButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  mapExploreGradient: {
    padding: 16,
  },
  mapExploreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mapExploreText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  providerCard: {
    width: 120,
    marginRight: 16,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  providerImage: {
    width: '100%',
    height: 80,
  },
  providerInfo: {
    padding: 8,
  },
  providerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Medium',
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerRatingText: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  offerCard: {
    width: 240,
    height: 160,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  offerGradient: {
    flex: 1,
    padding: 20,
  },
  offerIconContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    width: 100,
    height: 100,
    opacity: 0.2,
    transform: [{ rotate: '-15deg' }],
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  offerDiscount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Inter-Bold',
  },
  offerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  offerValidity: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  searchHistoryContainer: {
    padding: 16,
  },
  searchHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  clearAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  searchHistoryList: {
    gap: 8,
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    ...SHADOWS.card,
  },
  searchHistoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchHistoryItemText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  recommendedList: {
    gap: 16,
  },
  recommendedCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
  },
  recommendedGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 16,
    justifyContent: 'flex-end',
  },
  recommendedContent: {
    gap: 8,
  },
  recommendedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 8,
    fontFamily: 'Inter-Bold',
  },
  recommendedRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedRatingText: {
    marginLeft: 4,
    fontSize: 12,
    color: 'white',
    fontFamily: 'Inter-Medium',
  },
  recommendedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedProvider: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter-Regular',
  },
  recommendedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
});
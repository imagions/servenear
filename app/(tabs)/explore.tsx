import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  Search,
  X,
  FileSliders as Sliders,
  Grid2x2 as Grid,
  List,
  Star,
  MapPin,
} from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { ServiceItem } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import FilterModal from '@/components/FilterModal';
import ServiceCard from '@/components/ServiceCard';
import { mockServices } from '@/constants/mock';
import { useScrollToHide } from '@/hooks/useScrollToHide';
import { supabase } from '@/lib/supabase';

// Dummy Data
const TRENDING_SEARCHES = [
  {
    icon: 'home-repair-service',
    query: 'Electrician',
    count: '2.5k',
    color: '#FF6B6B',
  },
  { icon: 'plumbing', query: 'Plumber', count: '1.8k', color: '#4ECDC4' },
  {
    icon: 'cleaning-services',
    query: 'House Cleaning',
    count: '1.2k',
    color: '#45B7D1',
  },
  { icon: 'ac-unit', query: 'AC Repair', count: '800', color: '#A18CD1' },
];

const SPECIAL_OFFERS = [
  {
    id: '1',
    discount: '20% OFF',
    title: 'On All AC Services',
    validUntil: 'Valid until July 25',
    gradient: ['#FF6B6B', '#EE5D5D'],
    icon: 'ac-unit',
    key: 'ac',
  },
  {
    id: '2',
    discount: '15% OFF',
    title: 'Home Cleaning',
    validUntil: 'Valid until July 31',
    gradient: ['#4ECDC4', '#45B7D1'],
    icon: 'cleaning-services',
    key: 'cleaning',
  },
  {
    id: '3',
    discount: '25% OFF',
    title: 'Plumbing Services',
    validUntil: 'Valid until July 20',
    gradient: ['#A18CD1', '#FBC2EB'],
    icon: 'plumbing',
    key: 'plumbing',
  },
];

// Update MapExploreButton component
const MapExploreButton = () => (
  <TouchableOpacity
    style={styles.mapExploreButton}
    onPress={() => router.push('/map')}
  >
    <LinearGradient
      colors={[COLORS.accent + 'FF', COLORS.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.mapExploreGradient}
    >
      <View style={styles.mapExploreContent}>
        <MaterialIcons name="map" size={24} color="white" />
        <Text style={styles.mapExploreText}>Explore Services Nearby</Text>
        <MaterialIcons name="arrow-forward" size={20} color="white" />
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

// Update RecommendedServices component
const RecommendedServices = () => {
  // Use the 'services' array from the store as a placeholder for nearby services
  const { services } = useServiceStore();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialIcons name="recommend" size={24} color={COLORS.accent} />
        <Text style={styles.sectionTitle}>Recommended for You</Text>
      </View>
      <View style={styles.recommendedList}>
        {services.slice(0, 3).map((service) => (
          <TouchableOpacity
            key={service.id}
            style={styles.recommendedCard}
            onPress={() => router.push(`/service/${service.id}`)}
          >
            <Image
              source={{ uri: service.image }}
              style={styles.recommendedImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.recommendedGradient}
            >
              <View style={styles.recommendedContent}>
                <View style={styles.recommendedHeader}>
                  <Text style={styles.recommendedTitle}>{service.title}</Text>
                  <View style={styles.recommendedRating}>
                    <Star size={12} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.recommendedRatingText}>
                      {service.rating}
                    </Text>
                  </View>
                </View>
                <View style={styles.recommendedFooter}>
                  <Text style={styles.recommendedProvider}>
                    {service.provider_details?.name}
                  </Text>
                  <Text style={styles.recommendedPrice}>
                    ₹{service.price}/hr
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const SearchHistory = ({ history, onSelect, onClear }) => (
  <View style={styles.searchHistoryContainer}>
    <View style={styles.searchHistoryHeader}>
      <Text style={styles.searchHistoryTitle}>Recent Searches</Text>

      <TouchableOpacity onPress={() => onClear(history)}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.searchHistoryList}>
      {history.map((query, index) => (
        <TouchableOpacity
          key={index}
          style={styles.searchHistoryItem}
          onPress={() => onSelect(query)}
        >
          <View style={styles.searchHistoryItemContent}>
            <MaterialIcons name="history" size={20} color={COLORS.accent} />
            <Text style={styles.searchHistoryItemText} numberOfLines={1}>
              {query}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onClear(query)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={16} color={COLORS.accent} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function ExploreScreen() {
  const { q } = useLocalSearchParams<{ q: string }>();
  const [searchQuery, setSearchQuery] = useState(q || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const { services, categories, filterServices, fetchServices } =
    useServiceStore();
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [featuredProviders, setFeaturedProviders] = useState<any[]>([]);
  const searchInputRef = useRef<TextInput>(null);
  const { scrollProps } = useScrollToHide();
  const searchTimeout = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      setSearchHistory((prev) => {
        if (!prev.includes(q)) {
          return [q, ...prev].slice(0, 10); // Limit to 10 recent searches
        }
        return prev;
      });
    }
  }, [q]);

  useEffect(() => {
    const filtered = filterServices(searchQuery, selectedCategories);
    setFilteredServices(filtered);
  }, [q, searchQuery, selectedCategories, services]);

  useEffect(() => {
    // Fetch all services if not already loaded
    if (!services || services.length === 0) {
      fetchServices();
    }
  }, []);

  useEffect(() => {
    // Fetch featured providers from Supabase where is_provider == true
    const fetchFeaturedProviders = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, profile_image, rating, verified')
        .eq('is_provider', true)
        .limit(10);

      if (!error && data) {
        setFeaturedProviders(
          data.map((user) => ({
            id: user.id,
            name: user.name,
            image: user.profile_image,
            rating: user.rating,
            verified: user.verified,
          }))
        );
      }
    };
    fetchFeaturedProviders();
  }, []);

  const saveToSearchHistory = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      // Remove any existing entry (case-insensitive), then add to top, limit to 5
      const filtered = prev.filter(
        (h) => h.trim().toLowerCase() !== trimmed.toLowerCase()
      );
      return [trimmed, ...filtered].slice(0, 5);
    });
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsFocused(true);
    setFilteredServices(services);
  };

  const handleApplyFilters = (filters) => {
    // Handle the filters here
    console.log('Applied filters:', filters);
    setIsFilterModalVisible(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search history
    searchTimeout.current = setTimeout(() => {
      saveToSearchHistory(text);
    }, 1000);

    // Use filterServices from store to search in database
    if (text.trim()) {
      const filtered = filterServices(text, selectedCategories);
      setFilteredServices(filtered);
      setIsFocused(false);
    } else {
      setFilteredServices([]);
    }
  };

  // Also search on submit
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      const filtered = filterServices(searchQuery, selectedCategories);
      setFilteredServices(filtered);
      setIsFocused(false);
      saveToSearchHistory(searchQuery);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const renderServiceGridItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`/service/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.gridItemImage} />
      <View style={styles.gridItemContent}>
        <Text style={styles.gridItemTitle} numberOfLines={1}>
          {item.title}
        </Text>

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
      onPress={() => router.push(`/service/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.listItemImage} />
      <View style={styles.listItemContent}>
        <Text style={styles.listItemTitle} numberOfLines={1}>
          {item.title}
        </Text>
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
        <MaterialIcons
          name="local-fire-department"
          size={24}
          color={COLORS.accent}
        />
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingVertical: 10,
          paddingHorizontal: 5,
        }}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.trendingItem}
            onPress={() => handleSearch(item.query)}
          >
            <View
              style={[
                styles.trendingIcon,
                { backgroundColor: item.color + '15' },
              ]}
            >
              <MaterialIcons name={item.icon} size={28} color={item.color} />
            </View>
            <Text style={styles.trendingQuery}>{item.query}</Text>
            <Text style={styles.trendingCount}>{item.count} searches</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const FeaturedProviders = ({ data }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="verified" size={20} color={COLORS.accent} />
          <Text style={styles.sectionTitle}>Featured Providers</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 5,
        }}
      >
        {data.map((provider, index) => (
          <TouchableOpacity key={index} style={styles.providerCard}
          onPress={() => {
            router.push(`/provider/${provider.id}`);
          }}
          >
            <Image
              source={{ uri: provider.image }}
              style={[styles.providerImage]}
            />
            <View style={styles.providerInfo}>
              <View style={styles.providerNameRow}>
                <Text style={styles.providerName}>{provider.name}</Text>
                {provider.verified && (
                  <MaterialIcons
                    name="verified"
                    size={16}
                    color={COLORS.accent}
                  />
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 5 }}
      >
        {data.map((offer, index) => (
          <TouchableOpacity
            key={index}
            style={styles.offerCard}
            onPress={() => {
              handleSearch(offer.key);
            }}
          >
            <LinearGradient
              colors={offer.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.offerGradient}
            >
              <View style={styles.offerIconContainer}>
                <MaterialIcons name={offer.icon} size={60} color="white" />
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

  // In SearchResults, sort so results matching the first word are on top
  const SearchResults = ({ results, query }) => {
    const words = (query || '').toLowerCase().split(/\s+/).filter(Boolean);
    let sortedResults = results;
    if (words.length > 0) {
      const firstWord = words[0];
      sortedResults = [
        ...results.filter((item) => {
          // Gather all searchable fields
          const searchable: string[] = [
            item.title || '',
            item.provider_details?.bio || '',
            ...(item.provider_details?.skills || []),
            item.provider_details?.name || item.provider || '',
            item.category_details?.name || '',
            item.description || '',
            ...(item.tags || []),
            item.subcategory_details?.name || '',
          ].map((str) => (str || '').toLowerCase());
          return searchable.some((field) => field.includes(firstWord));
        }),
        ...results.filter((item) => {
          // Same as above, but does NOT match first word
          const searchable: string[] = [
            item.title || '',
            item.provider_details?.bio || '',
            ...(item.provider_details?.skills || []),
            item.provider_details?.name || item.provider || '',
            item.category_details?.name || '',
            item.description || '',
            ...(item.tags || []),
            item.subcategory_details?.name || '',
          ].map((str) => (str || '').toLowerCase());
          return !searchable.some((field) => field.includes(firstWord));
        }),
      ];
    }
    return (
      <View style={styles.searchResults}>
        <Text style={styles.resultsCount}>
          {sortedResults?.length || 0} services found
        </Text>
        <FlatList
          {...scrollProps}
          showsVerticalScrollIndicator={false}
          data={sortedResults}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              icon={''}
              searchQuery={query}
              mode="search"
              scrollToCard={true}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.searchResultsList}
        />
      </View>
    );
  };

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
            placeholderTextColor="#9E9E9E"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsFocused(true)}
            onSubmitEditing={handleSearchSubmit}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => handleClearSearch()}>
              <X size={20} color={COLORS.text.body} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setIsFilterModalVisible(true)}>
            <MaterialIcons
              name="filter-list"
              size={20}
              color={COLORS.text.body}
            />
          </TouchableOpacity>
        </View>
      </View>

      {searchQuery ? (
        <SearchResults results={filteredServices} query={searchQuery} />
      ) : (
        <ScrollView {...scrollProps} showsVerticalScrollIndicator={false}>
          {/* Search History or Main Content */}

          {isFocused && searchHistory.length > 0 && (
            <SearchHistory
              history={searchHistory}
              onSelect={(query) => {
                saveToSearchHistory(query); // Deduplicate and move to top
                setSearchQuery(query);
                searchInputRef.current?.blur();
              }}
              onClear={(query) => {
                if (Array.isArray(query)) {
                  // Clear all
                  setSearchHistory([]);
                } else {
                  // Remove single entry (case-insensitive)
                  setSearchHistory((history) =>
                    history.filter(
                      (h) =>
                        h.trim().toLowerCase() !== query.trim().toLowerCase()
                    )
                  );
                }
              }}
            />
          )}
          <>
            <TrendingSearches data={TRENDING_SEARCHES} />
            <MapExploreButton />
            <FeaturedProviders data={featuredProviders} />
            <SpecialOffers data={SPECIAL_OFFERS} />
            <RecommendedServices />
            <View style={{ marginTop: 60 }} />
          </>
        </ScrollView>
      )}

      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
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
    paddingVertical: 2,
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
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...SHADOWS.card,
  },
  filterButton: {
    width: 40,
    height: 40,
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
    fontSize: 14,
    color: COLORS.text.body,
    marginVertical: 8,
    fontFamily: 'Inter-Regular',
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
    marginTop: 10,
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
  },
  mapExploreGradient: {
    padding: 16,
  },
  mapExploreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  mapExploreText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    backgroundColor: 'transparent',
  },
  providerCard: {
    width: 125,
    marginRight: 16,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  providerImage: {
    width: '100%',
    height: 100,
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
    paddingHorizontal: 16,
    marginBottom: 15,
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
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  searchHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 207, 232, 0.12)',
    borderRadius: 50,
  },
  searchHistoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchHistoryItemText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  recommendedList: {
    gap: 16,
    paddingHorizontal: 5,
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
  searchResults: {
    flex: 1,
    paddingHorizontal: 10,
  },
  searchResultsList: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

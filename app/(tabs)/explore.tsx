import React, { useState, useEffect } from 'react';
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
import { useSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { Search, X, FileSliders as Sliders, Grid2x2 as Grid, List, Star, MapPin } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { ServiceItem } from '@/types';

export default function ExploreScreen() {
  const  query  = 'dsf';
  const [searchText, setSearchText] = useState(query?.toString() || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const { services, categories, filterServices } = useServiceStore();
  const [filteredServices, setFilteredServices] = useState<ServiceItem[]>([]);
  
  useEffect(() => {
    if (query) {
      setSearchText(query.toString());
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
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9E9E9E" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search for services..." 
            placeholderTextColor="#9E9E9E"
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={handleClearSearch}>
              <X size={20} color="#9E9E9E" />
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
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryFilters}
        contentContainerStyle={styles.categoryFiltersContent}>
        {categories.map((category) => (
          <TouchableOpacity 
            key={category.id}
            style={[
              styles.categoryFilterItem,
              selectedCategories.includes(category.id) && styles.categoryFilterItemSelected
            ]}
            onPress={() => handleCategorySelect(category.id)}>
            <Text 
              style={[
                styles.categoryFilterText,
                selectedCategories.includes(category.id) && styles.categoryFilterTextSelected
              ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{filteredServices.length} services found</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.viewToggleButton, isGridView && styles.viewToggleButtonActive]}
            onPress={() => setIsGridView(true)}>
            <Grid size={20} color={isGridView ? COLORS.accent : COLORS.text.body} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewToggleButton, !isGridView && styles.viewToggleButtonActive]}
            onPress={() => setIsGridView(false)}>
            <List size={20} color={!isGridView ? COLORS.accent : COLORS.text.body} />
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={filteredServices}
        renderItem={isGridView ? renderServiceGridItem : renderServiceListItem}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 2 : 1}
        key={isGridView ? 'grid' : 'list'}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptySubText}>Try different search terms or filters</Text>
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
});
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Star, MapPin } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { SubCategory, ServiceItem } from '@/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams();
  const { getCategoryById, getSubcategoriesByCategoryId, getServicesByCategoryId } = useServiceStore();
  
  const category = getCategoryById(id as string);
  const subcategories = getSubcategoriesByCategoryId(id as string);
  const services = getServicesByCategoryId(id as string);
  
  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
        <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const renderSubcategoryItem = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity 
      style={styles.subcategoryItem}
      onPress={() => router.push(`/explore?category=${item.id}`)}>
      <View style={styles.subcategoryImageContainer}>
        <Image source={{ uri: item.image }} style={styles.subcategoryImage} />
      </View>
      <Text style={styles.subcategoryName}>{item.name}</Text>
    </TouchableOpacity>
  );
  
  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity 
      style={styles.serviceItem}
      onPress={() => router.push(`/service/${item.id}`)}>
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.serviceProvider}>{item.provider}</Text>
        
        <View style={styles.serviceDetails}>
          <View style={styles.serviceRating}>
            <Star size={12} color="#FFB800" fill="#FFB800" />
            <Text style={styles.serviceRatingText}>{item.rating}</Text>
          </View>
          
          <View style={styles.serviceLocation}>
            <MapPin size={12} color="#9E9E9E" />
            <Text style={styles.serviceLocationText}>{item.distance} mi</Text>
          </View>
        </View>
        
        <Text style={styles.servicePrice}>${item.price}/hr</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Subcategories</Text>
        <FlatList
          data={subcategories}
          renderItem={renderSubcategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subcategoriesList}
        />
        
        <View style={styles.servicesHeader}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <TouchableOpacity onPress={() => router.push(`/explore?category=${id}`)}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.servicesList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 20,
    fontFamily: 'Inter-Bold',
  },
  backButtonLarge: {
    backgroundColor: COLORS.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  subcategoriesList: {
    paddingBottom: 16,
  },
  subcategoryItem: {
    width: 100,
    alignItems: 'center',
    marginRight: 16,
  },
  subcategoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 8,
    ...SHADOWS.card,
  },
  subcategoryImage: {
    width: '100%',
    height: '100%',
  },
  subcategoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.body,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  servicesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
  },
  servicesList: {
    paddingBottom: 100,
  },
  serviceItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  serviceImage: {
    width: 120,
    height: 120,
  },
  serviceContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceRatingText: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  serviceLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceLocationText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
});
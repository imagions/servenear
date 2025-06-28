import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Star, MapPin } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { SubCategory, ServiceItem } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    getCategoryById,
    getSubcategoriesByCategoryId,
    getServicesByCategoryId,
  } = useServiceStore();

  const category = getCategoryById(id as string);
  const subcategories = getSubcategoriesByCategoryId(id as string);
  const services = getServicesByCategoryId(id as string);
  const [isGridView, setIsGridView] = useState(true);

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderSubcategoryItem = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity
      style={styles.subcategoryCard}
      onPress={() => router.push(`/explore?category=${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.subcategoryImage} />
      <View style={styles.subcategoryContent}>
        <Text style={styles.subcategoryTitle} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.subcategoryMeta}>
          <Text style={styles.subcategoryStartingFrom}>Starting from</Text>
          <Text style={styles.subcategoryPrice}>${item.startingPrice}</Text>
        </View>
        <View style={styles.servicesCount}>
          <Text style={styles.servicesCountText}>
            {item.servicesCount} services
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={subcategories}
        renderItem={renderSubcategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.subcategoriesList}
        showsVerticalScrollIndicator={false}
      />
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
  subcategoriesList: {
    padding: 16,
  },
  subcategoryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  subcategoryImage: {
    flex: 0.6,
    width: 10,
  },
  subcategoryContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  subcategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  subcategoryMeta: {
    marginBottom: 8,
  },
  subcategoryStartingFrom: {
    fontSize: 12,
    color: COLORS.text.body,
    marginBottom: 2,
    fontFamily: 'Inter-Regular',
  },
  subcategoryPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  servicesCount: {
    backgroundColor: `${COLORS.accent}10`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  servicesCountText: {
    fontSize: 12,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
});

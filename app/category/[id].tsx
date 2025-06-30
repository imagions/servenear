import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Star, MapPin } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { ServiceItem } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

export default function CategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const {
    getCategoryById,
    getServicesByCategoryId,
  } = useServiceStore();

  const category = getCategoryById(id as string);
  const services = getServicesByCategoryId(id as string);


  console.log(`Category ID: ${category?.id}`);
  console.log(`Servicesssssss: ${services}`);

  if (!category) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Category not found</Text>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.backButtonLarge}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
    <TouchableOpacity activeOpacity={0.7}
      style={styles.serviceCard}
      onPress={() => router.push(`/service/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.serviceImage} />
      <View style={styles.serviceContent}>
        <Text style={styles.serviceTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.serviceMeta}>
          <View style={styles.serviceRating}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.serviceRatingText}>{item.rating}</Text>
          </View>
          <View style={styles.serviceLocation}>
            <MapPin size={12} color="#9E9E9E" />
            <Text style={styles.serviceLocationText}>
              {item.location?.address || 'Patna, Bihar'}
            </Text>
          </View>
        </View>
        <Text style={styles.servicePrice}>₹{item.price}/hr</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.name}</Text>
        <View style={{ width: 40 }} />
      </View>
      <Text style={styles.sectionTitle}>Services</Text>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.servicesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No services found for this category.</Text>
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
    paddingTop: 50,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginLeft: 20,
    marginTop: 6,
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginBottom: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  serviceImage: {
    width: 90,
    height: '100%',
    borderTopLeftRadius: RADIUS.card,
    borderBottomLeftRadius: RADIUS.card,
    backgroundColor: '#f2f2f2',
  },
  serviceContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
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
  emptyText: {
    fontSize: 16,
    color: COLORS.text.body,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Inter-Regular',
  },
});
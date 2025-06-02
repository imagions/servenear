import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  ArrowLeft,
  Heart,
  Star,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ShoppingCart,
} from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { ReviewItem } from '@/types';
import * as Haptics from 'expo-haptics';

export default function ServiceDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { getServiceById, reviews } = useServiceStore();
  const service = getServiceById(id as string);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity
          style={styles.backButtonLarge}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookNow = () => {
    router.push(`/schedule?serviceId=${service.id}`);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const renderReviewItem = ({ item }: { item: ReviewItem }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.userImage }} style={styles.reviewerImage} />
        <View>
          <Text style={styles.reviewerName}>{item.userName}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Star size={14} color="#FFB800" fill="#FFB800" />
          <Text style={styles.reviewRatingText}>{item.rating}</Text>
        </View>
      </View>

      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.serviceImage} />

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleFavoriteToggle}
            >
              <Heart
                size={24}
                color="white"
                fill={isFavorite ? 'white' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingText}>{service.rating}</Text>
              <Text style={styles.reviewCount}>
                ({service.reviewCount} reviews)
              </Text>
            </View>
          </View>

          <View style={styles.providerContainer}>
            <Image
              source={{ uri: service.providerImage }}
              style={styles.providerImage}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{service.provider}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#9E9E9E" />
                <Text style={styles.locationText}>
                  {service.location.address}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Service</Text>
            <Text style={styles.descriptionText}>{service.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityItem}>
                <Clock size={20} color={COLORS.accent} />
                <Text style={styles.availabilityText}>
                  Available hours: {service.availability.hours}
                </Text>
              </View>

              <View style={styles.availabilityItem}>
                <Calendar size={20} color={COLORS.accent} />
                <Text style={styles.availabilityText}>
                  Available days: {service.availability.days}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pricing</Text>
            <View style={styles.pricingContainer}>
              <View style={styles.pricingRow}>
                <View>
                  <Text style={styles.pricingLabel}>One-time Visit</Text>
                  <Text style={styles.pricingDescription}>
                    Fixed rate for single service
                  </Text>
                </View>
                <Text style={styles.pricingValue}>${service.fixedPrice}</Text>
              </View>

              <View style={[styles.pricingRow, styles.pricingDivider]}>
                <View>
                  <Text style={styles.pricingLabel}>Hourly Rate</Text>
                  <Text style={styles.pricingDescription}>
                    For time-based services
                  </Text>
                </View>
                <Text style={styles.pricingValue}>${service.price}/hr</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ratingsBreakdown}>
              <View style={styles.overallRating}>
                <Text style={styles.overallRatingValue}>{service.rating}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      color="#FFB800"
                      fill={
                        star <= Math.floor(service.rating)
                          ? '#FFB800'
                          : 'transparent'
                      }
                    />
                  ))}
                </View>
                <Text style={styles.overallRatingText}>Overall Rating</Text>
              </View>

              <View style={styles.ratingBreakdownItems}>
                <View style={styles.ratingBreakdownItem}>
                  <Text style={styles.ratingCategoryText}>Respect</Text>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingFill,
                        { width: `${(service.ratings.respect / 5) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingValueText}>
                    {service.ratings.respect}
                  </Text>
                </View>

                <View style={styles.ratingBreakdownItem}>
                  <Text style={styles.ratingCategoryText}>Trust</Text>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingFill,
                        { width: `${(service.ratings.trust / 5) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingValueText}>
                    {service.ratings.trust}
                  </Text>
                </View>

                <View style={styles.ratingBreakdownItem}>
                  <Text style={styles.ratingCategoryText}>Communication</Text>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingFill,
                        {
                          width: `${
                            (service.ratings.communication / 5) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingValueText}>
                    {service.ratings.communication}
                  </Text>
                </View>

                <View style={styles.ratingBreakdownItem}>
                  <Text style={styles.ratingCategoryText}>Punctuality</Text>
                  <View style={styles.ratingBar}>
                    <View
                      style={[
                        styles.ratingFill,
                        {
                          width: `${(service.ratings.punctuality / 5) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.ratingValueText}>
                    {service.ratings.punctuality}
                  </Text>
                </View>
              </View>
            </View>

            <FlatList
              data={reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.priceValue}>
            ${Math.min(service.fixedPrice, service.price)}
          </Text>
        </View>

        <View style={styles.footerButtons}>
          <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
            <ShoppingCart size={24} color={COLORS.accent} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
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
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  headerActions: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 100,
  },
  serviceHeader: {
    marginBottom: 20,
  },
  serviceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginLeft: 8,
    marginRight: 4,
    fontFamily: 'Inter-SemiBold',
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  providerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 24,
    ...SHADOWS.card,
  },
  providerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: COLORS.text.body,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  availabilityContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOWS.card,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  availabilityText: {
    fontSize: 16,
    color: COLORS.text.body,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  pricingContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOWS.card,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  pricingDivider: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
    paddingTop: 16,
  },
  pricingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  pricingDescription: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  pricingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  ratingsBreakdown: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  overallRating: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    paddingRight: 16,
    marginRight: 16,
  },
  overallRatingValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  overallRatingText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingBreakdownItems: {
    flex: 1,
  },
  ratingBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingCategoryText: {
    width: 100,
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  ratingValueText: {
    width: 30,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.heading,
    textAlign: 'right',
    fontFamily: 'Inter-Medium',
  },
  reviewItem: {
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
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 'auto',
  },
  reviewRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB800',
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...SHADOWS.card,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: 'normal',
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  footerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.accent}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    ...SHADOWS.card,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});

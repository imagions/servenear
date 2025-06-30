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
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  Check as CheckIcon,
  Trash2,
} from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { useCartStore } from '@/store/useCartStore';
import { ReviewItem } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';

const DUMMY_REVIEW_IMAGES = [
  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=300&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?w=300&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?w=300&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/1181674/pexels-photo-1181674.jpeg?w=300&auto=compress&cs=tinysrgb',
];

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { getServiceById, reviews } = useServiceStore();
  const { addToCart, removeFromCart, items: cart } = useCartStore();
  const service = getServiceById(id as string);
  const [isFavorite, setIsFavorite] = useState(false);

  console.log('serviceserviceid', id);
  console.log('serviceservice', service);

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity activeOpacity={0.7}
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
    addToCart({
      id: service.id,
      title: service.title,
      price: Math.min(
        service.fixedPrice || service.once_price,
        service.price || service.hourly_price
      ),
      image: service.image || '',
      provider: service.provider_details?.name || 'Unknown Provider',
    });
  };

  const handleProviderPress = () => {
    router.push(`/provider/${service.provider_details?.id || service.id}`);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const randomReviews = [
    'Very satisfied with ' +
      service.title +
      ' from ' +
      (service.provider_details?.name || 'Unknown Provider') +
      '. I recommend their service without hesitation.',
    'Excellent service! Highly recommend ' +
      service.title +
      ' by ' +
      (service.provider_details?.name || 'Unknown Provider') +
      '.',
    (service.provider_details?.name || 'Unknown Provider') +
      ' delivers outstanding ' +
      service.title +
      ' services with true professionalism. Highly recommended!',
    'Top-notch ' +
      service.title +
      ' services by ' +
      (service.provider_details?.name || 'Unknown Provider') +
      '. Truly professional and dependable.',
  ];

  const renderReviewItem = ({ item }: { item: ReviewItem; service: any }) => (
    <View style={styles.reviewItem}>
      <TouchableOpacity activeOpacity={0.7}
        style={styles.reviewHeader}
        onPress={() => handleUserPress(item.userId)}
      >
        <Image source={{ uri: item.userImage }} style={styles.reviewerImage} />
        <View>
          <Text style={styles.reviewerName}>{item.userName}</Text>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Star size={14} color="#FFB800" fill="#FFB800" />
          <Text style={styles.reviewRatingText}>{item.rating}</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.reviewComment}>
        {randomReviews[Math.floor(Math.random() * randomReviews.length)]}
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {DUMMY_REVIEW_IMAGES?.slice(0, 2).map((photo, index) => (
          <Image key={photo} source={{ uri: photo }} />
        ))}
      </ScrollView>
    </View>
  );

  // Use database fields with fallbacks
  const providerName = service.provider_details?.name || 'Unknown Provider';
  const providerImage =
    service.provider_details?.profile_image ||
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=300&auto=compress&cs=tinysrgb';
  const serviceRating = service.rating || 0;
  const reviewCount = service.reviewCount || 12;
  const hourlyPrice = service.hourly_price || service.price || 0;
  const fixedPrice = service.once_price || service.fixedPrice || 0;
  const serviceImage =
    service.image ||
    'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg?w=300&auto=compress&cs=tinysrgb';
  const serviceDescription = service.description || 'No description available';
  const serviceAvailability = service.availability || {
    days: 'Mon-Fri',
    hours: '9:00 AM - 5:00 PM',
  };

  // Check if item is already in cart
  const isInCart = cart.some((item) => item.id === service.id);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer} key={service.id}>
          <Image source={{ uri: serviceImage }} style={styles.serviceImage} />

          <View style={styles.headerActions}>
            <TouchableOpacity activeOpacity={0.7}
              style={styles.actionButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}
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
              <Text style={styles.ratingText}>{serviceRating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({reviewCount} reviews)</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.7}
            style={styles.providerContainer}
            onPress={handleProviderPress}
          >
            <Image
              source={{ uri: providerImage }}
              style={styles.providerImage}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{providerName}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color="#9E9E9E" />
                <Text style={styles.locationText}>
                  {service.lat && service.long
                    ? `${service.lat.toFixed(2)}, ${service.long.toFixed(2)}`
                    : 'Location not available'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Service</Text>
            <Text style={styles.descriptionText}>{serviceDescription}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.availabilityContainer}>
              <View style={styles.availabilityItem}>
                <Clock size={20} color={COLORS.accent} />
                <Text style={styles.availabilityText}>
                  Available hours: {serviceAvailability.hours}
                </Text>
              </View>

              <View style={styles.availabilityItem}>
                <Calendar size={20} color={COLORS.accent} />
                <Text style={styles.availabilityText}>
                  Available days: {serviceAvailability.days}
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
                <Text style={styles.pricingValue}>₹{fixedPrice}</Text>
              </View>

              <View style={[styles.pricingRow, styles.pricingDivider]}>
                <View>
                  <Text style={styles.pricingLabel}>Hourly Rate</Text>
                  <Text style={styles.pricingDescription}>
                    For time-based services
                  </Text>
                </View>
                <Text style={styles.pricingValue}>₹{hourlyPrice}/hr</Text>
              </View>
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews & Photos</Text>
              <View style={styles.overallRating}>
                <Text style={styles.overallRatingValue}>
                  {serviceRating.toFixed(1)}
                </Text>
                <View style={styles.starsContainer}>
                  <Star size={16} color="#FFB800" fill={'#FFB800'} />
                </View>
                <Text style={styles.totalReviews}>({reviewCount})</Text>
              </View>
            </View>

            {/* Photos Grid */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.reviewPhotosContainer}
            >
              {DUMMY_REVIEW_IMAGES.slice(0, 4).map((photo, index) => (
                <TouchableOpacity activeOpacity={0.7} key={index} style={styles.photoPreview}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photoThumbnail}
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity activeOpacity={0.7} style={styles.viewAllPhotos} onPress={() => {}}>
                <MaterialIcons
                  name="photo-library"
                  size={24}
                  color={COLORS.text.body}
                />
                <Text style={styles.viewAllPhotosText}>View All</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Recent Reviews */}

            {reviews?.slice(0, 2).map((review) => (
              <View key={review.id}>
                {renderReviewItem({ item: review, service: service })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Starting from</Text>
          <Text style={styles.priceValue}>
            ₹{Math.min(fixedPrice, hourlyPrice)}
          </Text>
        </View>

        <View style={styles.footerButtons}>
          {isInCart ? (
            <TouchableOpacity activeOpacity={0.7}
              style={styles.cartButton}
              onPress={() => removeFromCart(service.id)}
            >
              <Trash2 size={24} color={COLORS.accent} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity activeOpacity={0.7}
              style={styles.cartButton}
              onPress={handleAddToCart}
            >
              <ShoppingCart size={24} color={COLORS.accent} />
            </TouchableOpacity>
          )}

          <TouchableOpacity activeOpacity={0.7} style={styles.bookButton} onPress={handleBookNow}>
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
    marginBottom: 0,
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
    marginHorizontal: 12,
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
  overallRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overallRatingValue: {
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  totalReviews: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
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
  reviewPhotosContainer: {
    marginVertical: 16,
  },
  photoPreview: {
    width: 120,
    height: 120,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoThumbnail: {
    width: '100%',
    height: '100%',
  },
  viewAllPhotos: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  viewAllPhotosText: {
    fontSize: 14,
    color: COLORS.text.body,
    marginTop: 8,
    fontFamily: 'Inter-Medium',
  },
  seeAllReviews: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 8,
  },
  seeAllReviewsText: {
    fontSize: 16,
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

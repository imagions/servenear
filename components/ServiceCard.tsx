import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Star, MapPin } from 'lucide-react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router } from 'expo-router';
import { ServiceItem } from '@/types';
import * as Location from 'expo-location';
import { useAuthStore } from '@/store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ServiceCardProps = {
  service: ServiceItem;
  icon: string;
  searchQuery?: string;
  mode?: 'normal' | 'search';
  scrollToCard?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
};

// Add helper function for distance calculation
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

export default function ServiceCard({
  service,
  icon,
  searchQuery,
  mode = 'normal',
  scrollToCard = false,
  userLocation,
}: ServiceCardProps) {
  // Get the user's stored location from the auth store
  const authLocation = useAuthStore((s) => s.user?.location);

  // State to hold the effective user location
  const [effectiveUserLocation, setEffectiveUserLocation] = React.useState(
    authLocation && authLocation.latitude !== undefined
      ? authLocation
      : userLocation
  );

  // Effect to fetch user location from AsyncStorage if not in auth store
  React.useEffect(() => {
    const getStoredLocation = async () => {
      if (!authLocation || authLocation.latitude === undefined) {
        const stored = await AsyncStorage.getItem('auth-user-location');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (
              parsed &&
              typeof parsed.latitude === 'number' &&
              typeof parsed.longitude === 'number'
            ) {
              setEffectiveUserLocation(parsed);
              return;
            }
          } catch {}
        }
        setEffectiveUserLocation(userLocation);
      } else {
        setEffectiveUserLocation(authLocation);
      }
    };
    getStoredLocation();
  }, [authLocation, userLocation]);

  const handleViewLocation = () => {
    router.push({
      pathname: '/map',
      params: {
        latitude: service.lat || 37.7749,
        longitude: service.long || -122.4194,
        serviceId: service.id,
        scrollTo: scrollToCard ? 'true' : 'false',
      },
    });
  };

  const hasImage = !!service.image;

  const highlightText = (text: string, query: string) => {
    if (!query?.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <Text key={i} style={styles.highlightedText}>
              {part}
            </Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </>
    );
  };

  // Use provider details from database or fallback to mock data
  const providerName = service.provider_details?.name || 'Unknown Provider';
  const providerVerified = service.provider_details?.verified || false;
  const serviceRating = service.rating || 0;
  const servicePrice = service.price || service.hourly_price || 0;

  // Calculate distance if we have both coordinates
  const distanceKm =
    service.lat !== undefined &&
    service.long !== undefined &&
    effectiveUserLocation &&
    effectiveUserLocation.latitude !== undefined &&
    effectiveUserLocation.longitude !== undefined
      ? calculateDistance(
          effectiveUserLocation.latitude,
          effectiveUserLocation.longitude,
          service.lat,
          service.long
        )
      : null;

  // Use calculated distance or fallback to service distance

  const displayDistance = distanceKm
    ? `${distanceKm.toFixed(1)} km`
    : 'Fetching...';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={() => {
        router.push(`/service/${service.id}`);
      }}
    >
      <View style={styles.header}>
        {hasImage ? (
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
        ) : (
          <View style={styles.placeholderIcon}>
            <MaterialIcons name={icon as any} size={32} color={COLORS.accent} />
          </View>
        )}

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {searchQuery
                ? highlightText(service.title, searchQuery)
                : service.title}
            </Text>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingText}>{serviceRating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.providerRow}>
            {providerVerified && (
              <MaterialIcons name="verified" size={13} color={COLORS.accent} />
            )}
            <Text style={styles.providerName}>{providerName}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {service.description || 'No description available'}
      </Text>

      <View style={styles.footer}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>₹{servicePrice}/hr</Text>
        </View>

        <View style={styles.footerRight}>
          <View style={styles.distanceBadge}>
            <MapPin size={14} color={COLORS.accent} />
            <Text style={styles.distanceText}>{displayDistance}</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.viewButton}
            onPress={handleViewLocation}
          >
            <MaterialIcons name="location-on" size={14} color={COLORS.accent} />
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: `${COLORS.accent}10`,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.heading,
    marginRight: 8,
    fontFamily: 'Inter-Medium',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFB800',
    marginLeft: 4,
    fontFamily: 'Inter-Medium',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  providerName: {
    fontSize: 12,
    color: COLORS.accent,
    marginLeft: 4,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  description: {
    fontSize: 12,
    color: COLORS.text.body,
    marginBottom: 12,
    lineHeight: 18,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceBadge: {
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  viewText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 10,
  },
  placeholderIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: `${COLORS.accent}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  highlightedText: {
    backgroundColor: `${COLORS.accent}20`,
    color: COLORS.accent,
    fontWeight: '600',
  },
});

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, MapType } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, MapPin, Search, Clock } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import * as Location from 'expo-location';
import ServiceCard from '@/components/ServiceCard';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import FilterModal from '@/components/FilterModal';
import { GOOGLE_MAPS_API_KEY } from '@/config/keys';

const { width } = Dimensions.get('window');

// Navigation lock
let isNavigating = false;

// Memoized service card component
const ServiceListItem = memo(
  ({ item, onPress, isSelected, distance, routeInfo }: any) => {
    const onGestureEvent = useCallback(
      ({ nativeEvent }) => {
        if (nativeEvent.translationY < -50 && !isNavigating) {
          isNavigating = true;
          requestAnimationFrame(() => {
            router.push(`/service/${item.id}`);
            // Reset after navigation
            setTimeout(() => {
              isNavigating = false;
            }, 1000);
          });
        }
      },
      [item.id]
    );

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent} minDist={20}>
        <Animated.View
          style={[
            styles.cardContainer,
            isSelected && styles.selectedCardContainer,
          ]}
        >
          <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
            {/* Main Row */}
            <View style={styles.bottomSheetHandle} />
            <View style={styles.mainRow}>
              <Image source={{ uri: item.image }} style={styles.serviceImage} />
              <View style={styles.mainInfo}>
                <Text style={styles.serviceTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <View style={styles.providerRow}>
                  <Text style={styles.serviceProvider}>
                    {item.provider_details.name}
                  </Text>
                  {item.verified && (
                    <MaterialIcons
                      name="verified"
                      size={14}
                      color={COLORS.accent}
                    />
                  )}
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#FFB800" fill="#FFB800" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.serviceDescription} numberOfLines={2}>
              {item.description}
            </Text>

            {/* Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.locationInfo}>
                <MapPin size={14} color={COLORS.accent} />
                <Text style={styles.distanceText}>
                  {distance ? `${distance} km` : 'Calculating...'}
                </Text>
                {routeInfo && (
                  <>
                    <View style={styles.dotSeparator} />
                    <Clock size={14} color={COLORS.accent} />
                    <Text style={styles.timeText}>
                      {Math.round(routeInfo.duration)} min
                    </Text>
                  </>
                )}
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => router.push(`/service/${item.id}`)}
              >
                <Text style={styles.viewButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

// Add this custom hook for debouncing location updates
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Add Memoized Marker component
const ServiceMarker = memo(({ service, isSelected, onPress }: any) => {
  // Guard: Only render marker if valid coordinates
  const lat = service?.location?.latitude ?? service?.lat;
  const lng = service?.location?.longitude ?? service?.long;
  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    isNaN(lat) ||
    isNaN(lng)
  ) {
    return null;
  }
  return (
    <Marker
      coordinate={{
        latitude: lat,
        longitude: lng,
      }}
      onPress={() => onPress(service)}
    >
      <View style={styles.markerWrapper}>
        <View style={styles.markerContainer}>
          <MaterialIcons
            name="location-pin"
            size={38}
            color={isSelected ? COLORS.accent : '#666'}
          />
        </View>
        <View style={styles.markerTail} />
      </View>
    </Marker>
  );
});

export default function MapScreen() {
  const params = useLocalSearchParams();
  const { services, fetchServices } = useServiceStore();
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedService, setSelectedService] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState<typeof services>([]);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [distance, setDistance] = useState<string | null>(null);
  type RouteInfo = { distance: number; duration: number } | null;
  const [routeInfo, setRouteInfo] = useState<RouteInfo>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const mapRef = useRef<MapView>(null);
  const listRef = useRef<FlatList<any>>(null);
  const mounted = useRef(false); // Add this line

  useEffect(() => {
    mounted.current = true;

    const initLocation = async () => {
      if (params.latitude && params.longitude) {
        // Center map on the service location from params
        if (mounted.current) {
          setRegion({
            latitude: parseFloat(params.latitude as string),
            longitude: parseFloat(params.longitude as string),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }

        // Select the service if serviceId is provided
        if (params.serviceId && mounted.current) {
          const service = services.find((s) => s.id === params.serviceId);
          if (service) {
            setSelectedService(service as any);

            // If scrollTo param is true, scroll to the service card
            if (params.scrollTo === 'true') {
              const serviceIndex = services.findIndex(
                (s) => s.id === params.serviceId
              );
              if (serviceIndex !== -1) {
                // Add slight delay to ensure list is rendered
                setTimeout(() => {
                  scrollToService(serviceIndex);
                }, 500);
              }
            }
          }
        }
      } else {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted' && mounted.current) {
            const location = await Location.getCurrentPositionAsync({});
            setRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        } catch (error) {
          console.log('Error getting location:', error);
        }
      }
    };

    initLocation();

    return () => {
      mounted.current = false;
    };
  }, [
    params.latitude,
    params.longitude,
    params.serviceId,
    params.scrollTo,
    services,
  ]);

  // Always fetch all services on mount if not loaded
  useEffect(() => {
    if (!services || services.length === 0) {
      fetchServices();
    }
  }, [services, fetchServices]);

  // Always show all services on map and in ServiceCard list
  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  const handleMarkerPress = useCallback(
    (service) => {
      const currentServices =
        filteredServices.length > 0 ? filteredServices : services || [];
      const serviceIndex = currentServices.findIndex(
        (s) => s.id === service.id
      );

      if (serviceIndex !== -1) {
        setSelectedService(service);

        // Scroll the card list to the selected service
        scrollToService(serviceIndex);

        // Animate map to center on the selected service
        mapRef.current?.animateToRegion(
          {
            latitude: service.location.latitude,
            longitude: service.location.longitude,
            latitudeDelta: 0.005, // Zoom in closer when marker is tapped
            longitudeDelta: 0.005,
          },
          500
        );
      }
    },
    [filteredServices, services]
  );

  // Helper function for distance calculation
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  // Search functionality
  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim()) {
      const filtered = services.filter(
        (service) =>
          service.title.toLowerCase().includes(text.toLowerCase()) ||
          service.provider_details?.name
            .toLowerCase()
            .includes(text.toLowerCase())
      );
      setFilteredServices(filtered as any);
    } else {
      setFilteredServices(services as any);
    }
  };

  // Map controls
  const handleZoomToUser = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleToggleMapType = () => {
    setMapType((prev) => (prev === 'standard' ? 'hybrid' : 'standard'));
  };

  const handleLocatePress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 10,
        });

        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(userLoc);
        mapRef.current?.animateToRegion({
          ...userLoc,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.log('Error getting location:', error);
    }
  };

  const handleServicePress = (service) => {
    setSelectedService(service);
    if (userLocation) {
      const serviceLoc = {
        latitude: service.location.latitude,
        longitude: service.location.longitude,
      };

      // Clear existing polyline
      setPolylineCoordinates([]);

      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        service.location.latitude,
        service.location.longitude
      );
      setDistance(dist.toFixed(1));
    }
  };

  const handleFilterApply = (filters) => {
    // Apply the filters to the services
    const filteredResults = services.filter((service) => {
      // Distance filter
      if (filters.distance) {
        const distance = calculateDistance(
          userLocation?.latitude || region.latitude,
          userLocation?.longitude || region.longitude,
          service.location.latitude,
          service.location.longitude
        );
        if (distance > filters.distance) return false;
      }

      // Price filter
      if (
        service.price < filters.priceRange.min ||
        service.price > filters.priceRange.max
      )
        return false;

      // Rating filter
      if (filters.rating && service.rating < filters.rating) return false;

      // Verified filter
      if (filters.verifiedOnly && !service.verified) return false;

      return true;
    });

    setFilteredServices(filteredResults);
  };

  // Update getItemLayout to include the correct dimensions
  const getItemLayout = useCallback(
    (data, index) => ({
      length: 320 + 12, // card width + margin
      offset: (320 + 12) * index, // card width + margin
      index,
    }),
    []
  );

  // Update scrollToService function to center the item
  const scrollToService = (index) => {
    const screenWidth = Dimensions.get('window').width;
    const itemWidth = 320 + 12; // card width + margin
    const offset = index * itemWidth;
    const centerOffset = (screenWidth - itemWidth) / 2;

    listRef.current?.scrollToOffset({
      offset: offset - centerOffset,
      animated: true,
    });
  };

  // Add this function to handle scroll events
  const handleScroll = useCallback(
    (event: any) => {
      const scrollPosition = event.nativeEvent.contentOffset.x;
      const itemWidth = 320 + 12; // card width + margin
      const index = Math.round(scrollPosition / itemWidth);
      const service = (
        filteredServices.length > 0 ? filteredServices : services
      )[index];

      if (service) {
        handleServicePress(service);

        // Center map on service location with animation
        mapRef.current?.animateToRegion(
          {
            latitude: service.location.latitude,
            longitude: service.location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    },
    [filteredServices, services, handleServicePress]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <ServiceListItem
        item={item}
        isSelected={selectedService?.id === item.id}
        distance={selectedService?.id === item.id ? distance : null}
        onPress={() => {
          handleServicePress(item);
          scrollToService(index);
        }}
        routeInfo={routeInfo}
      />
    ),
    [selectedService?.id, distance, handleServicePress]
  );

  // Add this helper function to generate random nearby coordinates
  const generateNearbyLocation = (center, radiusInKm = 1) => {
    const radiusInDeg = radiusInKm / 111; // roughly 1 degree = 111 km
    const randomAngle = Math.random() * 2 * Math.PI;
    const randomRadius = Math.sqrt(Math.random()) * radiusInDeg;

    return {
      latitude: center.latitude + randomRadius * Math.cos(randomAngle),
      longitude: center.longitude + randomRadius * Math.sin(randomAngle),
    };
  };

  // Update showNearbyServices function
  const showNearbyServices = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setUserLocation(userLoc);

        // Create nearby services by modifying their locations
        const nearbyServices = services.map((service) => ({
          ...service,
          location: generateNearbyLocation(userLoc),
        }));

        setFilteredServices(nearbyServices);

        // Fit map to show all services
        const coordinates = [
          userLoc,
          ...nearbyServices.map((s) => ({
            latitude: s.location.latitude,
            longitude: s.location.longitude,
          })),
        ];

        setTimeout(() => {
          mapRef.current?.fitToCoordinates(coordinates, {
            edgePadding: { top: 70, right: 70, bottom: 200, left: 70 },
            animated: true,
          });
        }, 100);

        // Select and scroll to first service
        if (nearbyServices.length > 0) {
          setSelectedService(nearbyServices[0]);
          setTimeout(() => {
            scrollToService(0);
          }, 600);
        }
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  // Debounce user location updates
  const debouncedUserLocation = useDebounce(userLocation, 1000);

  // Memoize markers list
  const markers = useMemo(() => {
    // Always show all services (filteredServices is always all services unless search/filter applied)
    const servicesToShow =
      filteredServices.length > 0 ? filteredServices : services;
    if (!servicesToShow) return null;

    return servicesToShow.map((service) => (
      <ServiceMarker
        key={service.id}
        service={service}
        isSelected={selectedService?.id === service.id}
        onPress={handleMarkerPress}
      />
    ));
  }, [filteredServices, services, selectedService?.id, handleMarkerPress]);

  // Update location watching with debounce
  useEffect(() => {
    let locationSubscription;

    const watchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 3000, // Increase interval to 3 seconds
            distanceInterval: 10,
          },
          (location) => {
            if (mounted.current) {
              setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              });
            }
          }
        );
      }
    };

    watchLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          mapType={mapType}
        >
          {debouncedUserLocation && (
            <Marker coordinate={debouncedUserLocation} title="You are here">
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
                <View style={styles.userMarkerRing} />
              </View>
            </Marker>
          )}

          {markers}

          {debouncedUserLocation && selectedService && (
            <MapViewDirections
              origin={debouncedUserLocation}
              destination={{
                latitude: selectedService.location.latitude,
                longitude: selectedService.location.longitude,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor={COLORS.accent}
              mode="DRIVING"
              onReady={(result) => {
                setRouteInfo({
                  distance: result.distance,
                  duration: result.duration,
                });
                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
                  animated: true,
                });
              }}
            />
          )}
        </MapView>

        {/* Add route info display */}
        {routeInfo && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>
              {routeInfo.distance.toFixed(1)} km •{' '}
              {routeInfo.duration.toFixed(0)} min
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>

        {/* Updated Search bar */}
        <Animated.View entering={FadeIn} style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.text.body} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services nearby..."
              placeholderTextColor="#B0B0B0"
              value={searchText}
              onChangeText={handleSearch}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(true)}
            >
              <MaterialIcons
                name="filter-list"
                size={20}
                color={COLORS.text.body}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Horizontal Service List */}
        <FlatList
          ref={listRef}
          // Always show all services unless filteredServices is set by search/filter
          data={filteredServices.length > 0 ? filteredServices : services}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.servicesList}
          contentContainerStyle={[
            styles.servicesListContent,
            { paddingHorizontal: (Dimensions.get('window').width - 320) / 2 }, // Center padding
          ]}
          snapToInterval={320 + 12}
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={5}
          initialNumToRender={3}
        />

        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={showNearbyServices}
            id='demo-mode'
          >
            <MaterialIcons name="place" size={24} color={COLORS.accent} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleLocatePress}
          >
            <MaterialIcons
              name="my-location"
              size={24}
              color={COLORS.text.heading}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={handleToggleMapType}
          >
            <MaterialIcons
              name={mapType === 'standard' ? 'satellite' : 'map'}
              size={24}
              color={COLORS.text.heading}
            />
          </TouchableOpacity>
        </View>

        {/* Add FilterModal */}
        <FilterModal
          visible={isFilterVisible}
          onClose={() => setIsFilterVisible(false)}
          onApply={handleFilterApply}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  markerWrapper: {
    alignItems: 'center',
  },
  markerContainer: {
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerTail: {},
  calloutContainer: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: RADIUS.card,
    padding: 12,
    ...SHADOWS.card,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  calloutProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  calloutRatingText: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  calloutPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  servicePreview: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  previewImage: {
    width: 100,
    height: 100,
  },
  previewContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  previewProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewRatingText: {
    fontSize: 12,
    color: COLORS.text.body,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  previewPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 8,
    height: 50,
    ...SHADOWS.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  filterButton: {
    padding: 8,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 200,
    gap: 8,
  },
  mapButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  userMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: 'white',
  },
  userMarkerRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: `${COLORS.accent}20`,
  },
  servicesList: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    maxHeight: 200, // Increased from 150 to 200
  },
  servicesListContent: {
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 0,
  },
  selectedCardContainer: {
    transform: [{ scale: 1.02 }],
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
  },
  serviceCard: {
    width: 320,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    marginRight: 12,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 10,
    paddingBottom: 10,
    ...SHADOWS.card,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12, // Increased from 8 to 12
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
    marginRight: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB800',
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  serviceDescription: {
    fontSize: 13,
    color: COLORS.text.body,
    lineHeight: 18,
    marginBottom: 16, // Increased from 12 to 16
    fontFamily: 'Inter-Regular',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4, // Add top padding
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    fontSize: 13,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  dotSeparator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    opacity: 0.5,
  },
  timeText: {
    fontSize: 13,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  viewButton: {
    backgroundColor: `${COLORS.accent}15`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewButtonText: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  routeInfo: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 12,
    ...SHADOWS.card,
  },
  routeText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  demoButton: {
    position: 'absolute',
    left: 20,
    bottom: 200,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    ...SHADOWS.card,
  },
  demoButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
});

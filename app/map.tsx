import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, MapPin, Search } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import * as Location from 'expo-location';
import ServiceCard from '@/components/ServiceCard';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { GestureHandlerRootView, PanGestureHandler, GestureDetector, Gesture } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

// Navigation lock
let isNavigating = false;

// Memoized service card component
const ServiceListItem = memo(({ item, onPress, isSelected, distance }) => {
  const onGestureEvent = useCallback(({ nativeEvent }) => {
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
  }, [item.id]);

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} minDist={20}>
      <Animated.View>
        <View style={styles.pullBarContainer}>
          <View style={styles.pullBar} />
        </View>
        <TouchableOpacity 
          style={[
            styles.serviceCard,
            isSelected && styles.selectedServiceCard
          ]}
          onPress={onPress}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.serviceImage} 
          />
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceTitle} numberOfLines={1}>{item.title}</Text>
            <TouchableOpacity onPress={() => router.push(`/provider/${item.providerId}`)}>
              <Text style={[styles.serviceProvider, { color: COLORS.accent }]}>{item.provider}</Text>
            </TouchableOpacity>
            {distance && isSelected && (
              <Text style={styles.distanceText}>{distance} km away</Text>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
});

const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY'; // Add your API key here

export default function MapScreen() {
  const params = useLocalSearchParams();
  const { services } = useServiceStore();
  const [region, setRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedService, setSelectedService] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapType, setMapType] = useState('standard');
  const [searchText, setSearchText] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const mapRef = useRef(null);
  const listRef = useRef(null);
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
            setSelectedService(service);
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
  }, [params.latitude, params.longitude, params.serviceId, services]);

  const handleMarkerPress = (service) => {
    setSelectedService(service);
  };

  const renderMarker = (service) => (
    <Marker
      key={service.id}
      coordinate={{
        latitude: service.location.latitude,
        longitude: service.location.longitude,
      }}
      onPress={() => handleMarkerPress(service)}
    >
      <View style={styles.markerWrapper}>
        <View style={styles.markerContainer}>
          <MaterialIcons 
            name="location-pin" 
            size={38} 
            color={selectedService?.id === service.id ? COLORS.accent : '#666'} 
          />
        </View>
        <View style={styles.markerTail} />
      </View>
    </Marker>
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
      const filtered = services.filter(service => 
        service.title.toLowerCase().includes(text.toLowerCase()) ||
        service.provider.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
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
    setMapType(prev => prev === 'standard' ? 'hybrid' : 'standard');
  };

  const handleLocatePress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        
        const userLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        // Update user location first
        setUserLocation(userLoc);

        // Update polyline with delay to avoid UI frame guard error
        if (selectedService) {
          const serviceLoc = {
            latitude: selectedService.location.latitude,
            longitude: selectedService.location.longitude,
          };

          setTimeout(() => {
            setPolylineCoordinates([userLoc, serviceLoc]);
          }, 100);

          const dist = calculateDistance(
            userLoc.latitude,
            userLoc.longitude,
            serviceLoc.latitude,
            serviceLoc.longitude
          );
          setDistance(dist.toFixed(1));

          mapRef.current?.fitToCoordinates([userLoc, serviceLoc], {
            edgePadding: { top: 50, right: 50, bottom: 150, left: 50 },
            animated: true,
          });
        } else {
          setPolylineCoordinates([]);
          mapRef.current?.animateToRegion({
            ...userLoc,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }
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

  // Add this function to scroll to selected service
  const scrollToService = (index) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: 20
    });
  };

  // Add this function to handle scroll events
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const itemWidth = 280 + 12; // card width + margin
    const index = Math.round(scrollPosition / itemWidth);
    const service = (filteredServices.length > 0 ? filteredServices : services)[index];
    
    if (service) {
      handleServicePress(service);
      
      // Animate map to show the service location
      const serviceLoc = {
        latitude: service.latitude,
        longitude: service.longitude,
      };
      
      mapRef.current?.animateToRegion({
        ...serviceLoc,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  const keyExtractor = useCallback((item) => item.id, []);

  const renderItem = useCallback(({ item, index }) => (
    <ServiceListItem
      item={item}
      isSelected={selectedService?.id === item.id}
      distance={selectedService?.id === item.id ? distance : null}
      onPress={() => {
        handleServicePress(item);
        scrollToService(index);
      }}
    />
  ), [selectedService?.id, distance, handleServicePress]);

  const getItemLayout = useCallback((data, index) => ({
    length: 280 + 12, // item width + margin
    offset: (280 + 12) * index,
    index,
  }), []);

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
          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="You are here"
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
                <View style={styles.userMarkerRing} />
              </View>
            </Marker>
          )}

          {/* Service markers using actual locations */}
          {(filteredServices.length > 0 ? filteredServices : services).map(renderMarker)}

          {/* Replace Polyline with Directions */}
          {userLocation && selectedService && (
            <MapViewDirections
              origin={userLocation}
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
              {routeInfo.distance.toFixed(1)} km • {routeInfo.duration.toFixed(0)} min
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>

        {/* Search bar */}
        <Animated.View 
          entering={FadeIn}
          style={styles.searchContainer}
        >
          <View style={styles.searchBar}>
            <Search size={20} color={COLORS.text.body} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services nearby..."
              value={searchText}
              onChangeText={handleSearch}
            />
          </View>
        </Animated.View>

        {/* Horizontal Service List */}
        <FlatList
          ref={listRef}
          data={filteredServices.length > 0 ? filteredServices : services}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.servicesList}
          contentContainerStyle={styles.servicesListContent}
          snapToInterval={280 + 12}
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
            onPress={handleLocatePress}
          >
            <MaterialIcons name="my-location" size={24} color={COLORS.text.heading} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.mapButton} onPress={handleToggleMapType}>
            <MaterialIcons 
              name={mapType === 'standard' ? 'satellite' : 'map'} 
              size={24} 
              color={COLORS.text.heading}
            />
          </TouchableOpacity>
        </View>
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
  markerTail: {
  },
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
    paddingHorizontal: 16,
    height: 50,
    ...SHADOWS.card,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
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
    maxHeight: 150,
  },
  servicesListContent: {
    paddingHorizontal: 16,
  },
  serviceCard: {
    width: 280,
    height: 120,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    flexDirection: 'row',
    padding: 12,
    marginRight: 12,
    ...SHADOWS.card,
  },
  selectedServiceCard: {
    borderColor: COLORS.accent,
    borderWidth: 2,
  },
  serviceImage: {
    width: 96,
    height: '100%',
    borderRadius: 8,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  distanceText: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  pullBarContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  pullBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.text.body,
    opacity: 0.3,
    borderRadius: 2,
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
});

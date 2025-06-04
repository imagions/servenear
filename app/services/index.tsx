import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, MapPin } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import ServiceCard from '@/components/ServiceCard';
import * as Location from 'expo-location';
import { useSnackbar } from '@/context/SnackbarContext';

export default function ServicesScreen() {
  const { type = 'nearby' } = useLocalSearchParams();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    services,
    nearbyServices, 
    trendingServices,
    fetchNearbyServices
  } = useServiceStore();

  const title = type === 'trending' ? 'Trending Now' : 'Services Near You';
  const data = type === 'trending' ? trendingServices : nearbyServices;

  const getCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        showSnackbar({
          message: 'Getting your accurate location...',
          icon: 'my-location',
          iconColor: COLORS.accent,
          duration: 2000,
        });

        const location = await Location.getCurrentPositionAsync({});
        await fetchNearbyServices({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        showSnackbar({
          message: 'Location updated successfully',
          icon: 'check-circle',
          iconColor: '#4CAF50',
          duration: 2000,
        });
      } else {
        showSnackbar({
          message: 'Location permission denied',
          icon: 'error',
          iconColor: '#F44336',
          duration: 3000,
        });
      }
    } catch (error) {
      showSnackbar({
        message: 'Error getting location',
        icon: 'error',
        iconColor: '#F44336',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>{title}</Text>
        
        {type === 'nearby' && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={getCurrentLocation}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.accent} />
            ) : (
              <MapPin size={24} color={COLORS.accent} />
            )}
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ServiceCard 
              service={item}
              icon={item.icon || 'location-on'}
              mode="normal"
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
  },
  cardContainer: {
    marginBottom: 16,
  }
});

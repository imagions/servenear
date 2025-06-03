import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Star, MapPin } from 'lucide-react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router } from 'expo-router';
import { Service } from '@/types';

type ServiceCardProps = {
  service: Service;
  icon: string;
};

export default function ServiceCard({ service, icon }: ServiceCardProps) {
  const hasImage = !!service.image;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/service/${service.id}`)}>
      <View style={styles.header}>
        {hasImage ? (
          <Image 
            source={{ uri: service.image }} 
            style={styles.serviceImage}
          />
        ) : (
          <View style={styles.placeholderIcon}>
            <MaterialIcons 
              name={icon as any} 
              size={32} 
              color={COLORS.accent}
            />
          </View>
        )}
        
        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {service.title}
            </Text>
            <View style={styles.ratingBadge}>
              <Star size={14} color="#FFB800" fill="#FFB800" />
              <Text style={styles.ratingText}>{service.rating}</Text>
            </View>
          </View>
          
          <View style={styles.providerRow}>
            <MaterialIcons 
              name="verified" 
              size={13} 
              color={COLORS.accent}
            />
            <Text style={styles.providerName}>
              {service.provider}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>${service.price}/hr</Text>
        </View>

        <View style={styles.footerRight}>
          <View style={styles.distanceBadge}>
            <MapPin size={14} color={COLORS.accent} />
            <Text style={styles.distanceText}>{service.distance} km</Text>
          </View>

          <TouchableOpacity 
            style={styles.viewButton}
            onPress={() => router.push('/map')}>
            <MaterialIcons 
              name="location-on" 
              size={14} 
              color={COLORS.accent}
            />
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
});

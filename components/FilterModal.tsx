import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { X, Star, BadgeCheck } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const DISTANCES = [
  { label: '200m', value: 0.2 },
  { label: '500m', value: 0.5 },
  { label: '1km', value: 1 },
  { label: '4km', value: 4 },
  { label: '7km', value: 7 },
  { label: '10km', value: 10 },
  { label: '15km', value: 15 },
  { label: '20km', value: 20 },
];

const PRICE_RANGES = [
  { label: '$0-$50', min: 0, max: 50 },
  { label: '$51-$100', min: 51, max: 100 },
  { label: '$101-$200', min: 101, max: 200 },
  { label: '$201-$500', min: 201, max: 500 },
  { label: '$500+', min: 500, max: Infinity },
];

const RATINGS = [5, 4, 3, 2, 1];

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    distance: number;
    priceRange: { min: number; max: number };
    rating: number;
    verifiedOnly: boolean;
  }) => void;
}

export default function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number;
    max: number;
  } | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const handleApply = () => {
    onApply({
      distance: selectedDistance || DISTANCES[0].value,
      priceRange: selectedPriceRange || PRICE_RANGES[0],
      rating: selectedRating || 0,
      verifiedOnly,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedDistance(null);
    setSelectedPriceRange(null);
    setSelectedRating(null);
    setVerifiedOnly(false);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Results</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={COLORS.text.heading} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Distance Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.distanceGrid}>
                {DISTANCES.map(distance => (
                  <TouchableOpacity
                    key={distance.value}
                    style={[
                      styles.distanceChip,
                      selectedDistance === distance.value && styles.selectedChip,
                    ]}
                    onPress={() => setSelectedDistance(distance.value)}
                  >
                    <Text
                      style={[
                        styles.distanceChipText,
                        selectedDistance === distance.value &&
                          styles.selectedChipText,
                      ]}
                    >
                      {distance.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRangeList}>
                {PRICE_RANGES.map(range => (
                  <TouchableOpacity
                    key={range.label}
                    style={[
                      styles.priceRangeItem,
                      selectedPriceRange?.min === range.min &&
                        styles.selectedPriceRange,
                    ]}
                    onPress={() => setSelectedPriceRange(range)}
                  >
                    <Text
                      style={[
                        styles.priceRangeText,
                        selectedPriceRange?.min === range.min &&
                          styles.selectedPriceRangeText,
                      ]}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.ratingList}>
                {RATINGS.map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingItem,
                      selectedRating === rating && styles.selectedRating,
                    ]}
                    onPress={() => setSelectedRating(rating)}
                  >
                    <View style={styles.stars}>
                      {[...Array(rating)].map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          color="#FFB800"
                          fill="#FFB800"
                        />
                      ))}
                      <Text style={styles.ratingText}>&amp; up</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Verification Section */}
            <View style={styles.section}>
              <TouchableOpacity
                style={styles.verificationToggle}
                onPress={() => setVerifiedOnly(!verifiedOnly)}
              >
                <View style={styles.verificationContent}>
                  <BadgeCheck
                    size={24}
                    color={verifiedOnly ? COLORS.accent : '#9E9E9E'}
                  />
                  <Text style={styles.verificationText}>
                    Show verified providers only
                  </Text>
                </View>
                <View
                  style={[
                    styles.toggleTrack,
                    verifiedOnly && styles.toggleTrackActive,
                  ]}
                >
                  <View
                    style={[
                      styles.toggleThumb,
                      verifiedOnly && styles.toggleThumbActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  distanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  distanceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: `${COLORS.accent}10`,
    borderColor: COLORS.accent,
  },
  distanceChipText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  selectedChipText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  priceRangeList: {
    gap: 8,
  },
  priceRangeItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedPriceRange: {
    backgroundColor: `${COLORS.accent}10`,
    borderColor: COLORS.accent,
  },
  priceRangeText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  selectedPriceRangeText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  ratingList: {
    gap: 8,
  },
  ratingItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedRating: {
    backgroundColor: `${COLORS.accent}10`,
    borderColor: COLORS.accent,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.text.body,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
  },
  verificationToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  toggleTrack: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: COLORS.accent,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    ...SHADOWS.card,
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  resetButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.body,
    fontFamily: 'Inter-SemiBold',
  },
  applyButton: {
    flex: 2,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.accent,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});
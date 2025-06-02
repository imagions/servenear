import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, SHADOWS } from '@/constants/theme';
import { X, Star, BadgeCheck } from 'lucide-react-native';

const DISTANCES = [
  { label: 'All', value: null },
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
  { label: 'All', min: null, max: null },
  { label: '$0-$50', min: 0, max: 50 },
  { label: '$51-$100', min: 51, max: 100 },
  { label: '$101-$200', min: 101, max: 200 },
  { label: '$201-$500', min: 201, max: 500 },
  { label: '$500+', min: 500, max: Infinity },
];

const RATINGS = [
  { value: null, label: 'All Ratings' },
  { value: 5, label: '5 stars' },
  { value: 4, label: '4+ stars' },
  { value: 3, label: '3+ stars' },
  { value: 2, label: '2+ stars' },
  { value: 1, label: '1+ stars' },
]; // 0 represents "All"

const AUTHENTICITY_OPTIONS = [
  { value: 'all', label: 'All Providers' },
  { value: 'verified', label: 'Verified Only' },
  { value: 'unverified', label: 'Unverified' },
];

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
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['85%'], []);

  const [selectedDistance, setSelectedDistance] = useState<number | null>(1); // 1km default
  const [selectedPriceRange, setSelectedPriceRange] = useState<{
    min: number | null;
    max: number | null;
  } | null>({ min: null, max: null }); // All prices
  const [selectedRating, setSelectedRating] = useState<number | null>(0); // All ratings
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [authenticityFilter, setAuthenticityFilter] = useState('all');

  const renderBackdrop = useCallback(() => (
    <Pressable 
      style={styles.backdrop}
      onPress={onClose}
    />
  ), [onClose]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) onClose();
  }, [onClose]);

  const handleOptionSelect = (type: string, value: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (type) {
      case 'distance':
        setSelectedDistance(value);
        break;
      case 'price':
        setSelectedPriceRange(value);
        break;
      case 'rating':
        setSelectedRating(value);
        break;
      case 'verified':
        setVerifiedOnly(value);
        break;
      case 'authenticity':
        setAuthenticityFilter(value);
        break;
    }
  };

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
    setSelectedDistance(1);
    setSelectedPriceRange({ min: null, max: null });
    setSelectedRating(0);
    setVerifiedOnly(false);
    setAuthenticityFilter('all');
  };

  const renderStars = (count: number | null) => {
    if (count === null) return null;
    
    return [...Array(count)].map((_, index) => (
      <Star
        key={index}
        size={16}
        color={selectedRating === count ? COLORS.accent : "#FFB800"}
        fill={selectedRating === count ? COLORS.accent : "#FFB800"}
      />
    ));
  };

  return (
    <>
      <StatusBar style="light" />
      {visible && (
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Filter Results</Text>
              <Pressable 
                style={styles.closeButton} 
                onPress={onClose}
                hitSlop={20}
              >
                <X size={24} color={COLORS.text.heading} />
              </Pressable>
            </View>

            {/* Distance Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distance</Text>
              <View style={styles.distanceGrid}>
                {DISTANCES.map((distance) => (
                  <Pressable
                    key={distance.value}
                    style={({ pressed }) => [
                      styles.distanceChip,
                      selectedDistance === distance.value && styles.selectedChip,
                      pressed && styles.pressedChip
                    ]}
                    onPress={() => handleOptionSelect('distance', distance.value)}
                  >
                    <Animated.Text
                      entering={FadeIn}
                      exiting={FadeOut}
                      style={[
                        styles.distanceChipText,
                        selectedDistance === distance.value && styles.selectedChipText
                      ]}
                    >
                      {distance.label}
                    </Animated.Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Price Range Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.priceRangeList}>
                {PRICE_RANGES.map((range) => (
                  <Pressable
                    key={range.label}
                    style={({ pressed }) => [
                      styles.priceRangeItem,
                      selectedPriceRange?.min === range.min && styles.selectedPriceRange,
                      pressed && styles.pressedChip
                    ]}
                    onPress={() => handleOptionSelect('price', range)}
                  >
                    <Text style={[
                      styles.priceRangeText,
                      selectedPriceRange?.min === range.min && styles.selectedPriceRangeText
                    ]}>
                      {range.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Rating Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Rating</Text>
              <View style={styles.ratingList}>
                {RATINGS.map((rating) => (
                  <Pressable
                    key={rating.value ?? 'all'}
                    style={({ pressed }) => [
                      styles.ratingItem,
                      selectedRating === rating.value && styles.selectedRating,
                      pressed && styles.pressedChip
                    ]}
                    onPress={() => handleOptionSelect('rating', rating.value)}
                  >
                    <View style={styles.stars}>
                      {rating.value ? renderStars(rating.value) : null}
                      <Text style={[
                        styles.ratingText,
                        selectedRating === rating.value && styles.selectedRatingText
                      ]}>
                        {rating.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Authenticity Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Provider Status</Text>
              <View style={styles.authenticityList}>
                {AUTHENTICITY_OPTIONS.map((option) => (
                  <Pressable
                    key={option.value}
                    style={({ pressed }) => [
                      styles.authenticityItem,
                      authenticityFilter === option.value && styles.selectedAuthenticity,
                      pressed && styles.pressedChip
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setAuthenticityFilter(option.value);
                    }}
                  >
                    <View style={styles.authenticityContent}>
                      {option.value === 'verified' && (
                        <BadgeCheck size={20} color={authenticityFilter === option.value ? COLORS.accent : '#9E9E9E'} />
                      )}
                      <Text style={[
                        styles.authenticityText,
                        authenticityFilter === option.value && styles.selectedAuthenticityText
                      ]}>
                        {option.label}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Verification Toggle */}
            <Pressable
              style={styles.verificationToggle}
              onPress={() => handleOptionSelect('verified', !verifiedOnly)}
            >
              <View style={styles.verificationContent}>
                <BadgeCheck
                  size={24}
                  color={verifiedOnly ? COLORS.accent : '#9E9E9E'}
                />
                <Text style={[
                  styles.verificationText,
                  verifiedOnly && styles.selectedVerificationText
                ]}>
                  Show verified providers only
                </Text>
              </View>
              <View style={[
                styles.toggleTrack,
                verifiedOnly && styles.toggleTrackActive
              ]}>
                <Animated.View
                  style={[
                    styles.toggleThumb,
                    verifiedOnly && styles.toggleThumbActive
                  ]}
                />
              </View>
            </Pressable>

            {/* Footer Actions */}
            <View style={styles.footer}>
              <Pressable
                style={[styles.button, styles.resetButton]}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.applyButton]}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetBackground: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#E0E0E0',
    width: 40,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    paddingVertical: 16,
    paddingBottom: 24,
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
  authenticityList: {
    gap: 8,
  },
  authenticityItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedAuthenticity: {
    backgroundColor: `${COLORS.accent}10`,
    borderColor: COLORS.accent,
  },
  authenticityContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authenticityText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  selectedAuthenticityText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
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
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  resetButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: COLORS.accent,
    flex: 2,
  },
  pressedChip: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
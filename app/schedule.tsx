import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Check,
  BadgeCheck,
} from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { useCartStore } from '@/store/useCartStore';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
];

export default function ScheduleScreen() {
  const { serviceId } = useLocalSearchParams();
  const { getServiceById } = useServiceStore();
  const { addToCart, items: cart } = useCartStore();
  const service = getServiceById(serviceId as string);

  // Find existing cart item for this service
  const existingCartItem = cart.find((item) => item.id === serviceId);

  // Initialize state from cart if editing, else default
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (existingCartItem?.date) {
      // Try to parse as "MMM DD, YYYY" (e.g. "Jun 10, 2024")
      const parsed = Date.parse(existingCartItem.date);
      if (!isNaN(parsed)) return new Date(parsed);

      // Fallback: try to parse manually if Date.parse fails
      const parts = existingCartItem.date.match(/^([A-Za-z]+) (\d{1,2}), (\d{4})$/);
      if (parts) {
        const [_, monthStr, dayStr, yearStr] = parts;
        const months = [
          'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        const monthIdx = months.findIndex(m => m === monthStr);
        if (monthIdx !== -1) {
          return new Date(Number(yearStr), monthIdx, Number(dayStr));
        }
      }
    }
    return null;
  });
  const [selectedTime, setSelectedTime] = useState<string | null>(
    existingCartItem?.time || null
  );
  const [isOncePrice, setIsOncePrice] = useState(
    existingCartItem?.priceType
      ? existingCartItem.priceType === 'once'
      : true
  );
  const [note, setNote] = useState(existingCartItem?.note || '');

  useEffect(() => {
    // If cart item changes (e.g. after addToCart), update state
    if (existingCartItem) {
      if (existingCartItem.date) {
        const parsed = Date.parse(existingCartItem.date);
        if (!isNaN(parsed)) setSelectedDate(new Date(parsed));
      }
      if (existingCartItem.time) setSelectedTime(existingCartItem.time);
      if (existingCartItem.priceType)
        setIsOncePrice(existingCartItem.priceType === 'once');
      if (existingCartItem.note !== undefined)
        setNote(existingCartItem.note);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingCartItem?.date, existingCartItem?.time, existingCartItem?.priceType, existingCartItem?.note]);

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

  // Generate dates for the next 14 days
  const dates: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // If already in cart, update on schedule change instead of adding duplicate
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateString = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      // Always update the cart item for this serviceId
      addToCart({
        id: service.id,
        title: service.title,
        price: isOncePrice
          ? service.once_price || service.fixedPrice || 0
          : service.hourly_price || service.price || 0,
        image: service.image || '',
        provider: service.provider_details?.name || service.provider || '',
        quantity: 1,
        date: dateString,
        time: selectedTime,
        priceType: isOncePrice ? 'once' : 'hourly',
        note,
        oncePrice: service.once_price || service.fixedPrice || 0,
        hourlyPrice: service.hourly_price || service.price || 0
      });

      router.push('/cart');
    }
  };

  // Only weekdays (Mon-Fri) are selectable, Sun/Sat are not
  const isDateAvailable = (date: Date) => {
    const day = daysOfWeek[date.getDay()];
    return day !== 'Sun' && day !== 'Sat';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity activeOpacity={0.7}
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {service.provider_details?.name?.[0] || 'U'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <Text style={styles.providerName}>
                  {service.provider_details?.name || service.provider}
                </Text>
                <BadgeCheck
                  size={18}
                  color={COLORS.surface}
                  fill={COLORS.accent}
                />
              </View>
              <Text style={styles.serviceTitleSub}>{service.title}</Text>
            </View>
          </View>

          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Pricing Type</Text>
            <Switch
              value={isOncePrice}
              onValueChange={setIsOncePrice}
              thumbColor={isOncePrice ? COLORS.accent : '#f4f3f4'}
              trackColor={{ false: '#E0E0E0', true: 'rgba(0, 207, 232, 0.4)' }}
            />
          </View>

          <View style={styles.priceBox}>
            <Text style={styles.priceBoxLabel}>
              {isOncePrice ? 'One-time Price' : 'Hourly Price'}
            </Text>
            <Text style={styles.priceBoxValue}>
              ₹
              {isOncePrice
                ? service.once_price || service.fixedPrice || 0
                : service.hourly_price || service.price || 0}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>Select Date</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.datesContainer}
        >
          {dates.map((date, index) => {
            const isAvailable = isDateAvailable(date);
            const isSelected =
              selectedDate &&
              selectedDate.getDate() === date.getDate() &&
              selectedDate.getMonth() === date.getMonth();
            return (
              <TouchableOpacity activeOpacity={0.7}
                key={index}
                style={[
                  styles.dateItem,
                  isSelected && styles.selectedDate,
                  !isAvailable && styles.unavailableDate,
                ]}
                onPress={() => isAvailable && handleDateSelect(date)}
                disabled={!isAvailable}
              >
                <Text
                  style={[
                    styles.dayName,
                    isSelected && styles.selectedText,
                    !isAvailable && styles.unavailableText,
                  ]}
                >
                  {daysOfWeek[date.getDay()]}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    isSelected && styles.selectedText,
                    !isAvailable && styles.unavailableText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.sectionLabel}>Select Time</Text>
        <View style={styles.timeGrid}>
          {timeSlots.map((time, index) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity activeOpacity={0.7}
                key={index}
                style={[styles.timeItem, isSelected && styles.selectedTime]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    isSelected && styles.selectedTimeText,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Additional Notes Field */}
        <Text style={styles.sectionLabel}>Additional Notes</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any notes for the provider (e.g. I am allergic to aloe vera...)"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholderTextColor="#B0B0B0"
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={0.7}
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedTime) && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.confirmButtonText}>Confirm & Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#F8FAFC',
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
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 18,
    padding: 18,
    ...SHADOWS.card,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.accent + '22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  serviceTitleSub: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
    marginTop: 2,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pricingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  priceBox: {
    backgroundColor: '#F5F8FC',
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  priceBoxLabel: {
    fontSize: 15,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  priceBoxValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginLeft: 20,
    marginBottom: 10,
    fontFamily: 'Inter-SemiBold',
  },
  datesContainer: {
    paddingLeft: 16,
    paddingBottom: 10,
    gap: 8,
  },
  dateItem: {
    width: 60,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F5F8FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unavailableDate: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  selectedDate: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  unavailableText: {
    color: '#9E9E9E',
  },
  selectedText: {
    color: 'white',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 30,
  },
  timeItem: {
    width: '29%',
    minWidth: 90,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F5F8FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedTime: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  timeText: {
    fontSize: 15,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  selectedTimeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...SHADOWS.card,
  },
  confirmButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(0, 207, 232, 0.5)',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
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
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    backgroundColor: '#F5F8FC',
    padding: 14,
    fontSize: 15,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
    marginHorizontal: 16,
    marginBottom: 30,
    minHeight: 60,
    maxHeight: 120,
  },
});

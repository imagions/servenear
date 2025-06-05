import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Calendar, Clock, ChevronRight, Check } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', 
  '5:00 PM', '6:00 PM'
];

export default function ScheduleScreen() {
  const { serviceId } = useLocalSearchParams();
  const { getServiceById, addToCart } = useServiceStore();
  const service = getServiceById(serviceId as string);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found</Text>
        <TouchableOpacity style={styles.backButtonLarge} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Generate dates for the next 14 days
  const dates = [];
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
  
  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      // Format date for display
      const dateString = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      
      // Add to cart
      addToCart({
        serviceId: service.id,
        date: dateString,
        time: selectedTime,
        price: service.price
      });
      
      // Navigate to cart
      router.push('/cart');
    }
  };
  
  const isDateAvailable = (date: Date) => {
    // Check if the day is available based on service availability
    const day = daysOfWeek[date.getDay()];
    return service.availability.days.includes(day);
  };
  
  const isTimeAvailable = (time: string) => {
    // Mock time availability check
    const unavailableTimes = ['10:00 AM', '2:00 PM', '5:00 PM'];
    return !unavailableTimes.includes(time);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Appointment</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.serviceInfo}>
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceProvider}>{service.provider}</Text>
            <Text style={styles.servicePrice}>${service.price}/hr</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Select Date</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.datesContainer}>
            {dates.map((date, index) => {
              const isAvailable = isDateAvailable(date);
              const isSelected = selectedDate && 
                selectedDate.getDate() === date.getDate() && 
                selectedDate.getMonth() === date.getMonth();
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.dateItem,
                    !isAvailable && styles.unavailableDate,
                    isSelected && styles.selectedDate
                  ]}
                  onPress={() => isAvailable && handleDateSelect(date)}
                  disabled={!isAvailable}>
                  <Text 
                    style={[
                      styles.dayName,
                      !isAvailable && styles.unavailableText,
                      isSelected && styles.selectedText
                    ]}>
                    {daysOfWeek[date.getDay()]}
                  </Text>
                  <Text 
                    style={[
                      styles.dayNumber,
                      !isAvailable && styles.unavailableText,
                      isSelected && styles.selectedText
                    ]}>
                    {date.getDate()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={COLORS.accent} />
            <Text style={styles.sectionTitle}>Select Time</Text>
          </View>
          
          <View style={styles.timeGrid}>
            {timeSlots.map((time, index) => {
              const isAvailable = isTimeAvailable(time);
              const isSelected = selectedTime === time;
              
              return (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.timeItem,
                    !isAvailable && styles.unavailableTime,
                    isSelected && styles.selectedTime
                  ]}
                  onPress={() => isAvailable && handleTimeSelect(time)}
                  disabled={!isAvailable}>
                  <Text 
                    style={[
                      styles.timeText,
                      !isAvailable && styles.unavailableText,
                      isSelected && styles.selectedText
                    ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Appointment Summary</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Service</Text>
            <Text style={styles.summaryValue}>{service.title}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Provider</Text>
            <Text style={styles.summaryValue}>{service.provider}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date</Text>
            <Text style={styles.summaryValue}>
              {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              }) : 'Not selected'}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>{selectedTime || 'Not selected'}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Price</Text>
            <Text style={styles.summaryValue}>${service.price}/hr</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            (!selectedDate || !selectedTime) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedDate || !selectedTime}>
          <Text style={styles.confirmButtonText}>Confirm & Continue</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  serviceInfo: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    margin: 20,
    ...SHADOWS.card,
  },
  serviceImage: {
    width: 100,
    height: '100%',
  },
  serviceDetails: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  serviceProvider: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginLeft: 12,
    fontFamily: 'Inter-Bold',
  },
  datesContainer: {
    padding: 8,
  },
  dateItem: {
    width: 64,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...SHADOWS.card,
  },
  unavailableDate: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  selectedDate: {
    backgroundColor: COLORS.accent,
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
    justifyContent: 'space-between',
    padding: 8,
  },
  timeItem: {
    width: '31%',
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...SHADOWS.card,
  },
  unavailableTime: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  selectedTime: {
    backgroundColor: COLORS.accent,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  summarySection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 20,
    margin: 20,
    marginBottom: 100,
    ...SHADOWS.card,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
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
});
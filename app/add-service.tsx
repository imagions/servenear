import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Camera, MapPin, X } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddServiceScreen() {
  const { categories, addService } = useServiceStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'San Francisco, CA',
  });

  const [availableDays, setAvailableDays] = useState({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });

  const [hours, setHours] = useState('9:00 AM - 5:00 PM');
  const [imageUri, setImageUri] = useState(
    'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg'
  );

  // For time picker
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<'start' | 'end'>(
    'start'
  );
  const [startTime, setStartTime] = useState(new Date(2023, 0, 1, 9, 0));
  const [endTime, setEndTime] = useState(new Date(2023, 0, 1, 17, 0));

  const handleAvailabilityToggle = (day: string) => {
    setAvailableDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  // Image picker handler
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Permission to access gallery is required!'
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Time formatting helper
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Handle time picker change
  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      if (timePickerMode === 'start') {
        setStartTime(selectedDate);
        // If endTime is before startTime, adjust endTime
        if (selectedDate >= endTime) {
          const newEnd = new Date(selectedDate);
          newEnd.setHours(newEnd.getHours() + 1);
          setEndTime(newEnd);
        }
      } else {
        setEndTime(selectedDate);
      }
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a service title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a service description');
      return;
    }

    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Format available days
    const days = Object.entries(availableDays)
      .filter(([_, isAvailable]) => isAvailable)
      .map(([day]) => day)
      .join(', ');

    // Format available hours
    const formattedHours = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    // Add service
    addService({
      title,
      description,
      price: parseFloat(price),
      category,
      location,
      availability: {
        days,
        hours: formattedHours,
      },
      image: imageUri,
    });

    Alert.alert('Success', 'Your service has been created successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.text.heading} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Service</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          {imageUri ? (
            <>
              <Image source={{ uri: imageUri }} style={styles.serviceImage} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => setImageUri('')}
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handlePickImage}
            >
              <Camera size={32} color="#9E9E9E" />
              <Text style={styles.addImageText}>Add Service Image</Text>
            </TouchableOpacity>
          )}
          {/* Add overlay button for changing image */}
          {imageUri ? (
            <TouchableOpacity
              style={[
                styles.addImageButton,
                {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.2)',
                },
              ]}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  fontFamily: 'Inter-Medium',
                }}
              >
                Change Image
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Service Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Service Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Professional Plumbing Service"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your service in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price (per hour)</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <TouchableOpacity style={styles.categorySelector}>
              <Text
                style={category ? styles.categoryText : styles.placeholderText}
              >
                {category || 'Select a category'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#9E9E9E" />
            </TouchableOpacity>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    category === cat.name && styles.selectedCategoryChip,
                  ]}
                  onPress={() => setCategory(cat.name)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat.name && styles.selectedCategoryChipText,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Location</Text>

          <TouchableOpacity style={styles.locationContainer}>
            <View style={styles.locationInfo}>
              <MapPin size={20} color={COLORS.accent} />
              <Text style={styles.locationText}>{location.address}</Text>
            </View>
            <Text style={styles.changeLocationText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Availability</Text>

          <View style={styles.availabilityDays}>
            <Text style={styles.inputLabel}>Available Days</Text>

            {Object.entries(availableDays).map(([day, isAvailable]) => (
              <View key={day} style={styles.dayToggle}>
                <Text style={styles.dayText}>{day}</Text>
                <Switch
                  value={isAvailable}
                  onValueChange={() => handleAvailabilityToggle(day)}
                  trackColor={{
                    false: '#E0E0E0',
                    true: 'rgba(0, 207, 232, 0.4)',
                  }}
                  thumbColor={isAvailable ? COLORS.accent : '#F5F5F5'}
                />
              </View>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Available Hours</Text>
            <TouchableOpacity
              style={[
                styles.input,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}
              onPress={() => {
                setTimePickerMode('start');
                setShowTimePicker(true);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: COLORS.text.body,
                  fontFamily: 'Inter-Regular',
                  fontSize: 16,
                }}
              >
                {`${formatTime(startTime)} - ${formatTime(endTime)}`}
              </Text>
              <MaterialIcons name="access-time" size={20} color="#9E9E9E" />
            </TouchableOpacity>
            {/* Show time pickers */}
            {showTimePicker && (
              <DateTimePicker
                value={timePickerMode === 'start' ? startTime : endTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={(event, date) => {
                  if (event.type === 'set' && date) {
                    if (timePickerMode === 'start') {
                      setStartTime(date);
                      setTimePickerMode('end');
                      setShowTimePicker(true);
                    } else {
                      setEndTime(date);
                      setShowTimePicker(false);
                    }
                  } else {
                    setShowTimePicker(false);
                  }
                }}
              />
            )}
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Create Service</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingTop: 40,
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
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    height: 200,
    margin: 20,
    borderRadius: RADIUS.card,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    ...SHADOWS.card,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9E9E9E',
    marginTop: 12,
    fontFamily: 'Inter-Medium',
  },
  formSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text.body,
    backgroundColor: '#F5F5F5',
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.body,
    marginRight: 8,
    fontFamily: 'Inter-Medium',
  },
  priceInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9E9E9E',
    fontFamily: 'Inter-Regular',
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  selectedCategoryChip: {
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  categoryChipText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  selectedCategoryChipText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: COLORS.text.body,
    marginLeft: 12,
    fontFamily: 'Inter-Regular',
  },
  changeLocationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
    fontFamily: 'Inter-SemiBold',
  },
  availabilityDays: {
    marginBottom: 16,
  },
  dayToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  submitButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
    ...SHADOWS.card,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
});

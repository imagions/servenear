import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { ArrowLeft, Camera, MapPin, X } from 'lucide-react-native';
import { useServiceStore } from '@/store/useServiceStore';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddServiceScreen() {
  const {
    categories,
    subcategories,
    fetchCategories,
    fetchServices,
    addService,
  } = useServiceStore();

  // Fetch categories and subcategories from Supabase on mount
  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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

  const [subcategory, setSubcategory] = useState({ id: '', name: '' });
  const [tags, setTags] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState('');
  const [oneTimePrice, setOneTimePrice] = useState('');
  const [duration, setDuration] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [terms, setTerms] = useState('');
  const [certificateUri, setCertificateUri] = useState('');

  // Dropdown modal state
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false);

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

  // Certificate picker handler
  const handlePickCertificate = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Permission to access files is required!'
      );
      return;
    }
    const result = (await ImagePicker.launchDocumentPickerAsync)
      ? await ImagePicker.launchDocumentPickerAsync({ type: '*/*' })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: false,
        });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setCertificateUri(result.assets[0].uri);
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

  // Handle tag input and chip creation
  const handleTagInput = (text: string) => {
    // If user types comma, add tag
    if (text.includes(',')) {
      const parts = text.split(',');
      const newTags = parts
        .slice(0, -1)
        .map((t) => t.trim())
        .filter((t) => t && !tagList.includes(t));
      if (newTags.length > 0) {
        setTagList([...tagList, ...newTags]);
      }
      setTags(parts[parts.length - 1]);
    } else {
      setTags(text);
    }
  };

  const handleTagSubmit = () => {
    const trimmed = tags.trim();
    if (trimmed && !tagList.includes(trimmed)) {
      setTagList([...tagList, trimmed]);
    }
    setTags('');
  };

  const removeTag = (tag: string) => {
    setTagList(tagList.filter((t) => t !== tag));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Hey!', 'Please enter a service title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Hey!', 'Please enter a service description');
      return;
    }

    if (!category) {
      Alert.alert('Hey!', 'Please select a category');
      return;
    }
    if (!subcategory) {
      Alert.alert('Hey!', 'Please select a subcategory');
      return;
    }
    if (!hourlyRate.trim() || isNaN(parseFloat(hourlyRate))) {
      Alert.alert('Hey!', 'Please enter a valid hourly rate');
      return;
    }
    if (!oneTimePrice.trim() || isNaN(parseFloat(oneTimePrice))) {
      Alert.alert('Hey!', 'Please enter a valid one-time price');
      return;
    }
    if (!duration.trim() || isNaN(parseFloat(duration))) {
      Alert.alert('Hey!', 'Please enter a valid duration');
      return;
    }
    if (!serviceArea.trim() || isNaN(parseFloat(serviceArea))) {
      Alert.alert('Hey!', 'Please enter a valid service area radius');
      return;
    }
    if (!terms.trim()) {
      Alert.alert('Hey!', 'Please enter terms and conditions');
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
    // Add tags from input if not empty
    let finalTags = tagList;
    if (tags.trim() && !tagList.includes(tags.trim())) {
      finalTags = [...tagList, tags.trim()];
    }
    addService({
      title,
      description,
      category,
      subcategory: subcategory?.id,
      tags: finalTags,
      hourly_price: parseFloat(hourlyRate),
      once_price: parseFloat(oneTimePrice),
      duration: parseFloat(duration),
      service_area: parseFloat(serviceArea),
      availability: {
        days,
        hours: formattedHours,
      },
      image: imageUri,
      certificate: certificateUri,
      terms_and_conditions: terms,
      location,
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

          {/* Title */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Service Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Plumbing Service"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Description */}
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

          {/* Category Dropdown */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Category</Text>
            <Pressable
              style={styles.categorySelector}
              onPress={() => setCategoryModalVisible(true)}
            >
              <Text
                style={category ? styles.categoryText : styles.placeholderText}
              >
                {category || 'Select a category'}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#9E9E9E" />
            </Pressable>
            <Modal
              visible={categoryModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setCategoryModalVisible(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setCategoryModalVisible(false)}
              >
                <View style={styles.dropdownModal}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.id}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setCategory(cat.name);
                          setSubcategory({ id: '', name: '' }); // Reset subcategory when category changes
                          setCategoryModalVisible(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            category === cat.name && {
                              color: COLORS.accent,
                              fontWeight: 'bold',
                            },
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </Pressable>
            </Modal>
          </View>

          {/* Subcategory Dropdown (only show if category selected) */}
          {category ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Subcategory</Text>
              <Pressable
                style={styles.categorySelector}
                onPress={() => setSubcategoryModalVisible(true)}
              >
                <Text
                  style={
                    subcategory ? styles.categoryText : styles.placeholderText
                  }
                >
                  {subcategory.name || 'Select a subcategory'}
                </Text>
                <MaterialIcons
                  name="arrow-drop-down"
                  size={24}
                  color="#9E9E9E"
                />
              </Pressable>
              <Modal
                visible={subcategoryModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setSubcategoryModalVisible(false)}
              >
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setSubcategoryModalVisible(false)}
                >
                  <View style={styles.dropdownModal}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      {subcategories
                        .filter((sub) => {
                          const cat = categories.find(
                            (c) => c.name === category
                          );
                          return cat && sub.category_id === cat.id;
                        })
                        .map((sub) => (
                          <TouchableOpacity
                            key={sub.id}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSubcategory({ id: sub.id, name: sub.name });
                              setSubcategoryModalVisible(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                subcategory.name === sub.name && {
                                  color: COLORS.accent,
                                  fontWeight: 'bold',
                                },
                              ]}
                            >
                              {sub.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                    </ScrollView>
                  </View>
                </Pressable>
              </Modal>
            </View>
          ) : null}

          {/* Tags */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Tags (comma separated)</Text>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{
                flexDirection: 'row',
                gap: 2,
                marginBottom: 10,
              }}
            >
              {tagList.map((tag) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <MaterialIcons
                      name="close"
                      size={16}
                      color={COLORS.accent}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TextInput
              style={styles.input}
              placeholder="e.g. plumbing, repair, emergency"
              value={tags}
              onChangeText={handleTagInput}
              onSubmitEditing={handleTagSubmit}
              blurOnSubmit={false}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          {/* Hourly Rate */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Hourly Rate</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                value={hourlyRate}
                onChangeText={setHourlyRate}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* One-time Price */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>One-time Price</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0.00"
                value={oneTimePrice}
                onChangeText={setOneTimePrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Duration (hours)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>

          {/* Service Area Radius */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Service Area Radius (km)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              value={serviceArea}
              onChangeText={setServiceArea}
              keyboardType="numeric"
            />
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

        {/* Certificate Document */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Certificate of Expertise</Text>
          <TouchableOpacity
            style={[
              styles.addCertificateButton,
              {
                backgroundColor: certificateUri
                  ? 'rgba(0,207,232,0.08)'
                  : '#F5F5F5',
                borderWidth: certificateUri ? 1 : 0,
                borderColor: COLORS.accent,
                marginBottom: 10,
              },
            ]}
            onPress={handlePickCertificate}
          >
            <MaterialIcons name="attach-file" size={24} color={COLORS.accent} />
            <Text style={{ color: COLORS.accent, marginLeft: 8 }}>
              {certificateUri ? 'Change Certificate' : 'Upload Certificate'}
            </Text>
          </TouchableOpacity>
          {certificateUri ? (
            <Text style={{ color: COLORS.text.body, fontSize: 13 }}>
              {certificateUri.split('/').pop()}
            </Text>
          ) : null}
        </View>

        {/* Terms and Conditions */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Terms and Conditions</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter terms and conditions for your service..."
            value={terms}
            onChangeText={setTerms}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Publish Service</Text>
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
  addCertificateButton: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownModal: {
    width: 300,
    maxHeight: 350,
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 18,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,207,232,0.08)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  tagChipText: {
    color: COLORS.accent,
    fontSize: 14,
    marginRight: 4,
    fontFamily: 'Inter-Medium',
  },
});

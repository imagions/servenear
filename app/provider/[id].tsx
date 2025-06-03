import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import {
  Star,
  MapPin,
  MessageCircle,
  Award,
  Clock,
  Calendar,
  ChevronRight,
  Languages,
  BadgeCheck,
  ThumbsUp,
  ThumbsDown,
  Leaf,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for the provider
const PROVIDER_DATA = {
  id: '1',
  name: 'John Smith',
  image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
  verified: true,
  rating: 4.8,
  completedJobs: 156,
  experience: 5,
  location: 'San Francisco, CA',
  about: 'Professional plumber with over 5 years of experience specializing in residential and commercial plumbing services. Licensed and insured.',
  skills: [
    { name: 'Pipe Repair', level: 95 },
    { name: 'Drain Cleaning', level: 90 },
    { name: 'Water Heater Installation', level: 85 },
    { name: 'Fixture Installation', level: 92 },
  ],
  certifications: [
    { name: 'Master Plumber License', issuer: 'California State Board', year: 2020 },
    { name: 'Green Plumbing Certification', issuer: 'IAPMO', year: 2021 },
  ],
  languages: ['English', 'Spanish'],
  businessHours: {
    weekdays: '8:00 AM - 6:00 PM',
    weekends: '9:00 AM - 4:00 PM',
  },
  serviceArea: '25 mile radius from San Francisco',
  services: [
    {
      category: 'Plumbing',
      items: [
        {
          name: 'Pipe Repair',
          price: '80-120',
          duration: '1-2 hours',
          sustainabilityScore: 4.5,
        },
        {
          name: 'Drain Cleaning',
          price: '100-150',
          duration: '1-3 hours',
          sustainabilityScore: 4.8,
        },
      ],
    },
    {
      category: 'Installation',
      items: [
        {
          name: 'Water Heater Installation',
          price: '300-500',
          duration: '3-4 hours',
          sustainabilityScore: 4.2,
        },
        {
          name: 'Fixture Installation',
          price: '150-200',
          duration: '1-2 hours',
          sustainabilityScore: 4.6,
        },
      ],
    },
  ],
  ratings: {
    overall: 4.8,
    categories: {
      serviceQuality: 4.9,
      punctuality: 4.7,
      professionalism: 4.8,
      valueForMoney: 4.6,
      safetyAndTrust: 4.9,
    },
    total: 156,
  },
  reviews: [
    {
      id: '1',
      user: {
        name: 'Emma Johnson',
        image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
        verified: true,
      },
      rating: 5,
      date: 'May 15, 2024',
      service: 'Pipe Repair',
      comment: 'John was extremely professional and fixed our kitchen sink perfectly. He was on time and very respectful. Would definitely hire again!',
      photos: [
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
        'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg',
      ],
      helpful: 12,
      notHelpful: 1,
    },
    // Add more reviews...
  ],
};

export default function ProviderProfileScreen() {
  const [selectedTab, setSelectedTab] = useState('about');
  const { id } = useLocalSearchParams();
  const provider = PROVIDER_DATA; // In real app, fetch based on id

  const renderSkillBar = ({ item }) => (
    <View style={styles.skillItem}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillName}>{item.name}</Text>
        <Text style={styles.skillLevel}>{item.level}%</Text>
      </View>
      <View style={styles.skillBar}>
        <View style={[styles.skillFill, { width: `${item.level}%` }]} />
      </View>
    </View>
  );

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.price}</Text>
      </View>
      
      <View style={styles.serviceDetails}>
        <View style={styles.serviceDetail}>
          <Clock size={16} color={COLORS.text.body} />
          <Text style={styles.serviceDetailText}>{item.duration}</Text>
        </View>
        
        <View style={styles.serviceDetail}>
          <Leaf size={16} color="#4CAF50" />
          <Text style={styles.sustainabilityScore}>
            Sustainability Score: {item.sustainabilityScore}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderReview = ({ item }) => (
    <Pressable 
      style={styles.reviewCard}
      onPress={() => router.push(`/user/${item.user.id}`)}
    >
      <View style={styles.reviewHeader}>
        <Image source={{ uri: item.user.image }} style={styles.reviewerImage} />
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerNameContainer}>
            <Text style={styles.reviewerName}>{item.user.name}</Text>
            {item.user.verified && (
              <BadgeCheck size={16} color={COLORS.accent} />
            )}
          </View>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Star size={16} color="#FFB800" fill="#FFB800" />
          <Text style={styles.reviewRatingText}>{item.rating}</Text>
        </View>
      </View>

      <Text style={styles.reviewService}>Service: {item.service}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>

      {item.photos && item.photos.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.reviewPhotos}
        >
          {item.photos.map((photo, index) => (
            <Image 
              key={index}
              source={{ uri: photo }} 
              style={styles.reviewPhoto} 
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.helpfulButton}>
          <ThumbsUp size={16} color={COLORS.text.body} />
          <Text style={styles.helpfulCount}>{item.helpful}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.helpfulButton}>
          <ThumbsDown size={16} color={COLORS.text.body} />
          <Text style={styles.helpfulCount}>{item.notHelpful}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: provider.image }} style={styles.profileImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.headerOverlay}
          >
            <View style={styles.headerContent}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{provider.name}</Text>
                {provider.verified && (
                  <BadgeCheck size={20} color={COLORS.accent} />
                )}
              </View>
              
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.rating}>{provider.rating}</Text>
                <Text style={styles.ratingCount}>({provider.completedJobs} jobs)</Text>
              </View>

              <View style={styles.locationContainer}>
                <MapPin size={16} color="white" />
                <Text style={styles.location}>{provider.location}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{provider.completedJobs}</Text>
            <Text style={styles.statLabel}>Jobs Done</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{provider.experience}+</Text>
            <Text style={styles.statLabel}>Years Exp.</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{provider.ratings.total}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.push(`/chat/${provider.id}`)}
          >
            <MessageCircle size={20} color="white" />
            <Text style={styles.primaryButtonText}>Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push(`/book/${provider.id}`)}
          >
            <Calendar size={20} color={COLORS.accent} />
            <Text style={styles.secondaryButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'about' && styles.activeTab]}
            onPress={() => setSelectedTab('about')}
          >
            <Text style={[styles.tabText, selectedTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
            onPress={() => setSelectedTab('services')}
          >
            <Text style={[styles.tabText, selectedTab === 'services' && styles.activeTabText]}>
              Services
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'about' && (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.aboutText}>{provider.about}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills & Expertise</Text>
              <FlatList
                data={provider.skills}
                renderItem={renderSkillBar}
                keyExtractor={(item) => item.name}
                scrollEnabled={false}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {provider.certifications.map((cert, index) => (
                <View key={index} style={styles.certificationItem}>
                  <Award size={20} color={COLORS.accent} />
                  <View style={styles.certificationInfo}>
                    <Text style={styles.certificationName}>{cert.name}</Text>
                    <Text style={styles.certificationDetails}>
                      {cert.issuer} • {cert.year}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.languagesContainer}>
                {provider.languages.map((lang, index) => (
                  <View key={index} style={styles.languageItem}>
                    <Languages size={16} color={COLORS.text.body} />
                    <Text style={styles.languageText}>{lang}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Business Hours</Text>
              <View style={styles.businessHours}>
                <View style={styles.businessHourItem}>
                  <Text style={styles.businessHourDay}>Weekdays</Text>
                  <Text style={styles.businessHourTime}>
                    {provider.businessHours.weekdays}
                  </Text>
                </View>
                <View style={styles.businessHourItem}>
                  <Text style={styles.businessHourDay}>Weekends</Text>
                  <Text style={styles.businessHourTime}>
                    {provider.businessHours.weekends}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Service Area</Text>
              <View style={styles.serviceArea}>
                <MapPin size={20} color={COLORS.text.body} />
                <Text style={styles.serviceAreaText}>{provider.serviceArea}</Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === 'services' && (
          <View style={styles.tabContent}>
            {provider.services.map((category, index) => (
              <View key={index} style={styles.serviceCategory}>
                <Text style={styles.categoryTitle}>{category.category}</Text>
                {category.items.map((service, serviceIndex) => (
                  <View key={serviceIndex}>
                    {renderService({ item: service })}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'reviews' && (
          <View style={styles.tabContent}>
            <View style={styles.ratingBreakdown}>
              <View style={styles.overallRating}>
                <Text style={styles.overallRatingValue}>
                  {provider.ratings.overall}
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      color="#FFB800"
                      fill={star <= Math.floor(provider.ratings.overall) ? '#FFB800' : 'none'}
                    />
                  ))}
                </View>
                <Text style={styles.totalReviews}>
                  {provider.ratings.total} reviews
                </Text>
              </View>

              <View style={styles.ratingCategories}>
                {Object.entries(provider.ratings.categories).map(([key, value]) => (
                  <View key={key} style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Text>
                    <View style={styles.ratingBar}>
                      <View
                        style={[
                          styles.ratingFill,
                          { width: `${(value / 5) * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.ratingValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>

            <FlatList
              data={provider.reviews}
              renderItem={renderReview}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Chat Button */}
      <TouchableOpacity 
        style={styles.chatButton}
        onPress={() => router.push(`/chat/${provider.id}`)}
      >
        <MessageCircle size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 300,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  headerContent: {
    gap: 8,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Inter-Bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  ratingCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Inter-Regular',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Inter-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    margin: 20,
    padding: 16,
    ...SHADOWS.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: RADIUS.card,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
  },
  secondaryButton: {
    backgroundColor: `${COLORS.accent}15`,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  aboutText: {
    fontSize: 16,
    color: COLORS.text.body,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    color: COLORS.text.heading,
    fontFamily: 'Inter-Medium',
  },
  skillLevel: {
    fontSize: 14,
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  skillBar: {
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
  },
  skillFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  certificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  certificationInfo: {
    flex: 1,
  },
  certificationName: {
    fontSize: 16,
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-Medium',
  },
  certificationDetails: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  languageText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  businessHours: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    ...SHADOWS.card,
  },
  businessHourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  businessHourDay: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  businessHourTime: {
    fontSize: 14,
    color: COLORS.text.heading,
    fontFamily: 'Inter-Medium',
  },
  serviceArea: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    gap: 12,
    ...SHADOWS.card,
  },
  serviceAreaText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  serviceCategory: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  serviceCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceDetailText: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  sustainabilityScore: {
    fontSize: 14,
    color: '#4CAF50',
    fontFamily: 'Inter-Medium',
  },
  ratingBreakdown: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 20,
    ...SHADOWS.card,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overallRatingValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingCategories: {
    gap: 12,
  },
  ratingCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingCategoryLabel: {
    width: 120,
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginHorizontal: 12,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  ratingValue: {
    width: 32,
    fontSize: 14,
    color: COLORS.text.heading,
    textAlign: 'right',
    fontFamily: 'Inter-Medium',
  },
  reviewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewRatingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
    fontFamily: 'Inter-SemiBold',
  },
  reviewService: {
    fontSize: 14,
    color: COLORS.accent,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  reviewComment: {
    fontSize: 14,
    color: COLORS.text.body,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  reviewPhotos: {
    marginBottom: 12,
  },
  reviewPhoto: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpfulCount: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
});
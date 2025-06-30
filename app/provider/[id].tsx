import React, { useState, useEffect } from 'react';
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
  Phone,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

// Mock data for the provider
const PROVIDER_DATA = {
  id: '1',
  name: 'John Smith',
  image:
    'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&auto=compress&cs=tinysrgb',
  verified: true,
  rating: 4.8,
  completedJobs: 156,
  experience: 5,
  location: 'Patna, India',
  about:
    'Professional plumber with over 5 years of experience specializing in residential and commercial plumbing services. Licensed and insured.',
  skills: [
    { name: 'Pipe Repair', level: 95 },
    { name: 'Drain Cleaning', level: 90 },
    { name: 'Water Heater Installation', level: 85 },
    { name: 'Fixture Installation', level: 92 },
  ],
  certifications: [
    {
      name: 'Master Plumber License',
      issuer: 'California State Board',
      year: 2020,
    },
    { name: 'Green Plumbing Certification', issuer: 'IAPMO', year: 2021 },
  ],
  languages: ['English', 'Spanish'],
  businessHours: {
    weekdays: '8:00 AM - 6:00 PM',
    weekends: '9:00 AM - 4:00 PM',
  },
  serviceArea: '2 mile radius from Patna, India',
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
        image:
          'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&auto=compress&cs=tinysrgb',
        verified: true,
      },
      rating: 5,
      date: 'May 15, 2025',
      service: 'Pipe Repair',
      comment:
        'John was extremely professional and fixed our kitchen sink perfectly. He was on time and very respectful. Would definitely hire again!',
      photos: [
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400&auto=compress&cs=tinysrgb',
        'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?w=400&auto=compress&cs=tinysrgb',
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
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      // Fetch provider from Supabase using your users table structure
      const { data, error } = await supabase
        .from('users')
        .select(
          `
            id,
            name,
            bio,
            profile_image,
            address,
            location,
            is_provider,
            skills,
            rating,
            total_serves,
            certification_id,
            gov_id,
            wallet_balance,
            active,
            verified,
            created_at,
            experience
          `
        )
        .eq('id', id)
        .single();

      // Fallbacks for missing keys
      const fallback = {
        id,
        name: 'Unknown Provider',
        bio: '',
        profile_image:
          'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&auto=compress&cs=tinysrgb',
        address: 'Unknown',
        location: null,
        is_provider: true,
        skills: [],
        rating: 4.5,
        total_serves: 0,
        certification_id: '',
        gov_id: '',
        wallet_balance: 0,
        active: true,
        verified: false,
        created_at: new Date().toISOString(),
        experience: 1,
        // UI fields
        about: 'No about info available.',
        certifications: [],
        languages: ['English'],
        businessHours: { weekdays: '9:00 AM - 5:00 PM', weekends: 'Closed' },
        serviceArea: 'Not specified',
        services: [],
        ratings: {
          overall: 4.5,
          categories: {
            serviceQuality: 4.5,
            punctuality: 4.5,
            professionalism: 4.5,
            valueForMoney: 4.5,
            safetyAndTrust: 4.5,
          },
          total: 0,
        },
        reviews: [],
      };

      let providerData = { ...fallback, ...(data || {}) };

      // Map DB fields to UI fields
      providerData.image = providerData.profile_image;
      providerData.completedJobs = providerData.total_serves;
      providerData.experience = providerData.experience;
      providerData.location = providerData.address || 'Unknown';

      // About
      providerData.about = providerData.bio || 'No about info available.';

      // Skills
      providerData.skills =
        providerData.skills && providerData.skills.length
          ? providerData.skills.map((skill: string) => ({
              name: skill,
              level: 90,
            }))
          : [{ name: 'General Service', level: 80 }];

      // Certifications (mock if missing)
      if (
        !providerData.certifications ||
        providerData.certifications.length === 0
      ) {
        providerData.certifications = [
          {
            name: 'Professional Certification',
            issuer: 'Govt. Authority',
            year: 2022,
          },
        ];
      }

      // Languages (mock if missing)
      if (!providerData.languages || providerData.languages.length === 0) {
        providerData.languages = ['English'];
      }

      // Business hours (mock if missing)
      if (!providerData.businessHours) {
        providerData.businessHours = {
          weekdays: '9:00 AM - 5:00 PM',
          weekends: 'Closed',
        };
      }

      // Service area (mock if missing)
      if (!providerData.serviceArea) {
        providerData.serviceArea = 'Within city limits';
      }

      // Services (mock if missing)
      if (!providerData.services || providerData.services.length === 0) {
        providerData.services = [
          {
            category: 'General',
            items: [
              {
                name: 'Consultation',
                price: '50-100',
                duration: '30-60 min',
                sustainabilityScore: 4.5,
              },
            ],
          },
        ];
      }

      // Ratings (mock if missing)
      if (!providerData.ratings) {
        providerData.ratings = {
          overall: providerData.rating || 4.5,
          categories: {
            serviceQuality: providerData.rating || 4.5,
            punctuality: providerData.rating || 4.5,
            professionalism: providerData.rating || 4.5,
            valueForMoney: providerData.rating || 4.5,
            safetyAndTrust: providerData.rating || 4.5,
          },
          total: providerData.total_serves || 0,
        };
      }

      // Reviews (mock if missing)
      if (!providerData.reviews || providerData.reviews.length === 0) {
        providerData.reviews = [
          {
            id: '1',
            user: {
              id: 'demo-user',
              name: 'Emma Johnson',
              image:
                'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&auto=compress&cs=tinysrgb',
              verified: true,
            },
            rating: 5,
            date: 'May 15, 2025',
            service: 'Consultation',
            //dynamic comment

            comment: `${providerData.name} is very professional service provider. ${providerData.name} provides first class service. Highly recommend him!`,
            photos: [
              'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400&auto=compress&cs=tinysrgb',
              'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?w=400&auto=compress&cs=tinysrgb',
            ],
            helpful: 12,
            notHelpful: 1,
          },
        ];
      } else {
        providerData.reviews = providerData.reviews.map((review, idx) => ({
          id: review.id || String(idx + 1),
          user: review.user || {
            id: 'demo-user',
            name: 'Emma Johnson',
            image:
              'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&auto=compress&cs=tinysrgb',
            verified: true,
          },
          rating: review.rating ?? 5,
          date: review.date || 'May 15, 2025',
          service: review.service || 'Consultation',
          comment:
            review.comment ||
            'John was extremely professional and fixed our kitchen sink perfectly. He was on time and very respectful. Would definitely hire again!',
          photos:
            review.photos && review.photos.length > 0
              ? review.photos
              : [
                  'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=400&auto=compress&cs=tinysrgb',
                  'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?w=400&auto=compress&cs=tinysrgb',
                ],
          helpful: review.helpful ?? 12,
          notHelpful: review.notHelpful ?? 1,
        }));
      }

      // Fetch services for this provider
      let providerServices: any[] = [];
      try {
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('provider', id)
          .eq('active', true)
          .limit(40);

        if (!servicesError && servicesData && servicesData.length > 0) {
          // Group services by category for UI
          const grouped = {};
          servicesData.forEach((svc) => {
            const cat = svc.category || 'General';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              name: svc.title,
              price: svc.hourly_price || svc.once_price || 'N/A',
              duration: svc.duration ? `${svc.duration} hours` : '5 hours',
              sustainabilityScore: 4.5, // mock/fallback
            });
          });
          providerServices = Object.entries(grouped).map(
            ([category, items]) => ({
              category,
              items,
            })
          );
        }
      } catch (e) {
        // fallback to mock if error
      }

      if (providerServices.length > 0) {
        providerData.services = providerServices;
      }

      setProvider(providerData);
    };
    fetchProvider();
  }, [id]);

  if (!provider) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading provider...</Text>
      </View>
    );
  }

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
        <Text style={styles.servicePrice}>₹{item.price}</Text>
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
    <View style={styles.reviewCard}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.reviewHeader}
        onPress={() => router.push(`/user/${item.user.id}`)}
      >
        <Image source={{ uri: item.user.image }} style={styles.reviewerImage} />
        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerNameContainer}>
            <Text style={[styles.reviewerName, { color: COLORS.accent }]}>
              {item.user.name}
            </Text>
            {item.user.verified && (
              <BadgeCheck
                size={16}
                color={COLORS.surface}
                fill={COLORS.accent}
              />
            )}
          </View>
          <Text style={styles.reviewDate}>{item.date}</Text>
        </View>
        <View style={styles.reviewRating}>
          <Star size={16} color="#FFB800" fill="#FFB800" />
          <Text style={styles.reviewRatingText}>{item.rating}</Text>
        </View>
      </TouchableOpacity>

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
        <TouchableOpacity activeOpacity={0.7} style={styles.helpfulButton}>
          <ThumbsUp size={16} color={COLORS.text.body} />
          <Text style={styles.helpfulCount}>{item.helpful}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.helpfulButton}>
          <ThumbsDown size={16} color={COLORS.text.body} />
          <Text style={styles.helpfulCount}>{item.notHelpful}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
                  <BadgeCheck
                    size={20}
                    color={COLORS.surface}
                    fill={COLORS.accent}
                  />
                )}
              </View>

              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.rating}>{provider.rating}</Text>
                <Text style={styles.ratingCount}>
                  ({provider.completedJobs} jobs)
                </Text>
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
            <Text style={styles.statValue}>{provider.experience + 2}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() =>
              router.push({
                pathname: `/chat/${provider.id}` as any,
                params: { name: provider.name, providerImage: provider.image },
              })
            }
          >
            <MessageCircle size={20} color="white" />
            <Text style={styles.primaryButtonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() =>
              router.push({
                pathname: `/call/${provider.id}` as any,
                params: { name: provider.name, providerImage: provider.image },
              })
            }
          >
            <Phone size={20} color={COLORS.accent} />
            <Text style={styles.secondaryButtonText}>Call Now</Text>
          </TouchableOpacity>
        </View>

        {/* Content Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.tab, selectedTab === 'about' && styles.activeTab]}
            onPress={() => setSelectedTab('about')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'about' && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.tab, selectedTab === 'services' && styles.activeTab]}
            onPress={() => setSelectedTab('services')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'services' && styles.activeTabText,
              ]}
            >
              Services
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'reviews' && styles.activeTabText,
              ]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'about' && (
          <View style={styles.tabContent}>
            {/* Impact Card for ServeNear */}
            {(provider?.name === 'ServeNear' ||
              provider?.name === 'Vikash Singh' ||
              provider?.name === 'Amit Kumar') && (
              <View style={styles.impactCardContainer}>
                <LinearGradient
                  colors={['rgba(232, 245, 233, 1)', 'rgba(200, 230, 201, 1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.impactCard}
                >
                  <View style={styles.impactHeader}>
                    <View style={styles.impactHeaderLeft}>
                      <MaterialIcons
                        name="eco"
                        size={24}
                        color="rgba(56, 142, 60, 1)"
                      />
                      <Text style={styles.impactTitle}>
                        Environmental Impact
                      </Text>
                    </View>
                  </View>
                  <View style={styles.impactStats}>
                    <View style={styles.impactStatCard}>
                      <View
                        style={[
                          styles.impactIconContainer,
                          { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
                        ]}
                      >
                        <MaterialIcons
                          name="recycling"
                          size={24}
                          color="#4CAF50"
                        />
                      </View>
                      <View style={styles.impactStatText}>
                        <Text style={styles.impactValue}>12.5 kg</Text>
                        <Text style={styles.impactLabel}>e-waste avoided</Text>
                      </View>
                    </View>
                    <View style={styles.impactStatCard}>
                      <View
                        style={[
                          styles.impactIconContainer,
                          { backgroundColor: 'rgba(33, 150, 243, 0.1)' },
                        ]}
                      >
                        <MaterialIcons name="cloud" size={24} color="#2196F3" />
                      </View>
                      <View style={styles.impactStatText}>
                        <Text style={styles.impactValue}>8.3 kg</Text>
                        <Text style={styles.impactLabel}>CO₂ saved</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

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
                <Text style={styles.serviceAreaText}>
                  {5 + ' miles radius from ' + provider.location}
                </Text>
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
                      fill={
                        star <= Math.floor(provider.ratings.overall)
                          ? '#FFB800'
                          : 'none'
                      }
                    />
                  ))}
                </View>
                <Text style={styles.totalReviews}>
                  {provider.ratings.total} reviews
                </Text>
              </View>

              <View style={styles.ratingCategories}>
                {Object.entries(provider.ratings.categories).map(
                  ([key, value]) => (
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
                  )
                )}
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
        activeOpacity={0.7}
        style={styles.chatButton}
        onPress={() => {
          router.push({
            pathname: `/chat/${provider.id}` as any,
            params: { name: provider.name, providerImage: provider.image },
          });
        }}
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
  impactCardContainer: {
    marginHorizontal: 0,
    marginVertical: 16,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: 'rgba(165, 214, 167, 1)',
    overflow: 'hidden',
  },
  impactCard: {
    padding: 16,
  },
  impactHeader: {},
  impactHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(56, 142, 60, 1)',
    fontFamily: 'Inter-SemiBold',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  impactStatCard: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  impactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactStatText: {
    alignItems: 'center',
    textAlign: 'center',
  },
  impactValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(56, 142, 60, 1)',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  impactLabel: {
    fontSize: 12,
    color: 'rgba(56, 142, 60, 1)',
    fontFamily: 'Inter-Regular',
  },
});

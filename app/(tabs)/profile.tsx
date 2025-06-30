import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { COLORS, SHADOWS, RADIUS } from '@/constants/theme';
import { router } from 'expo-router';
import {
  Settings,
  Star,
  Award,
  LogOut,
  ChevronRight,
  Leaf,
  UserCheck,
  Cloud,
} from 'lucide-react-native';
import { useAuthStore } from '@/store/useAuthStore';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useScrollToHide } from '@/hooks/useScrollToHide';

export default function ProfileScreen() {
  const { user, logout, isProviderMode, toggleProviderMode } = useAuthStore();
  const [activeTab, setActiveTab] = useState('provider');
  const { scrollProps } = useScrollToHide();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const renderProviderModeSwitch = () => (
    <View style={styles.providerModeCard}>
      <View style={styles.providerModeContent}>
        <View>
          <Text style={styles.providerModeTitle}>
            {isProviderMode ? 'Provider Mode Active' : 'Enable Provider Mode'}
          </Text>
          <Text style={styles.providerModeDesc}>
            {isProviderMode
              ? 'You can now manage services and bookings'
              : 'Switch to provider mode to offer services'}
          </Text>
        </View>
        <Switch
          value={isProviderMode}
          onValueChange={async () => {
            await toggleProviderMode();
          }}
          trackColor={{ false: '#E0E0E0', true: `${COLORS.accent}50` }}
          thumbColor={isProviderMode ? COLORS.accent : '#9E9E9E'}
        />
      </View>
      {isProviderMode && (
        <View style={styles.providerModeStats}>
          <View style={styles.providerModeStat}>
            <Text style={styles.providerModeStatValue}>0</Text>
            <Text style={styles.providerModeStatLabel}>Active Services</Text>
          </View>
          <View style={styles.providerModeStat}>
            <Text style={styles.providerModeStatValue}>0</Text>
            <Text style={styles.providerModeStatLabel}>Help Requests</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderProviderMenuItems = () =>
    isProviderMode ? (
      <>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/add-service')}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[styles.menuIcon, { backgroundColor: 'rgba(0, 207, 232, 0.1)' }]}
            >
              <MaterialIcons name="add-business" size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.menuItemText}>Add New Service</Text>
          </View>
          <ChevronRight size={20} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/provider/services')}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[styles.menuIcon, { backgroundColor: 'rgba(255, 184, 0, 0.1)' }]}
            >
              <Award size={24} color="#FFB800" />
            </View>
            <Text style={styles.menuItemText}>My Services</Text>
          </View>
          <ChevronRight size={20} color="#9E9E9E" />
        </TouchableOpacity>
      </>
    ) : null;

  return (
    <View style={styles.container}>
      <ScrollView 
        {...scrollProps}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>

            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={24} color={COLORS.text.heading} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Image
            source={{
              uri:
                user?.avatar ||
                'https://npibtopuvjbftkstecht.supabase.co/storage/v1/object/public/service-images//logo.jpg',
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'ServeNear'}</Text>
            <Text style={styles.profileEmail}>
              {user?.email || 'support@servenear.ai'}
            </Text>

            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {renderProviderModeSwitch()}

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>32</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.ratingValue}>
              <Text style={styles.statValue}>4.8</Text>
              <Star size={16} color="#FFB800" fill="#FFB800" />
            </View>
            <Text style={styles.statLabel}>Rating</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

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
                <Text style={styles.impactTitle}>Environmental Impact</Text>
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
                  <MaterialIcons name="recycling" size={24} color="#4CAF50" />
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
                  <Cloud size={24} color="#2196F3" />
                </View>
                <View style={styles.impactStatText}>
                  <Text style={styles.impactValue}>8.3 kg</Text>
                  <Text style={styles.impactLabel}>CO₂ saved</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'provider' && styles.activeTab]}
            onPress={() => setActiveTab('provider')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'provider' && styles.activeTabText,
              ]}
            >
              As Provider
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'client' && styles.activeTab]}
            onPress={() => setActiveTab('client')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'client' && styles.activeTabText,
              ]}
            >
              As Client
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ratingsSection}>
          <Text style={styles.sectionTitle}>Recent Ratings</Text>

          {activeTab === 'provider' ? (
            <>
              <View style={styles.ratingCard}>
                <View style={styles.ratingHeader}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
                    }}
                    style={styles.raterImage}
                  />
                  <View>
                    <Text style={styles.raterName}>Emma Johnson</Text>
                    <Text style={styles.ratingDate}>May 15, 2025</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.ratingBadgeText}>4.9</Text>
                  </View>
                </View>

                <View style={styles.ratingCategories}>
                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Respect</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '95%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.8</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Trust</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>5.0</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>
                      Communication
                    </Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '90%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.5</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Punctuality</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>5.0</Text>
                  </View>
                </View>

                <Text style={styles.ratingComment}>
                  ServeNear was extremely professional and fixed our kitchen sink
                  perfectly. They were on time and very respectful. Would
                  definitely hire again!
                </Text>
              </View>

              <View style={styles.ratingCard}>
                <View style={styles.ratingHeader}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
                    }}
                    style={styles.raterImage}
                  />
                  <View>
                    <Text style={styles.raterName}>Michael Chen</Text>
                    <Text style={styles.ratingDate}>May 10, 2025</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <Star size={12} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.ratingBadgeText}>4.7</Text>
                  </View>
                </View>

                <View style={styles.ratingCategories}>
                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Respect</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>5.0</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Trust</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '90%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.5</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>
                      Communication
                    </Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '90%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.5</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Punctuality</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '95%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.8</Text>
                  </View>
                </View>

                <Text style={styles.ratingComment}>
                  Great service repairing our dishwasher. Explained everything
                  clearly and did a thorough job.
                </Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.ratingCard}>
                <View style={styles.ratingHeader}>
                  <Image
                    source={{
                      uri: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg',
                    }}
                    style={styles.raterImage}
                  />
                  <View>
                    <Text style={styles.raterName}>Sarah Wilson</Text>
                    <Text style={styles.ratingDate}>May 20, 2025</Text>
                  </View>
                  <View style={styles.ratingBadge}>
                    <UserCheck size={12} color="#4CAF50" />
                    <Text style={styles.ratingBadgeText}>4.8</Text>
                  </View>
                </View>

                <View style={styles.ratingCategories}>
                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Respect</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '100%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>5.0</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>
                      Communication
                    </Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '95%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.8</Text>
                  </View>

                  <View style={styles.ratingCategoryItem}>
                    <Text style={styles.ratingCategoryLabel}>Payment</Text>
                    <View style={styles.ratingBar}>
                      <View style={[styles.ratingFill, { width: '90%' }]} />
                    </View>
                    <Text style={styles.ratingCategoryValue}>4.5</Text>
                  </View>
                </View>

                <Text style={styles.ratingComment}>
                  Great client! Clear about requirements and very respectful of
                  my time. Prompt payment.
                </Text>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Ratings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {renderProviderMenuItems()}

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
                ]}
              >
                <MaterialIcons name="payment" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.menuItemText}>Payment Methods</Text>
            </View>
            <ChevronRight size={20} color="#9E9E9E" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.menuIcon,
                  { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
                ]}
              >
                <LogOut size={24} color="#F44336" />
              </View>
              <Text style={[styles.menuItemText, { color: '#F44336' }]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.text.body,
    marginBottom: 12,
    fontFamily: 'Inter-Regular',
  },
  editProfileButton: {
    backgroundColor: 'rgba(0, 207, 232, 0.1)',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    justifyContent: 'space-between',
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
  ratingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
  },
  impactCardContainer: {
    marginHorizontal: 20,
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tab: {
    paddingVertical: 12,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.body,
    fontFamily: 'Inter-Medium',
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
  },
  ratingsSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  ratingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.card,
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  raterImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  raterName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    fontFamily: 'Inter-SemiBold',
  },
  ratingDate: {
    fontSize: 12,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 'auto',
  },
  ratingBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFB800',
    marginLeft: 4,
    fontFamily: 'Inter-SemiBold',
  },
  ratingCategories: {
    marginBottom: 12,
  },
  ratingCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingCategoryLabel: {
    width: 100,
    fontSize: 14,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
  ratingBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F5F5F5',
    borderRadius: 3,
    marginHorizontal: 8,
  },
  ratingFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
  ratingCategoryValue: {
    width: 30,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.heading,
    textAlign: 'right',
    fontFamily: 'Inter-Medium',
  },
  ratingComment: {
    fontSize: 14,
    color: COLORS.text.body,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.accent,
    fontFamily: 'Inter-Medium',
  },
  menuSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 8,
    marginHorizontal: 20,
    marginBottom: 100,
    ...SHADOWS.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Medium',
  },
  providerModeCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    ...SHADOWS.card,
  },
  providerModeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  providerModeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.heading,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  providerModeDesc: {
    fontSize: 12,
    color: COLORS.text.body,
    maxWidth: '80%',
    fontFamily: 'Inter-Regular',
  },
  providerModeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  providerModeStat: {
    alignItems: 'center',
  },
  providerModeStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text.heading,
    fontFamily: 'Inter-Bold',
  },
  providerModeStatLabel: {
    fontSize: 12,
    color: COLORS.text.body,
    fontFamily: 'Inter-Regular',
  },
});

export interface ServiceLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ServiceAvailability {
  days: string;
  hours: string;
}

export interface ServiceRatings {
  respect: number;
  trust: number;
  communication: number;
  punctuality: number;
}

// Updated to match Supabase users table
export interface ServiceProvider {
  id: string;
  name: string;
  bio?: string;
  profile_image?: string;
  address?: string;
  location?: any; // PostGIS geography type
  is_provider: boolean;
  skills?: string[];
  rating?: number;
  total_serves?: number;
  certification_id?: string;
  gov_id?: string;
  wallet_balance?: number;
  active?: boolean;
  verified?: boolean;
  created_at?: string;
  experience?: number;
}

// Updated to match Supabase services table
export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  hourly_price: number;
  once_price: number;
  active?: boolean;
  lat?: number;
  long?: number;
  location?: any; // PostGIS geography type
  rating?: number;
  created_at?: string;
  tags?: string[];
  subcategory?: string; // UUID reference to subcategories
  provider?: string; // UUID reference to users
  terms_and_conditions?: string;
  image?: string;
  service_area?: number;
  verification_status?: string;
  included?: string[];

  // Joined data from relations
  provider_details?: ServiceProvider;
  subcategory_details?: SubCategory;
  category_details?: ServiceCategory;

  // Computed fields for UI
  distance?: number;
  reviewCount?: number;
  availability?: ServiceAvailability;
  ratings?: ServiceRatings;
  fixedPrice?: number; // Alias for once_price
  price?: number; // Alias for hourly_price
}

// Updated to match Supabase subcategories table
export interface SubCategory {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  created_at?: string;

  // Computed fields for UI
  startingPrice?: number;
  servicesCount?: number;
}

// Updated to match Supabase categories table
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  image?: string;
  created_at?: string;
  subcategories?: SubCategory[];
}

export interface TrendingService {
  id: string;
  title: string;
  description?: string;
  provider: string;
  rating?: number;
  once_price?: number;
  hourly_price: number;
  image?: string;
  lat?: number;
  long?: number;
  distance?: number;
}

export interface BookingItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage?: string;
  providerName: string;
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'upcoming' | 'completed' | 'cancelled';
}

export interface ReviewItem {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
  photos: string[];
}

export interface ServiceCreateParams {
  title: string;
  description: string;
  hourly_price: number;
  once_price: number;
  category: string;
  subcategory?: string;
  location: ServiceLocation;
  availability: ServiceAvailability;
  image: string;
  tags?: string[];
  service_area?: number;
  included?: string[];
  terms_and_conditions?: string;
}

// Database response types
export interface DatabaseService {
  id: string;
  title: string;
  description?: string;
  hourly_price: number;
  once_price: number;
  active: boolean;
  lat?: number;
  long?: number;
  location?: any;
  rating?: number;
  created_at: string;
  tags?: string[];
  subcategory?: string;
  provider?: string;
  terms_and_conditions?: string;
  image?: string;
  service_area?: number;
  verification_status?: string;
  included?: string[];
}

export interface DatabaseCategory {
  id: string;
  name: string;
  description?: string;
  icon: string;
  image?: string;
  created_at: string;
}

export interface DatabaseSubcategory {
  id: string;
  category_id?: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  created_at: string;
}

export interface DatabaseUser {
  id: string;
  name: string;
  bio?: string;
  profile_image?: string;
  address?: string;
  location?: any;
  is_provider: boolean;
  skills?: string[];
  rating?: number;
  total_serves?: number;
  certification_id?: string;
  gov_id?: string;
  wallet_balance?: number;
  active: boolean;
  verified: boolean;
  created_at: string;
  experience?: number;
}
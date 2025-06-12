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

export interface ServiceProvider {
  id: string;
  name: string;
  bio?: string;
  profile_image?: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
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

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  provider: ServiceProvider;
  provider_details?: {
    name: string;
    avatar_url?: string;
  };
  category?: string;
  subcategory?: string;
  subcategory_details?: {
    name: string;
    icon: string;
  };
  hourly_price?: number;
  once_price?: number;
  active?: boolean;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  availability?: ServiceAvailability;
  rating?: number;
  ratings?: ServiceRatings;
  reviewCount?: number;
  distance?: number;
  created_at?: string;
  tags?: string[];
  terms_and_conditions?: string;
  image?: string;
  service_area?: number;
  verification_status?: string;
  included?: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  created_at?: string;
  category_id: string;
  startingPrice?: number;
  servicesCount?: number;
}

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
  description: string;
  provider: string;
  rating: number;
  once_price?: number;
  hourly_price: number;
  image: string;
  distance: number;
}

export interface BookingItem {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
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
  price: number;
  category: string;
  location: ServiceLocation;
  availability: ServiceAvailability;
  image: string;
}
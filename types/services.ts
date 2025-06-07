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

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  hourly_price: number;
  once_price: number;
  active?: boolean;
  lat?: number;
  long?: number;
  rating?: number;
  created_at?: string;
  tags?: string[];
  subcategory?: string;
  provider?: string;
  terms_and_conditions?: string;
  image?: string;
  service_area?: number;
  verification_status?: string;
  included?: string[];
  location?: any;
  provider_details?: {
    name: string;
    avatar_url?: string;
  };
  subcategory_details?: {
    name: string;
    icon?: string;
  };
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  provider: string;
  rating: number;
  distance: string;
  image: string;
  category: string;
  subcategory: {
    name: string;
    icon: string;
  };
  lat: number;
  long: number;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  image?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  categoryId: string;
  startingPrice: number;
  servicesCount: number;
  image: string;
}

export interface TrendingService {
  id: string;
  title: string;
  description: string;
  provider: string;
  rating: number;
  price: number;
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
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
  description: string;
  provider: string;
  providerImage: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: number;
  fixedPrice: number;
  image: string;
  distance: number;
  location: ServiceLocation;
  availability: ServiceAvailability;
  ratings: ServiceRatings;
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
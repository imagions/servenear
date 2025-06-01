import { ServiceCategory, ServiceItem, SubCategory, TrendingService, BookingItem, ReviewItem, ServiceCreateParams } from './services';
import { User } from './auth';
import { CartItem, CartItemParams } from './cart';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  loadAuthState: () => void;
}

export interface ServiceState {
  services: ServiceItem[];
  categories: ServiceCategory[];
  subcategories: SubCategory[];
  trendingServices: TrendingService[];
  nearbyServices: TrendingService[];
  bookings: BookingItem[];
  reviews: ReviewItem[];
  cart: CartItem[];
  
  fetchCategories: () => void;
  fetchTrendingServices: () => void;
  fetchNearbyServices: (location: { latitude: number; longitude: number }) => void;
  filterServices: (query: string, categories: string[]) => ServiceItem[];
  getServiceById: (id: string) => ServiceItem | undefined;
  getCategoryById: (id: string) => ServiceCategory | undefined;
  getSubcategoriesByCategoryId: (categoryId: string) => SubCategory[];
  getServicesByCategoryId: (categoryId: string) => ServiceItem[];
  addService: (params: ServiceCreateParams) => void;
  addToCart: (params: CartItemParams) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}
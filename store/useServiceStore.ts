import { create } from 'zustand';
import { ServiceCategory, ServiceItem, ServiceCreateParams, CartItemParams, SubCategory, TrendingService, BookingItem, ReviewItem, DatabaseService, DatabaseCategory, DatabaseSubcategory, DatabaseUser } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockCategories, mockServices, mockSubcategories, mockTrendingServices, mockBookings, mockReviews } from '@/constants/mock';

interface ServiceStore {
  services: ServiceItem[];
  categories: ServiceCategory[];
  subcategories: SubCategory[];
  trendingServices: TrendingService[];
  nearbyServices: TrendingService[];
  bookings: BookingItem[];
  reviews: ReviewItem[];
  cart: any[];
  loading: boolean;
  error: string | null;
  
  // Fetch functions
  fetchCategories: () => Promise<void>;
  fetchTrendingServices: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchNearbyServices: (coords: { latitude: number; longitude: number }) => Promise<void>;
  
  // Utility functions
  filterServices: (query: string, categories: string[]) => ServiceItem[];
  getCategoryById: (id: string) => ServiceCategory | undefined;
  getServiceById: (id: string) => ServiceItem | undefined;
  getSubcategoriesByCategoryId: (categoryId: string) => SubCategory[];
  getServicesByCategoryId: (categoryId: string) => ServiceItem[];
  
  // CRUD operations
  addService: (params: ServiceCreateParams) => void;
  addToCart: (params: CartItemParams) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

// Helper function to transform database service to UI service
const transformDatabaseService = (dbService: DatabaseService & { 
  provider_details?: DatabaseUser;
  subcategory_details?: DatabaseSubcategory;
  category_details?: DatabaseCategory;
}): ServiceItem => {
  return {
    id: dbService.id,
    title: dbService.title,
    description: dbService.description,
    hourly_price: dbService.hourly_price,
    once_price: dbService.once_price,
    active: dbService.active,
    lat: dbService.lat,
    long: dbService.long,
    location: dbService.location,
    rating: dbService.rating || 0,
    created_at: dbService.created_at,
    tags: dbService.tags,
    subcategory: dbService.subcategory,
    provider: dbService.provider,
    terms_and_conditions: dbService.terms_and_conditions,
    image: dbService.image,
    service_area: dbService.service_area,
    verification_status: dbService.verification_status,
    included: dbService.included,
    
    // Transform joined data
    provider_details: dbService.provider_details,
    subcategory_details: dbService.subcategory_details,
    category_details: dbService.category_details,
    
    // UI computed fields
    price: dbService.hourly_price,
    fixedPrice: dbService.once_price,
    providerImage: dbService.provider_details?.profile_image,
    category: dbService.category_details?.name || dbService.subcategory_details?.name,
    reviewCount: 0, // TODO: Calculate from reviews
    distance: 0, // TODO: Calculate based on user location
    availability: {
      days: 'Mon-Fri',
      hours: '9:00 AM - 5:00 PM'
    },
    ratings: {
      respect: dbService.rating || 0,
      trust: dbService.rating || 0,
      communication: dbService.rating || 0,
      punctuality: dbService.rating || 0
    }
  };
};

// Helper function to transform database category
const transformDatabaseCategory = (dbCategory: DatabaseCategory, subcategories: SubCategory[] = []): ServiceCategory => {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    description: dbCategory.description,
    icon: dbCategory.icon,
    image: dbCategory.image,
    created_at: dbCategory.created_at,
    subcategories
  };
};

// Helper function to transform database subcategory
const transformDatabaseSubcategory = (dbSubcategory: DatabaseSubcategory): SubCategory => {
  return {
    id: dbSubcategory.id,
    category_id: dbSubcategory.category_id,
    name: dbSubcategory.name,
    description: dbSubcategory.description,
    icon: dbSubcategory.icon,
    image: dbSubcategory.image,
    created_at: dbSubcategory.created_at,
    startingPrice: 50, // TODO: Calculate from services
    servicesCount: 0 // TODO: Calculate from services
  };
};

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  categories: [],
  subcategories: [],
  trendingServices: [],
  nearbyServices: [],
  bookings: mockBookings,
  reviews: mockReviews,
  cart: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching categories from Supabase...');

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) {
        console.error('Categories Error:', categoriesError);
        throw categoriesError;
      }

      // Fetch subcategories
      const { data: subcategoriesData, error: subcategoriesError } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');

      if (subcategoriesError) {
        console.error('Subcategories Error:', subcategoriesError);
        throw subcategoriesError;
      }

      console.log('Categories fetched:', categoriesData);
      console.log('Subcategories fetched:', subcategoriesData);

      // Transform and group data
      const transformedSubcategories = (subcategoriesData || []).map(transformDatabaseSubcategory);
      const transformedCategories = (categoriesData || []).map(category => {
        const categorySubcategories = transformedSubcategories.filter(
          sub => sub.category_id === category.id
        );
        return transformDatabaseCategory(category, categorySubcategories);
      });

      // If no data, use mock data as fallback
      if (!categoriesData || categoriesData.length === 0) {
        console.log('No categories found, using mock data');
        set({ 
          categories: mockCategories,
          subcategories: mockSubcategories,
          loading: false 
        });
        return;
      }

      set({ 
        categories: transformedCategories,
        subcategories: transformedSubcategories,
        loading: false 
      });

    } catch (error: any) {
      console.error('Error fetching categories:', error);
      set({
        error: error.message,
        loading: false,
        categories: mockCategories, // Fallback to mock data
        subcategories: mockSubcategories
      });
    }
  },

  fetchTrendingServices: async () => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching trending services...');

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider_details:provider(
            id, name, profile_image, verified, rating
          ),
          subcategory_details:subcategory(
            id, name, icon
          ),
          category_details:subcategory(
            category_id,
            categories!inner(
              id, name, icon
            )
          )
        `)
        .eq('active', true)
        .gte('rating', 4.5)
        .order('rating', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Trending services error:', error);
        throw error;
      }

      console.log('Trending services fetched:', data);

      if (!data || data.length === 0) {
        console.log('No trending services found, using mock data');
        set({ trendingServices: mockTrendingServices, loading: false });
        return;
      }

      const transformedServices = data.map(transformDatabaseService);
      const trendingServices = transformedServices.map(service => ({
        id: service.id,
        title: service.title,
        description: service.description || '',
        provider: service.provider_details?.name || 'Unknown Provider',
        rating: service.rating || 0,
        once_price: service.once_price,
        hourly_price: service.hourly_price,
        image: service.image || '',
        distance: service.distance || 0
      }));

      set({ trendingServices, loading: false });

    } catch (error: any) {
      console.error('Error fetching trending services:', error);
      set({ 
        error: error.message, 
        loading: false,
        trendingServices: mockTrendingServices // Fallback
      });
    }
  },

  fetchServices: async () => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching services...');

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider_details:provider(
            id, name, profile_image, verified, rating
          ),
          subcategory_details:subcategory(
            id, name, icon
          ),
          category_details:subcategory(
            category_id,
            categories!inner(
              id, name, icon
            )
          )
        `)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Services error:', error);
        throw error;
      }

      console.log('Services fetched:', data);

      if (!data || data.length === 0) {
        console.log('No services found, using mock data');
        set({ services: mockServices, loading: false });
        return;
      }

      const transformedServices = data.map(transformDatabaseService);
      set({ services: transformedServices, loading: false });

    } catch (error: any) {
      console.error('Error fetching services:', error);
      set({ 
        error: error.message, 
        loading: false,
        services: mockServices // Fallback
      });
    }
  },

  fetchNearbyServices: async ({ latitude, longitude }) => {
    console.log('Fetching nearby services for:', latitude, longitude);

    try {
      set({ loading: true, error: null });

      // Use PostGIS function to find nearby services
      const { data, error } = await supabase.rpc('nearby_services', {
        user_lat: latitude,
        user_lng: longitude,
        radius_km: 50
      });

      if (error) {
        console.error('Nearby services error:', error);
        // Fallback to regular fetch with mock distance
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('services')
          .select(`
            *,
            provider_details:provider(
              id, name, profile_image, verified, rating
            ),
            subcategory_details:subcategory(
              id, name, icon
            )
          `)
          .eq('active', true)
          .limit(10);

        if (fallbackError) throw fallbackError;

        const transformedServices = (fallbackData || []).map(service => ({
          ...transformDatabaseService(service),
          distance: Math.random() * 10 // Mock distance
        }));

        set({ services: transformedServices, loading: false });
        return;
      }

      console.log('Nearby services fetched:', data);

      if (!data || data.length === 0) {
        console.log('No nearby services found, using mock data');
        const nearby = mockServices.map(service => ({
          ...service,
          distance: Math.random() * 5
        })).sort((a, b) => a.distance - b.distance);

        set({ services: nearby, loading: false });
        return;
      }

      const transformedServices = data.map(transformDatabaseService);
      set({ services: transformedServices, loading: false });

    } catch (error: any) {
      console.error('Error fetching nearby services:', error);
      set({ 
        error: error.message, 
        loading: false,
        services: mockServices.map(service => ({
          ...service,
          distance: Math.random() * 5
        }))
      });
    }
  },

  filterServices: (query: string, categories: string[]) => {
    const services = get().services;
    return services.filter(service => {
      const matchesQuery = !query ||
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = categories.length === 0 ||
        categories.includes(service.category?.toLowerCase() || '') ||
        categories.includes(service.subcategory_details?.name.toLowerCase() || '');

      return matchesQuery && matchesCategory;
    });
  },

  getServiceById: (id) => {
    return get().services.find(service => service.id === id);
  },

  getCategoryById: (id) => {
    return get().categories.find(category => category.id === id);
  },

  getSubcategoriesByCategoryId: (categoryId) => {
    const category = get().categories.find(c => c.id === categoryId);
    return category?.subcategories || [];
  },

  getServicesByCategoryId: (categoryId) => {
    const category = get().getCategoryById(categoryId);
    if (!category) return [];

    return get().services.filter(service => 
      service.category === category.name ||
      service.subcategory_details?.category_id === categoryId
    );
  },

  addService: async (params: ServiceCreateParams) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert({
          title: params.title,
          description: params.description,
          hourly_price: params.hourly_price,
          once_price: params.once_price,
          lat: params.location.latitude,
          long: params.location.longitude,
          image: params.image,
          tags: params.tags,
          service_area: params.service_area,
          included: params.included,
          terms_and_conditions: params.terms_and_conditions,
          subcategory: params.subcategory,
          provider: 'current-user-id', // TODO: Get from auth
          active: true
        })
        .select()
        .single();

      if (error) throw error;

      const transformedService = transformDatabaseService(data);
      set(state => ({
        services: [transformedService, ...state.services]
      }));

    } catch (error: any) {
      console.error('Error adding service:', error);
      set({ error: error.message });
    }
  },

  addToCart: (params: CartItemParams) => {
    const newCartItem = {
      id: `cart-${Date.now()}`,
      serviceId: params.serviceId,
      date: params.date,
      time: params.time,
      price: params.price
    };

    set(state => ({
      cart: [newCartItem, ...state.cart]
    }));
  },

  removeFromCart: (id) => {
    set(state => ({
      cart: state.cart.filter(item => item.id !== id)
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  }
}));
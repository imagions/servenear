import { create } from 'zustand';
import { ServiceCategory, ServiceItem, ServiceCreateParams, CartItemParams, SubCategory, BookingItem, ReviewItem, DatabaseService, DatabaseCategory, DatabaseSubcategory, DatabaseUser } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockCategories, mockSubcategories, mockBookings, mockReviews } from '@/constants/mock';

interface ServiceStore {
  services: ServiceItem[];
  categories: ServiceCategory[];
  subcategories: SubCategory[];
  trendingServices: ServiceItem[]; // Changed from TrendingService[]
  nearbyServices: ServiceItem[];   // Changed from TrendingService[]
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
        .order('name').limit(40);

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
          provider_details:users (
            id,
            name,
            profile_image,
            verified,
            rating,
            bio,
            skills
          ),
          subcategory_details:subcategories (
            id,
            name,
            icon,
            category_details:categories (
              id,
              name,
              icon
            )
          )
        `)
        .eq('active', true)
        .limit(40);

      if (error) {
        console.error('Trending services error:', error);
        throw error;
      }

      console.log('Trending services fetched:', data);

      const transformedServices = data.map(transformDatabaseService);

      set({ trendingServices: transformedServices, loading: false, error: null });

    } catch (error: any) {
      console.error('Error fetching trending services:', error);
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
          provider_details:users (
            id,
            name,
            profile_image,
            verified,
            rating,
            bio,
            skills
          ),
          subcategory_details:subcategories (
            id,
            name,
            icon,
            category_details:categories (
              id,
              name,
              icon
            )
          )
        `)
        .eq('active', true)
        .limit(40);

      if (error) {
        console.error('Services error:', error);
        throw error;
      }

      console.log('Services fetched:', data);

      const transformedServices = data.map(transformDatabaseService);
      set({ services: transformedServices, loading: false, error: null });

    } catch (error: any) {
      console.error('Error fetching services:', error);
    }
  },

  fetchNearbyServices: async ({ latitude, longitude }) => {
    console.log('Fetching nearby services for:', latitude, longitude);

    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider_details:users (
            id,
            name,
            profile_image,
            verified,
            rating,
            bio,
            skills
          ),
          subcategory_details:subcategories (
            id,
            name,
            icon,
            category_details:categories (
              id,
              name,
              icon
            )
          )
        `)
        .eq('active', true)
        .limit(40);

      console.log('Supabase nearby services raw data:', data);

      if (error) throw error;

      const transformedServices = data.map(service => ({
        ...transformDatabaseService(service),
        distance: Math.random() * 10 // Mock distance
      }));

      set({ nearbyServices: transformedServices, loading: false, error: null });
      return;

    } catch (error: any) {
      console.error('Error fetching nearby services:', error);
    }
  },

  filterServices: (query: string, categories: string[]) => {
    // Split query into words, ignore empty strings
    const words = (query || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    // If no words, return all services (or filtered by category)
    if (words.length === 0) {
      return get().services.filter(service => {
        const matchesCategory =
          !categories?.length ||
          categories.includes(service.category_details?.name!) ||
          categories.includes(service.category_details?.id!);
        return matchesCategory;
      });
    }

    // For each word, find all matching services, then merge and deduplicate
    const allMatches = words.flatMap(word =>
      get().services.filter(service => {
        const searchable: string[] = [
          service.title || '',
          service.provider_details?.bio || '',
          ...(service.provider_details?.skills || []),
          service.provider_details?.name || service.provider || '',
          service.category_details?.name || '',
          service.description || '',
          ...(service.tags || []),
          service.subcategory_details?.name || ''
        ].map(str => (str || '').toLowerCase());

        const matchesQuery = searchable.some(field => field.includes(word));

        const matchesCategory =
          !categories?.length ||
          categories.includes(service.category_details?.name!) ||
          categories.includes(service.category_details?.id!);

        return matchesQuery && matchesCategory;
      })
    );

    // Deduplicate by service id
    const uniqueMatchesMap = new Map<string, ServiceItem>();
    allMatches.forEach(s => {
      if (!uniqueMatchesMap.has(s.id)) {
        uniqueMatchesMap.set(s.id, s);
      }
    });
    const uniqueMatches = Array.from(uniqueMatchesMap.values());

    // Sort: services with title match for the first word appear on top
    if (words.length > 0) {
      const firstWord = words[0];
      const matchesTitle = uniqueMatches.filter(service =>
        (service.title || '').toLowerCase().includes(firstWord)
      );
      const notMatchesTitle = uniqueMatches.filter(service =>
        !(service.title || '').toLowerCase().includes(firstWord)
      );
      return [...matchesTitle, ...notMatchesTitle];
    }

    return uniqueMatches;
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
      service.category_details?.name === category.name ||
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
          provider: '55b68d62-d947-44f9-bcf1-78345d0e6f3e',
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
      id: params.id,
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
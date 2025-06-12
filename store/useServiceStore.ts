import { create } from 'zustand';
import { ServiceCategory, ServiceItem, ServiceCreateParams, CartItemParams, SubCategory } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockCategories, mockServices, mockSubcategories, mockTrendingServices, mockBookings, mockReviews } from '@/constants/mock';

interface ServiceStore {
  services: ServiceItem[];
  categories: ServiceCategory[];
  subcategories: SubCategory[];
  trendingServices: ServiceItem[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchTrendingServices: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchNearbyServices: (coords: { latitude: number; longitude: number }) => Promise<void>;
  filterServices: (query: string, categories: string[]) => ServiceItem[];
  getCategoryById: (id: string) => ServiceCategory | undefined;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  categories: [],
  subcategories: [],
  trendingServices: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });
      console.log('Fetching categories from RPC...');

      const { data, error } = await supabase
        .rpc('get_categories_with_subcategories')
        .single(); // Use single() since we expect one array result

      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }

      console.log('Categories fetched:', data);

      // If no data, use mock data as fallback
      if (!data || data.length === 0) {
        console.log('No categories found, using mock data');
        const mockCategoriesWithSubs = mockCategories.map(category => ({
          ...category,
          subcategories: mockSubcategories.filter(sub => sub.category_id === category.id)
        }));
        set({ categories: mockCategoriesWithSubs, loading: false });
        return;
      }

      set({ categories: data, loading: false });

    } catch (error: any) {
      console.error('Error fetching categories:', error);
      set({
        error: error.message,
        loading: false,
        categories: []
      });
    }
  },

  fetchTrendingServices: async () => {
    try {
      set({ loading: true, error: null });

      // Using mock data for now
      const trending = mockServices.filter(s => s.rating >= 4.8);
      set({ trendingServices: trending, loading: false });

      // When Supabase is ready:

      const { data, error } = await supabase.rpc('nearby_services', {
        latitude: 47.611725,
        longitude: -122.334718,
        radius: 500000000
      });

      if (error) throw error;
      set({ trendingServices: data || [], loading: false });

    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchServices: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          provider_details:provider(
            name,
            avatar_url
          ),
          subcategory_details:subcategory(
            name,
            icon
          )
        `)
        .eq('active', true)
        .order('rating', { ascending: false }).limit(2);

      if (error) throw error;

      set({ services: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchNearbyServices: async ({ latitude, longitude }) => {
    console.log('Fetching nearby services for:', latitude, longitude);

    try {
      set({ loading: true, error: null });

      // Using mock data with distance calculation
      const nearby = mockServices.map(service => ({
        ...service,
        distance: Math.random() * 5 // Random distance for demo
      })).sort((a, b) => a.distance - b.distance);

      set({ services: nearby, loading: false });

      // When Supabase is ready:

      const { data, error } = await supabase.rpc('nearby_services', {
        latitude,
        longitude,
        radius: 500000000
      });
      console.log('Nearby services:', data);


      if (error) throw error;
      set({ services: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  filterServices: (query: string, categories: string[]) => {
    const services = get().services;
    return services.filter(service => {
      const matchesQuery = !query ||
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = categories.length === 0 ||
        categories.includes(service.category.toLowerCase());

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

    return get().services.filter(service => service.category === category.name);
  },

  addService: (params: ServiceCreateParams) => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      title: params.title,
      description: params.description,
      provider: 'John Doe', // Use current user's name in a real app
      providerImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      category: params.category,
      rating: 0,
      reviewCount: 0,
      price: params.price,
      image: params.image,
      distance: 0,
      location: params.location,
      availability: params.availability,
      ratings: {
        respect: 0,
        trust: 0,
        communication: 0,
        punctuality: 0
      }
    };

    set(state => ({
      services: [newService, ...state.services]
    }));
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
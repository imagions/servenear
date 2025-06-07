import { create } from 'zustand';
import { ServiceCategory, ServiceItem, ServiceCreateParams, CartItemParams } from '@/types';
import { supabase } from '@/lib/supabase';
import { mockCategories, mockServices, mockSubcategories, mockTrendingServices, mockBookings, mockReviews } from '@/constants/mock';

interface ServiceStore {
  services: ServiceItem[];
  categories: ServiceCategory[];
  trendingServices: ServiceItem[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchTrendingServices: () => Promise<void>;
  fetchServices: () => Promise<void>;
  fetchNearbyServices: (coords: { latitude: number; longitude: number }) => Promise<void>;
  filterServices: (query: string, categories: string[]) => ServiceItem[];
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: [],
  categories: [],
  trendingServices: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    try {
      set({ loading: true, error: null });

      // For now, use mock data until Supabase is set up
      set({ categories: mockCategories, loading: false });

      // When Supabase is ready, use this:

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ categories: data || [], loading: false });

    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTrendingServices: async () => {
    try {
      set({ loading: true, error: null });

      // Using mock data for now
      const trending = mockServices.filter(s => s.rating >= 4.8);
      set({ trendingServices: trending, loading: false });

      // When Supabase is ready:

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('rating', { ascending: false })
        .limit(10);

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
        .order('rating', { ascending: false });

      if (error) throw error;

      set({ services: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchNearbyServices: async ({ latitude, longitude }) => {
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
        radius: 500000
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
    return get().subcategories.filter(subcategory => subcategory.categoryId === categoryId);
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
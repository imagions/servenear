import { create } from 'zustand';
import { ServiceState, ServiceItem, ServiceCreateParams, CartItemParams } from '@/types';
import { mockCategories, mockServices, mockSubcategories, mockTrendingServices, mockBookings, mockReviews } from '@/constants/mock';

export const useServiceStore = create<ServiceState>((set, get) => ({
  services: mockServices,
  categories: mockCategories,
  subcategories: mockSubcategories,
  trendingServices: [],
  nearbyServices: [],
  bookings: mockBookings,
  reviews: mockReviews,
  cart: [],
  
  fetchCategories: () => {
    // In a real app, we would fetch from an API
    // For demo purposes, just use mock data
    set({ categories: mockCategories });
  },
  
  fetchTrendingServices: () => {
    // For demo purposes, use a subset of mock services
    set({ trendingServices: mockTrendingServices });
  },
  
  fetchNearbyServices: (location) => {
    // For demo purposes, just use mock data
    // In a real app, we would use the location to fetch nearby services
    const nearby = mockTrendingServices.map(service => ({
      ...service,
      distance: Math.round(Math.random() * 10 * 10) / 10 // Random distance between 0-10 miles
    }));
    
    set({ nearbyServices: nearby });
  },
  
  filterServices: (query, categories) => {
    const services = get().services;
    
    return services.filter(service => {
      const matchesQuery = query === '' || 
        service.title.toLowerCase().includes(query.toLowerCase()) ||
        service.description.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = categories.length === 0 || 
        categories.includes(service.category);
      
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
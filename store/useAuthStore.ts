import { create } from 'zustand';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  
  login: () => set({
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    }
  }),
  
  logout: () => set({
    isAuthenticated: false,
    user: null
  }),
  
  loadAuthState: () => {
    // In a real app, we would load from storage
    // For demo purposes, just set to not authenticated
    set({
      isAuthenticated: false,
      user: null
    });
  }
}));
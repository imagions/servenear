import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  isProviderMode: boolean;
  user: User | null;
  toggleProviderMode: () => Promise<void>;
  login: () => void;
  logout: () => void;
  loadAuthState: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isProviderMode: false,
      user: null,

      toggleProviderMode: async () => {
        const newValue = !get().isProviderMode;
        set({ isProviderMode: newValue });
      },

      login: () =>
        set({
          isAuthenticated: true,
          user: {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            avatar:
              'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
          },
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          isProviderMode: false,
        }),

      loadAuthState: () => {
        // In a real app, we would load from storage
        // For demo purposes, just set to not authenticated
        set({
          isAuthenticated: false,
          user: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
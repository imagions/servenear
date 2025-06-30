import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface AuthStore {
  isAuthenticated: boolean;
  isProviderMode: boolean;
  user: User | null;
  toggleProviderMode: () => Promise<void>;
  login: () => void;
  logout: () => void;
  loadAuthState: () => void;
  setUserLocation: (coords: { latitude: number; longitude: number }) => void;
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
            name: 'ServeNear',
            email: 'support@servenear.ai',
            phone: '1234567890',
            avatar:
              'https://npibtopuvjbftkstecht.supabase.co/storage/v1/object/public/service-images//logo.jpg',
          },
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          isProviderMode: false,
        }),

      loadAuthState: () => {
        set({
          isAuthenticated: false,
          user: null,
        });
      },

      setUserLocation: async (coords) => {
        set((state) => ({
          user: state.user
            ? { ...state.user, location: coords }
            : state.user,
        }));
        // Persist location in AsyncStorage for user
        const user = get().user;
        if (user) {
          const updatedUser = { ...user, location: coords };
          await AsyncStorage.setItem('auth-user-location', JSON.stringify(coords));
          set({ user: updatedUser });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
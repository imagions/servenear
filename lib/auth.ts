import { create } from 'zustand';

type UserType = 'user' | 'provider';

interface User {
  id: string;
  name: string;
  type: UserType;
  // Add other user properties as needed
}

interface AuthState {
  user: User | null;
  isProviderMode: boolean;
  setUser: (user: User | null) => void;
  toggleProviderMode: () => void;
  isAuthenticated: boolean;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isProviderMode: false,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  toggleProviderMode: () => set((state) => ({ isProviderMode: !state.isProviderMode })),
}));

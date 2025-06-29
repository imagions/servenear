import { create } from 'zustand';
import { CartItem } from '@/types/cart';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  hydrate: () => Promise<void>;
}

const CART_STORAGE_KEY = 'servenear_cart_items';

const persistCart = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // handle error
  }
};

const loadCart = async (): Promise<CartItem[]> => {
  try {
    const data = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // handle error
  }
  return [];
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addToCart: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    let newItems;
    if (existingItem) {
      newItems = state.items.map(i =>
        i.id === item.id
          ? { ...i, ...item }
          : i
      );
    } else {
      newItems = [...state.items, { ...item, quantity: 1 }];
    }
    persistCart(newItems);
    return { items: newItems };
  }),
  removeFromCart: (itemId) => set((state) => {
    const newItems = state.items.filter(i => i.id !== itemId);
    persistCart(newItems);
    return { items: newItems };
  }),
  clearCart: () => {
    // Use set with callback to ensure state is updated before persisting
    set({ items: [] });
    persistCart([]);
  },
  updateQuantity: (itemId, quantity) => set((state) => {
    const newItems = state.items.map(i =>
      i.id === itemId ? { ...i, quantity } : i
    );
    persistCart(newItems);
    return { items: newItems };
  }),
  hydrate: async () => {
    const loaded = await loadCart();
    set({ items: loaded });
  }
}));

// Hydrate cart on app start
useCartStore.getState().hydrate();

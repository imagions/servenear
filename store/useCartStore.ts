import { create } from 'zustand';

interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  provider: string;
  quantity?: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addToCart: (item) => set((state) => {
    const existingItem = state.items.find(i => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map(i => 
          i.id === item.id 
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        )
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (itemId) => set((state) => ({
    items: state.items.filter(i => i.id !== itemId)
  })),
  clearCart: () => set({ items: [] }),
  updateQuantity: (itemId, quantity) => set((state) => ({
    items: state.items.map(i => 
      i.id === itemId ? { ...i, quantity } : i
    )
  }))
}));

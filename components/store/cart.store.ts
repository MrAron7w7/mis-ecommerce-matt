'use client';

import { create } from 'zustand';

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];

  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  decreaseItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (productId) => {
    const items = get().items;
    const exists = items.find((i) => i.productId === productId);

    if (exists) {
      set({
        items: items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      });
    } else {
      set({
        items: [...items, { productId, quantity: 1 }],
      });
    }
  },

  decreaseItem: (productId) => {
    const items = get().items;

    set({
      items: items
        .map((i) => (i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    });
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter((i) => i.productId !== productId),
    });
  },

  clearCart: () => set({ items: [] }),
}));

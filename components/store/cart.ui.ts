'use client';

import { create } from 'zustand';

type CartUI = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartUI = create<CartUI>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

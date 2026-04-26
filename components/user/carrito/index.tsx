'use client';

import { useCartStore } from '@/store/cartStore';
import { Overlay } from './overlay';
import { Panel } from './panelLateral';

export function CartDrawer() {
  const { isOpen, closeCart } = useCartStore();

  return (
    <>
      <Overlay isOpen={isOpen} onClose={closeCart} />
      <Panel isOpen={isOpen} />
    </>
  );
}

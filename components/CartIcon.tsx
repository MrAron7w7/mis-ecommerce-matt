'use client'; // Este archivo sí puede ser de cliente
import { useCart } from '@/app/(user)/context/CartContext'; 

export function CartIcon() {
  const { cartCount } = useCart();

  return (
    <button className="relative p-2 hover:bg-gray-100 rounded-full transition-all">
      <svg 
        className="w-6 h-6 text-black" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
      {cartCount > 0 && (
        <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-1.5 rounded-full border border-white">
          {cartCount}
        </span>
      )}
    </button>
  );
}
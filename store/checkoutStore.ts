import { create } from 'zustand';
import {
  DeliveryMethod,
  PaymentMethod,
  DeliveryAddress,
  SelectedStore,
} from '@/components/user/checkout/types/checkout.types';

export const DELIVERY_COST = 15;

interface CardData {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  cvv: string;
}

interface CheckoutStore {
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  deliveryAddress: DeliveryAddress | null;
  selectedStore: SelectedStore | null;

  // datos guardados de cada método
  cardData: CardData | null;
  yapePhone: string | null;
  isPaymentDataSaved: boolean; // ✅ indica si ya guardó datos del método

  setDeliveryMethod: (method: DeliveryMethod) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  setSelectedStore: (store: SelectedStore) => void;
  setCardData: (data: CardData) => void; // ✅ nuevo
  setYapePhone: (phone: string) => void; // ✅ nuevo
  setIsPaymentDataSaved: (v: boolean) => void; // ✅ nuevo

  isCardModalOpen: boolean;
  isYapeModalOpen: boolean;
  openCardModal: () => void;
  closeCardModal: () => void;
  openYapeModal: () => void;
  closeYapeModal: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  deliveryMethod: 'delivery',
  paymentMethod: 'card',
  deliveryAddress: null,
  selectedStore: null,
  cardData: null,
  yapePhone: null,
  isPaymentDataSaved: false,
  isCardModalOpen: false,
  isYapeModalOpen: false,

  setDeliveryMethod: (method) => set({ deliveryMethod: method, isPaymentDataSaved: false }),
  setPaymentMethod: (method) => set({ paymentMethod: method, isPaymentDataSaved: false }),
  setDeliveryAddress: (address) => set({ deliveryAddress: address }),
  setSelectedStore: (store) => set({ selectedStore: store }),
  setCardData: (data) => set({ cardData: data, isPaymentDataSaved: true }),
  setYapePhone: (phone) => set({ yapePhone: phone, isPaymentDataSaved: true }),
  setIsPaymentDataSaved: (v) => set({ isPaymentDataSaved: v }),

  openCardModal: () => set({ isCardModalOpen: true }),
  closeCardModal: () => set({ isCardModalOpen: false }),
  openYapeModal: () => set({ isYapeModalOpen: true }),
  closeYapeModal: () => set({ isYapeModalOpen: false }),
}));

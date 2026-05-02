import { create } from 'zustand';

export interface PendingRequest {
  id: string;
  businessName: string;
  userName: string;
  userEmail: string;
}

interface NotificationStore {
  pendingCount: number;
  pendingRequests: PendingRequest[];
  setPendingCount: (count: number) => void;
  setPendingRequests: (requests: PendingRequest[]) => void;
  decrement: (id: string) => void;
}

export const useSellerRequestsStore = create<NotificationStore>((set) => ({
  pendingCount: 0,
  pendingRequests: [],
  setPendingCount: (count) => set({ pendingCount: count }),
  setPendingRequests: (requests) =>
    set({ pendingRequests: requests, pendingCount: requests.length }),
  decrement: (id) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== id),
      pendingCount: Math.max(0, state.pendingCount - 1),
    })),
}));

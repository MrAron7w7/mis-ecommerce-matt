// components/admin/seller-requests-provider.tsx
'use client';

import { useEffect } from 'react';
import { useSellerRequestsStore, PendingRequest } from '@/store/notification-store';

interface Props {
  initialCount: number;
  initialRequests: PendingRequest[];
}

export function SellerRequestsProvider({ initialCount, initialRequests }: Props) {
  const setPendingCount = useSellerRequestsStore((s) => s.setPendingCount);
  const setPendingRequests = useSellerRequestsStore((s) => s.setPendingRequests);

  useEffect(() => {
    setPendingCount(initialCount);
    setPendingRequests(initialRequests);
  }, [initialCount, initialRequests, setPendingCount, setPendingRequests]);

  return null;
}

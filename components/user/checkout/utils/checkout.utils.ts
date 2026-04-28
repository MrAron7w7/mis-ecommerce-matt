import { CheckoutItem, DeliveryMethod, OrderTotals } from '../types/checkout.types';

export const DELIVERY_COST = 15;

export function calcSubtotal(items: CheckoutItem[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}

export function calcDeliveryCost(method: DeliveryMethod): number {
  return method === 'delivery' ? DELIVERY_COST : 0;
}

export function calcTotal(subtotal: number, deliveryCost: number): number {
  return subtotal + deliveryCost;
}

export function calcOrderTotals(items: CheckoutItem[], method: DeliveryMethod): OrderTotals {
  const subtotal = calcSubtotal(items);
  const deliveryCost = calcDeliveryCost(method);
  const total = calcTotal(subtotal, deliveryCost);
  return { subtotal, deliveryCost, total };
}

export function formatPrice(amount: number): string {
  return `S/ ${amount.toFixed(2)}`;
}

/**
 * Utility functions for prices, discounts, and currency formatting
 */

export function calculateDiscountedPrice(basePrice: number, discountPercentage?: number): number {
  if (!discountPercentage || discountPercentage <= 0) {
    return Math.max(0, Math.round(basePrice));
  }
  const discount = Math.min(100, Math.max(0, discountPercentage));
  const calculated = basePrice * (1 - discount / 100);
  return Math.max(0, Math.round(calculated));
}

export function formatPrice(amount: number, currency: string = '₹'): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currency} 0`;
  }
  return `${currency} ${amount.toLocaleString('en-IN')}`;
}

export function calculateSavings(originalPrice: number, finalPrice: number): number {
  if (!originalPrice || originalPrice <= finalPrice) return 0;
  return Math.max(0, Math.round(originalPrice - finalPrice));
}

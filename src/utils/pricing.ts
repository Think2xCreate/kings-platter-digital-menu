import { FoodItem, FoodVariant } from '../types/menu';

/**
 * Utility functions for prices, discounts, offers, and currency formatting
 */

export function calculateOfferPrice(
  originalPrice: number,
  offerType?: 'PERCENTAGE' | 'FIXED',
  offerValue?: number,
  discountPercentage?: number
): number {
  if (isNaN(originalPrice) || originalPrice <= 0) return 0;

  // Determine discount type and value
  const type = offerType || 'PERCENTAGE';
  const val = offerValue !== undefined && offerValue !== null ? offerValue : discountPercentage || 0;

  if (val <= 0) {
    return Math.max(0, Math.round(originalPrice));
  }

  let finalPrice = originalPrice;
  if (type === 'PERCENTAGE') {
    const validPct = Math.min(100, Math.max(0, val));
    finalPrice = originalPrice * (1 - validPct / 100);
  } else if (type === 'FIXED') {
    const validFixed = Math.min(originalPrice, Math.max(0, val));
    finalPrice = originalPrice - validFixed;
  }

  return Math.max(0, Math.round(finalPrice));
}

export function calculateDiscountedPrice(basePrice: number, discountPercentage?: number): number {
  return calculateOfferPrice(basePrice, 'PERCENTAGE', discountPercentage, discountPercentage);
}

export function isOfferValid(item: FoodItem | null | undefined): boolean {
  if (!item) return false;

  // Explicit offer toggle or legacy discount check
  const offerEnabled = item.offerEnabled !== false && (item.offerEnabled || (!!item.discountPercentage && item.discountPercentage > 0) || (!!item.offerValue && item.offerValue > 0));

  if (!offerEnabled) return false;

  const val = item.offerValue !== undefined && item.offerValue !== null ? item.offerValue : item.discountPercentage || 0;
  if (val <= 0) return false;

  // Percentage validation (0 < val <= 100)
  const type = item.offerType || 'PERCENTAGE';
  if (type === 'PERCENTAGE' && val > 100) return false;

  // Single price vs Variants check
  const baseP = item.originalPrice || item.price || 0;
  if (baseP > 0) {
    const calc = calculateOfferPrice(baseP, type, val);
    if (calc < baseP && calc >= 0) return true;
  }

  if (item.vegPrice && item.vegPrice > 0) {
    const calc = calculateOfferPrice(item.vegPrice, type, val);
    if (calc < item.vegPrice && calc >= 0) return true;
  }

  if (item.nonVegPrice && item.nonVegPrice > 0) {
    const calc = calculateOfferPrice(item.nonVegPrice, type, val);
    if (calc < item.nonVegPrice && calc >= 0) return true;
  }

  if (item.variants && item.variants.length > 0) {
    const validVariantOffer = item.variants.some((v) => {
      if (v.price && v.price > 0) {
        const calc = calculateOfferPrice(v.price, type, val);
        return calc < v.price && calc >= 0;
      }
      return false;
    });
    if (validVariantOffer) return true;
  }

  return false;
}

export interface CalculatedPricingResult {
  hasOffer: boolean;
  offerLabel: string;
  originalPrice: number;
  finalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  variants: {
    id: string;
    label: string;
    originalPrice: number;
    finalPrice: number;
  }[];
}

export function calculateFoodPricing(item: FoodItem): CalculatedPricingResult {
  const hasOffer = isOfferValid(item);
  const type = item.offerType || 'PERCENTAGE';
  const val = item.offerValue !== undefined && item.offerValue !== null ? item.offerValue : item.discountPercentage || 0;

  const offerLabel = hasOffer
    ? type === 'PERCENTAGE'
      ? `${val}% OFF`
      : `₹${val} OFF`
    : '';

  const basePrice = item.originalPrice || item.price || 0;
  const finalPrice = hasOffer ? calculateOfferPrice(basePrice, type, val) : item.finalPrice || basePrice;

  const discountAmount = hasOffer ? Math.max(0, basePrice - finalPrice) : 0;
  const discountPercentage = hasOffer && basePrice > 0 ? Math.round((discountAmount / basePrice) * 100) : 0;

  const variants = (item.variants || []).map((v) => ({
    id: v.id,
    label: v.label,
    originalPrice: v.price,
    finalPrice: hasOffer ? calculateOfferPrice(v.price, type, val) : v.price,
  }));

  return {
    hasOffer,
    offerLabel,
    originalPrice: basePrice,
    finalPrice,
    discountPercentage,
    discountAmount,
    variants,
  };
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

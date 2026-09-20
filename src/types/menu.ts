export interface BusinessProfile {
  id: string;
  name: string;
  subName: string;
  tagline: string;
  description?: string;
  location: string;
  address: string;
  phone: string;
  email?: string;
  logoUrl?: string;
  logoStorageKey?: string;
  whatsapp?: string;
  whatsappNumber?: string;
  mapUrl: string;
  openingHours: string;
  openingTime?: string;
  closingTime?: string;
  workingDays?: string;
  currency: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  googleReviewUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DietaryType = 'veg' | 'non-veg' | 'egg' | 'vegan';

export type PricingType = 'SINGLE_PRICE' | 'VEG_NON_VEG' | 'PORTION' | 'CUSTOM_VARIANTS';

export interface FoodVariant {
  id: string;
  label: string;
  price: number;
}

export interface FoodItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  description: string;
  price: number;
  pricingType?: PricingType;
  vegPrice?: number;
  nonVegPrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  offerType?: 'PERCENTAGE' | 'FIXED';
  offerValue?: number;
  offerEnabled?: boolean;
  finalPrice: number;
  imageUrl: string;
  imageStorageKey?: string;
  isAvailable: boolean;
  dietary: DietaryType;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  displayOrder: number;
  variants?: FoodVariant[];
  prepTimeMinutes?: number;
  spicyLevel?: 0 | 1 | 2 | 3; // 0: None, 1: Mild, 2: Medium, 3: Hot
  tags?: string[];
  allergens?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  iconName: string;
  imageUrl?: string;
  imageStorageKey?: string;
  description?: string;
  defaultPricingType?: PricingType;
  displayOrder: number;
  isActive: boolean;
  itemCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type DietaryFilter = 'all' | 'offers' | 'veg' | 'non-veg' | 'popular' | 'special';

export interface AdminUser {
  uid: string;
  id?: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Admin';
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

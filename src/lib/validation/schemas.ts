import { z } from 'zod';

export const CategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().optional(),
  iconName: z.string().default('Soup'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  description: z.string().max(500).optional(),
  displayOrder: z.number().int().nonnegative().default(1),
  isActive: z.boolean().default(true),
});

export const FoodItemSchema = z.object({
  categoryId: z.string().min(1, 'Category selection is required'),
  categoryName: z.string().optional(),
  name: z.string().min(1, 'Food item name is required').max(150),
  description: z.string().max(1000).default(''),
  price: z.number().positive('Price must be greater than zero'),
  originalPrice: z.number().nonnegative().optional(),
  discountPercentage: z.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot exceed 100%').default(0),
  imageUrl: z.string().default('/default-fallback_image.webp'),
  isAvailable: z.boolean().default(true),
  dietary: z.enum(['veg', 'non-veg', 'egg', 'vegan']).default('non-veg'),
  isPopular: z.boolean().default(false),
  isChefSpecial: z.boolean().default(false),
  displayOrder: z.number().int().nonnegative().default(1),
  variants: z.array(
    z.object({
      id: z.string(),
      label: z.string().min(1),
      price: z.number().positive(),
    })
  ).optional(),
  prepTimeMinutes: z.number().int().nonnegative().optional(),
  spicyLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
  tags: z.array(z.string()).optional(),
  allergens: z.array(z.string()).optional(),
});

export const BusinessProfileSchema = z.object({
  name: z.string().min(1, 'Restaurant name is required'),
  subName: z.string().default('RESTAURANT & CAFE'),
  tagline: z.string().default('Great Food | Royal Experience'),
  location: z.string().min(1, 'Location is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(5, 'Valid phone number is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  whatsapp: z.string().optional().or(z.literal('')),
  mapUrl: z.string().default(''),
  openingHours: z.string().default('11:30 AM - 11:00 PM'),
  currency: z.string().default('₹'),
  instagram: z.string().optional().or(z.literal('')),
  facebook: z.string().optional().or(z.literal('')),
  website: z.string().optional().or(z.literal('')),
  logoUrl: z.string().optional().or(z.literal('')),
  googleReviewUrl: z.string().optional().or(z.literal('')),
});

export const AdminAuthSchema = z.object({
  identifier: z.string().min(3, 'Email or username is required'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

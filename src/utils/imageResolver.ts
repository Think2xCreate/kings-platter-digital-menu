export const DEFAULT_FALLBACK_IMAGE = '/default-fallback_image.webp';
export const DEFAULT_LOGO_IMAGE = '/kings_platter_logo.jpg';

/**
 * Production-safe Central Image Resolver.
 * Accepts any image URL string and returns the approved production image URL.
 * 
 * Rules:
 * 1. If imageUrl is missing, empty, or whitespace -> return DEFAULT_FALLBACK_IMAGE
 * 2. If imageUrl is an Unsplash URL, remote placeholder, or legacy external domain -> return DEFAULT_FALLBACK_IMAGE
 * 3. If imageUrl is an approved Supabase Storage public URL -> return imageUrl
 * 4. If imageUrl is a recognized local public asset (e.g. logo/fallback) -> return imageUrl
 * 5. Otherwise -> return DEFAULT_FALLBACK_IMAGE
 */
export function resolveImageUrl(imageUrl?: string | null, fallback: string = DEFAULT_FALLBACK_IMAGE): string {
  if (!imageUrl || typeof imageUrl !== 'string') {
    return fallback;
  }

  const trimmed = imageUrl.trim();
  if (trimmed === '') {
    return fallback;
  }

  // Allowed local static public assets
  if (trimmed === DEFAULT_FALLBACK_IMAGE || trimmed === DEFAULT_LOGO_IMAGE) {
    return trimmed;
  }

  // Reject Unsplash, Pexels, and generic remote placeholder domains
  if (
    trimmed.includes('unsplash.com') ||
    trimmed.includes('pexels.com') ||
    trimmed.includes('placeholder.com') ||
    trimmed.includes('via.placeholder') ||
    trimmed.includes('picsum.photos')
  ) {
    return fallback;
  }

  // Approved Supabase Storage public URLs
  if (trimmed.includes('supabase.co/storage/v1/object/public/') || trimmed.includes('/storage/v1/object/public/')) {
    return trimmed;
  }

  // If environment variable NEXT_PUBLIC_SUPABASE_URL is set, check match
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (supabaseUrl && trimmed.startsWith(supabaseUrl)) {
    return trimmed;
  }

  // If string starts with http/https but isn't Supabase, reject in production
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return fallback;
  }

  return fallback;
}

/**
 * Resolves business logo image safely.
 */
export function resolveLogoUrl(logoUrl?: string | null): string {
  return resolveImageUrl(logoUrl, DEFAULT_LOGO_IMAGE);
}

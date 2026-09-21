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

  // Allowed local static public assets (paths starting with '/')
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
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

/**
 * Extracts an 11-character YouTube video ID from various YouTube URL formats.
 * Formats supported: watch?v=, youtu.be/, /embed/, /shorts/
 */
export function extractYouTubeId(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  const match = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (match && match[1]) {
    return match[1];
  }
  // If user pasted just an 11-character alphanumeric video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

export interface NormalizedYouTubeResult {
  isValid: boolean;
  videoId: string | null;
  normalizedUrl: string | null;
  error?: string;
}

/**
 * Validates and normalizes YouTube video URLs or IDs.
 */
export function normalizeYouTubeVideoUrl(url?: string | null): NormalizedYouTubeResult {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { isValid: true, videoId: null, normalizedUrl: null };
  }

  const trimmed = url.trim();
  const videoId = extractYouTubeId(trimmed);

  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return {
      isValid: false,
      videoId: null,
      normalizedUrl: null,
      error: 'Please enter a valid YouTube video URL.',
    };
  }

  return {
    isValid: true,
    videoId,
    normalizedUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

/**
 * Returns a static thumbnail URL for a YouTube video.
 */
export function getYouTubeThumbnail(videoId: string, quality: 'hq' | 'maxres' = 'hq'): string {
  const filename = quality === 'maxres' ? 'maxresdefault.jpg' : 'hqdefault.jpg';
  return `https://img.youtube.com/vi/${videoId}/${filename}`;
}

export interface VideoSourceInfo {
  type: 'youtube' | 'direct' | null;
  url: string;
  youtubeId?: string;
  thumbnailUrl?: string;
}

/**
 * Production-safe Video Source Resolver.
 * Resolves canonical YouTube video IDs/URLs into iframe embed URLs.
 */
export function resolveVideoSource(videoInput?: string | null, legacyUrl?: string | null): VideoSourceInfo {
  const input = (videoInput || legacyUrl || '').trim();
  if (!input) {
    return { type: null, url: '' };
  }

  // 1. Check YouTube ID or YouTube URL
  const ytId = extractYouTubeId(input);
  if (ytId) {
    return {
      type: 'youtube',
      url: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&loop=1&playlist=${ytId}&cc_load_policy=0&autohide=1`,
      youtubeId: ytId,
      thumbnailUrl: getYouTubeThumbnail(ytId),
    };
  }

  // Reject Vimeo, Unsplash, Pexels, and generic invalid URLs
  if (
    input.includes('vimeo.com') ||
    input.includes('unsplash.com') ||
    input.includes('pexels.com')
  ) {
    return { type: null, url: '' };
  }

  // 2. Local static public asset
  if (input.startsWith('/') && !input.startsWith('//')) {
    return { type: 'direct', url: input };
  }

  // 3. Approved Supabase Storage public URL
  if (input.includes('supabase.co/storage/v1/object/public/') || input.includes('/storage/v1/object/public/')) {
    return { type: 'direct', url: input };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (supabaseUrl && input.startsWith(supabaseUrl)) {
    return { type: 'direct', url: input };
  }

  // If HTTP/HTTPS URL ending in video extension (.mp4, .webm, .mov)
  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(input)) {
    return { type: 'direct', url: input };
  }

  return { type: null, url: '' };
}

/**
 * Production-safe Video URL Resolver (legacy compatibility wrapper).
 */
export function resolveVideoUrl(videoUrl?: string | null): string | null {
  const info = resolveVideoSource(videoUrl);
  return info.type ? info.url : null;
}




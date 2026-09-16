import sharp from 'sharp';

export interface ImageProcessingOptions {
  buffer: Buffer;
  mimeType: string;
  originalName: string;
  folder: 'business' | 'categories' | 'food-items' | string;
}

export interface ProcessedImageResult {
  buffer: Buffer;
  mimeType: 'image/webp';
  filename: string;
  width?: number;
  height?: number;
  sizeBytes: number;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const MAX_SIZE_LIMITS: Record<string, number> = {
  business: 2 * 1024 * 1024,   // 2MB for business logo
  categories: 3 * 1024 * 1024, // 3MB for category images
  'food-items': 5 * 1024 * 1024, // 5MB for food item images
  menu: 5 * 1024 * 1024,
};

/**
 * Validates uploaded image format & size, then converts JPG/PNG/WebP into optimized WebP buffer.
 */
export async function processAndConvertToWebP({
  buffer,
  mimeType,
  originalName,
  folder,
}: ImageProcessingOptions): Promise<ProcessedImageResult> {
  const cleanMime = mimeType.toLowerCase();

  // 1. Strict MIME type validation
  if (!ALLOWED_MIME_TYPES.includes(cleanMime)) {
    throw new Error('Invalid file format. Only JPG, PNG, and WebP images are allowed.');
  }

  // 2. Folder-specific size limit validation
  const maxAllowedSize = MAX_SIZE_LIMITS[folder] || 5 * 1024 * 1024;
  if (buffer.length > maxAllowedSize) {
    const limitMB = Math.round(maxAllowedSize / (1024 * 1024));
    throw new Error(`Image size exceeds the allowed limit of ${limitMB}MB.`);
  }

  // 3. Process & Convert to WebP using Sharp
  const sharpInstance = sharp(buffer);
  const metadata = await sharpInstance.metadata();

  if (!metadata.format) {
    throw new Error('Failed to parse image file data.');
  }

  let pipeline = sharpInstance;
  if (metadata.width && metadata.width > 1920) {
    pipeline = pipeline.resize({ width: 1920, fit: 'inside', withoutEnlargement: true });
  }

  const webpBuffer = await pipeline
    .webp({
      quality: 80,
      effort: 4,
    })
    .toBuffer();

  const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const cleanBaseName = originalName
    .split('.')[0]
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-');
  const filename = `${folder}/${uniqueId}-${cleanBaseName || 'image'}.webp`;

  return {
    buffer: webpBuffer,
    mimeType: 'image/webp',
    filename,
    width: metadata.width,
    height: metadata.height,
    sizeBytes: webpBuffer.length,
  };
}

import { adminAuth } from '../services/adminAuth';

/**
 * Uploads an image file to the Next.js /api/upload endpoint,
 * which validates format (.jpg, .png, .webp), converts to lightweight .webp,
 * and stores it in the Supabase Storage bucket.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: 'business' | 'categories' | 'food-items' = 'food-items'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const token = adminAuth.getStoredToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers,
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok || !resData.success) {
    throw new Error(resData.error?.message || 'Failed to upload image.');
  }

  return resData.data.url;
}

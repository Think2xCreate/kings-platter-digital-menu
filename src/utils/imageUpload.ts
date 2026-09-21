import { adminAuth } from '../services/adminAuth';

export interface UploadResult {
  url: string;
  path: string;
}

export interface ReplaceImageOptions {
  newFile: File;
  folder?: 'business' | 'categories' | 'food-items';
  oldStorageKey?: string | null;
}

/**
 * Uploads an image file to Next.js /api/upload endpoint.
 * Validates format, converts to WebP, and uploads to Supabase Storage.
 */
export async function uploadImageToSupabase(
  file: File,
  folder: 'business' | 'categories' | 'food-items' = 'food-items'
): Promise<UploadResult> {
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

  let resData: any;
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    try {
      resData = await response.json();
    } catch {
      throw new Error('Image upload server returned invalid data. Please try again.');
    }
  } else {
    // Response is non-JSON (e.g. HTML 404/500 page from platform/router)
    if (response.status === 413) {
      throw new Error('Image file size is too large for the server limit.');
    }
    if (response.status === 401) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    throw new Error('Unable to upload the image. Please try again.');
  }

  if (!response.ok || !resData.success) {
    throw new Error(resData.error?.message || 'Unable to upload the image. Please try again.');
  }

  return {
    url: resData.data.url,
    path: resData.data.path || '',
  };
}


/**
 * Safely deletes an old image object from Supabase Storage by its storage key.
 */
export async function deleteImageFromSupabase(storageKey?: string | null): Promise<boolean> {
  if (!storageKey || typeof storageKey !== 'string' || !storageKey.trim()) {
    return true;
  }

  const token = adminAuth.getStoredToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`/api/storage/delete?storageKey=${encodeURIComponent(storageKey.trim())}`, {
      method: 'DELETE',
      headers,
    });
    const resData = await res.json();
    return res.ok && resData.success;
  } catch (err) {
    console.warn('Failed to delete old Supabase image:', err);
    return false;
  }
}

/**
 * Safely replaces an existing storage image.
 * Uploads NEW image first, verifies success, and deletes old object after Firestore update succeeds.
 */
export async function replaceStorageImage(options: ReplaceImageOptions): Promise<UploadResult> {
  const { newFile, folder = 'food-items', oldStorageKey } = options;

  // 1. Upload new image to Supabase
  const uploadRes = await uploadImageToSupabase(newFile, folder);

  // Return new upload info. The caller should update Firestore next,
  // then call deleteImageFromSupabase(oldStorageKey) upon successful save.
  return uploadRes;
}


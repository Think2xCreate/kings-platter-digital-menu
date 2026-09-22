export type AppErrorCode =
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'SESSION_EXPIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UPLOAD_ERROR'
  | 'DATABASE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface SafeAppError {
  code: AppErrorCode;
  message: string;
}

/**
 * Maps raw system, database, authentication, or validation errors into safe application errors.
 * Ensures technical internals (e.g. FirebaseError, Supabase error, Zod stack, internal SQL/Firestore paths)
 * are NEVER exposed directly to users.
 */
export function mapErrorToAppError(
  error: unknown,
  fallbackMessage = 'Something went wrong. Please try again.'
): SafeAppError {
  // Safe logging on server side for developer diagnostics
  if (typeof window === 'undefined') {
    console.error('[SERVER_ERROR_DIAGNOSTIC]', {
      timestamp: new Date().toISOString(),
      rawError: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    });
  }

  if (!error) {
    return { code: 'UNKNOWN_ERROR', message: fallbackMessage };
  }

  let rawMessage = fallbackMessage;
  if (error instanceof Error) {
    rawMessage = error.message;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    rawMessage = String((error as { message: unknown }).message);
  } else if (error) {
    rawMessage = String(error);
  }

  // 1. Session & Auth Expired
  if (
    rawMessage.includes('SESSION_EXPIRED') ||
    rawMessage.includes('auth/id-token-expired') ||
    rawMessage.includes('auth/user-not-found') ||
    rawMessage.includes('token expired') ||
    rawMessage.includes('jwt expired') ||
    rawMessage.includes('401')
  ) {
    return {
      code: 'SESSION_EXPIRED',
      message: 'Your session has expired. Please sign in again.',
    };
  }

  // 2. Permission / Forbidden
  if (
    rawMessage.includes('PERMISSION_DENIED') ||
    rawMessage.includes('insufficient permissions') ||
    rawMessage.includes('FORBIDDEN') ||
    rawMessage.includes('403')
  ) {
    return {
      code: 'FORBIDDEN',
      message: "You don't have permission to perform this action.",
    };
  }

  // 3. Validation Errors
  if (
    rawMessage.includes('dietary type') ||
    rawMessage.includes('words or fewer') ||
    rawMessage.includes('VALIDATION_ERROR')
  ) {
    return {
      code: 'VALIDATION_ERROR',
      message: rawMessage.includes('ZodError') ? 'Please check the highlighted fields.' : rawMessage,
    };
  }

  // 4. Storage / Upload
  if (
    rawMessage.includes('Bucket not found') ||
    rawMessage.includes('Supabase') ||
    rawMessage.includes('upload') ||
    rawMessage.includes('storage') ||
    rawMessage.includes('UPLOAD_ERROR')
  ) {
    return {
      code: 'UPLOAD_ERROR',
      message: 'Image upload failed. Please try again.',
    };
  }

  // 5. Database / Firestore
  if (
    rawMessage.includes('FirestoreError') ||
    rawMessage.includes('FirebaseAdmin') ||
    rawMessage.includes('DATABASE_ERROR')
  ) {
    return {
      code: 'DATABASE_ERROR',
      message: "We couldn't save your changes. Please try again.",
    };
  }

  // 6. Network Errors
  if (
    rawMessage.includes('Failed to fetch') ||
    rawMessage.includes('NetworkError') ||
    rawMessage.includes('NETWORK_ERROR')
  ) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Please check your connection and try again.',
    };
  }

  // 7. Not Found
  if (rawMessage.includes('NOT_FOUND') || rawMessage.includes('not found')) {
    return {
      code: 'NOT_FOUND',
      message: "We couldn't find that information.",
    };
  }

  // Default Fallback
  return {
    code: 'UNKNOWN_ERROR',
    message: fallbackMessage,
  };
}

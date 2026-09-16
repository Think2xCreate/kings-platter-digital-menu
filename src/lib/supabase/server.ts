import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Verifies whether Supabase server-only environment variables are configured.
 */
export function hasSupabaseCredentials(): boolean {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && serviceKey);
}

/**
 * Returns a server-only Supabase client powered by SUPABASE_SERVICE_ROLE_KEY.
 * NEVER import this module into client components or browser bundles.
 */
export function getServerSupabaseClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

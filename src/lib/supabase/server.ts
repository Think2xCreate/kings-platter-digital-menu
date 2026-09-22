import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getCleanEnvVar(val: string | undefined): string | undefined {
  if (!val) return undefined;
  let clean = val.trim();
  if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
    clean = clean.slice(1, -1).trim();
  }
  return clean || undefined;
}

/**
 * Verifies whether Supabase server-only environment variables are configured.
 */
export function hasSupabaseCredentials(): boolean {
  const url = getCleanEnvVar(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = getCleanEnvVar(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_KEY
  );
  return Boolean(url && serviceKey);
}

/**
 * Returns a server-only Supabase client powered by SUPABASE_SERVICE_ROLE_KEY.
 * NEVER import this module into client components or browser bundles.
 */
export function getServerSupabaseClient(): SupabaseClient | null {
  const url = getCleanEnvVar(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceKey = getCleanEnvVar(
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_KEY
  );

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

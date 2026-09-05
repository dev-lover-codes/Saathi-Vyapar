/**
 * server.ts
 * Server-only Supabase client using the service role key.
 * This bypasses Row Level Security — only use in trusted server-side contexts (API routes, Server Components).
 * NEVER expose this client to the browser.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-role-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    console.warn('⚠️ Supabase server environment variables are missing.');
  }
}

/**
 * Server-side Supabase admin client.
 * Has full database access — bypasses RLS policies.
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // Service role clients should not persist sessions
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});


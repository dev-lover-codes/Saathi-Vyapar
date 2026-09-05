/**
 * client.ts
 * Browser-safe Supabase client using the anonymous (public) key.
 * This client is subject to Row Level Security policies.
 * Safe to use in Client Components ('use client').
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    console.warn('⚠️ Supabase client environment variables are missing.');
  }
}

/**
 * Browser Supabase client.
 * Respects RLS policies. Use for all client-side data access.
 */
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});


'use client';

/**
 * src/app/login/LoginForm.tsx
 *
 * Client Component: Sign in with Google using Supabase Auth.
 * Handles OAuth redirection, loading states, and active session detection.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user already has an active session
    async function checkExistingSession() {
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch {
        // Ignore session read errors
      }
    }

    checkExistingSession();

    // Listen for auth state changes (e.g. redirect callback with token)
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/dashboard');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError('');

    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { error: authError } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to initiate Google sign-in. Please try again.'
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#081726] rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700/80">
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start gap-2.5">
          <span className="text-base shrink-0">⚠️</span>
          <div className="flex-1">
            <div className="font-semibold">Login Error</div>
            <div className="mt-0.5 text-red-300/90">{error}</div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white hover:bg-slate-100 active:bg-slate-200 disabled:opacity-75 disabled:cursor-not-allowed text-slate-800 font-semibold py-3.5 px-4 rounded-xl text-sm sm:text-base transition-all duration-150 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A24B] focus:ring-offset-2 focus:ring-offset-[#081726]"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              {/* Google 4-color SVG Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google से साइन इन करें • Sign in with Google</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 pt-2 leading-relaxed">
          Google खाते से सुरक्षित लॉगिन करें। आपकी व्यक्तिगत जानकारी पूर्णतः सुरक्षित रहती है।
        </p>
      </div>
    </div>
  );
}

'use client';

/**
 * src/app/login/LoginForm.tsx
 *
 * Client Component: Sign in with Google using Supabase Auth.
 * Includes hover/press micro-animations, loading indicators, and session sync.
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
        // Ignore session check errors
      }
    }

    checkExistingSession();

    // Listen for auth state changes
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
          : 'Unable to connect to Google authentication. Please try again.'
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm">
          <span className="text-base shrink-0">⚠️</span>
          <div className="flex-1">
            <span className="font-semibold">Authentication Error:</span> {error}
          </div>
        </div>
      )}

      {/* Google Sign-in Button with Scale + Shadow Shift Micro-Animation */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full relative group flex items-center justify-center gap-3.5 bg-white text-slate-800 font-semibold py-4 px-6 rounded-2xl border border-slate-300/80 shadow-md hover:border-[#C9A24B] hover:shadow-[0_12px_28px_-6px_rgba(201,162,75,0.3)] hover:scale-[1.02] active:scale-[0.98] active:shadow-sm transition-all duration-200 ease-out cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-slate-700"
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
            <span className="text-sm font-medium text-slate-700">Connecting to Google...</span>
          </>
        ) : (
          <>
            {/* Google Logo */}
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
            <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-slate-950 transition-colors">
              Sign in with Google
            </span>
          </>
        )}
      </button>

      {/* Vernacular secondary hint */}
      <div className="mt-4 text-center">
        <span className="text-xs text-slate-500 font-medium">
          Google से सुरक्षित लॉगिन • Instant Access
        </span>
      </div>
    </div>
  );
}

'use client';

/**
 * src/app/login/LoginForm.tsx
 *
 * Client Component: Supports dual authentication methods:
 * 1. Sign in with Google (OAuth)
 * 2. Login & Sign up with Email and Password
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';

type AuthMode = 'signin' | 'signup';

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if user already has an active session
    async function checkExistingSession() {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch {
        // Ignore session read error
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

  // Google OAuth Sign-in
  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    setError('');
    setSuccessMessage('');

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
        setIsGoogleLoading(false);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to Google authentication. Please try again.'
      );
      setIsGoogleLoading(false);
    }
  }

  // Email & Password Auth (Sign In or Sign Up)
  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      if (mode === 'signin') {
        // Sign In with Email & Password
        const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          setSuccessMessage('Login successful! Redirecting...');
          router.push('/dashboard');
          router.refresh();
        }
      } else {
        // Sign Up with Email & Password
        const redirectUrl =
          typeof window !== 'undefined'
            ? `${window.location.origin}/auth/callback`
            : undefined;

        const { data, error: signUpError } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim() || email.split('@')[0],
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          setIsLoading(false);
          return;
        }

        if (data.session) {
          setSuccessMessage('Account created successfully! Redirecting...');
          router.push('/dashboard');
          router.refresh();
        } else if (data.user) {
          setSuccessMessage(
            'Account created! Please check your email for a confirmation link to complete sign-in.'
          );
          setIsLoading(false);
        }
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred during authentication.'
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full">
      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm">
          <span className="text-base shrink-0">⚠️</span>
          <div className="flex-1">
            <span className="font-semibold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-sm">
          <span className="text-base shrink-0">✅</span>
          <div className="flex-1">
            <span className="font-semibold">Success:</span> {successMessage}
          </div>
        </div>
      )}

      {/* ── Method 1: Sign in with Google ── */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full relative group flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold py-3.5 px-5 rounded-2xl border border-slate-300/80 shadow-sm hover:border-[#C9A24B] hover:shadow-[0_10px_25px_-4px_rgba(201,162,75,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isGoogleLoading ? (
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
            <span className="text-sm font-semibold text-slate-800">
              Sign in with Google
            </span>
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300/80" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#FAF8F3] px-3 text-slate-500 font-semibold tracking-wider">
            or continue with email
          </span>
        </div>
      </div>

      {/* ── Method 2: Email and Password ── */}
      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-xl mb-5 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setError('');
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'signin'
              ? 'bg-white text-[#0B1E33] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign In (लॉगिन)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setError('');
          }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            mode === 'signup'
              ? 'bg-white text-[#0B1E33] shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign Up (खाता बनाएं)
        </button>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Full Name (नाम)
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Kumar"
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-all shadow-inner"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Email Address (ईमेल)
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-all shadow-inner"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
            >
              Password (पासवर्ड)
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-all shadow-inner"
          />
          {mode === 'signup' && (
            <p className="text-[11px] text-slate-500 mt-1">
              Minimum 6 characters
            </p>
          )}
        </div>

        {/* Submit Button with Hover & Press Micro-Animation */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full mt-2 py-3 px-5 rounded-xl font-bold text-sm bg-[#0B1E33] hover:bg-[#122b47] active:bg-[#071320] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
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
              <span>Processing...</span>
            </>
          ) : (
            <span>
              {mode === 'signin' ? 'लॉगिन करें • Sign In' : 'खाता बनाएं • Create Account'}
            </span>
          )}
        </button>
      </form>
    </div>
  );
}

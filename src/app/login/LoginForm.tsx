'use client';

/**
 * src/app/login/LoginForm.tsx
 *
 * Single-screen dual authentication form:
 * 1. Email & Password with two direct action buttons: "Sign In" and "Create Account"
 * 2. Visual divider ("or")
 * 3. "Sign in with Google" OAuth button
 *
 * Handles email confirmation callback notices (?confirmed=true) and displays
 * friendly plain-language status messages.
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Derive message states directly from search params without setState in useEffect
  const isConfirmed = searchParams.get('confirmed') === 'true';
  const authError = searchParams.get('error');

  const urlErrorMessage =
    authError === 'confirmation_failed'
      ? 'The confirmation link is invalid or has expired. Please sign up again or request a new link.'
      : authError === 'auth_failed'
        ? 'Authentication failed. Please try signing in again.'
        : '';

  const urlSuccessMessage = isConfirmed
    ? 'Email confirmed successfully! You can now sign in with your email and password.'
    : '';

  const activeError = error || urlErrorMessage;
  const activeSuccess = successMessage || urlSuccessMessage;

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
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      // Only redirect on SIGNED_IN event
      if (event === 'SIGNED_IN' && session) {
        router.push('/dashboard');
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  /**
   * Translates raw Supabase and network errors into clear, friendly language.
   */
  function formatErrorMessage(err: unknown): string {
    if (!err) return 'An unexpected error occurred. Please try again.';
    const message = (
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : (err as { message?: string }).message || ''
    ).toLowerCase();

    if (
      message.includes('invalid login credentials') ||
      message.includes('invalid_grant') ||
      message.includes('invalid username or password')
    ) {
      return 'Incorrect email or password. Please double check your details and try again.';
    }

    if (
      message.includes('user already registered') ||
      message.includes('already exists') ||
      message.includes('duplicate')
    ) {
      return 'An account with this email address already exists. Please click "Sign In" instead.';
    }

    if (message.includes('email not confirmed')) {
      return 'Your email address has not been confirmed yet. Please check your inbox for the confirmation link.';
    }

    if (
      message.includes('password should be at least 6') ||
      message.includes('weak_password') ||
      message.includes('password must be at least 6')
    ) {
      return 'Password must be at least 6 characters long. Please choose a longer password.';
    }

    if (
      message.includes('invalid email') ||
      message.includes('unable to validate email') ||
      message.includes('valid email')
    ) {
      return 'Please enter a valid email address (e.g. name@example.com).';
    }

    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'Too many attempts in a short time. Please wait a minute before trying again.';
    }

    if (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('offline')
    ) {
      return 'Unable to reach the server. Please check your internet connection.';
    }

    if (
      message.includes('signup disabled') ||
      message.includes('signups not allowed')
    ) {
      return 'Account registration is currently restricted. Please contact support.';
    }

    // Friendly fallback
    return err instanceof Error
      ? err.message
      : 'Authentication failed. Please verify your details and try again.';
  }

  // 1. Handle Sign In with Email & Password
  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsSignInLoading(true);

    try {
      const { data, error: signInError } =
        await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        setError(formatErrorMessage(signInError));
        setIsSignInLoading(false);
        return;
      }

      if (data.session) {
        setSuccessMessage('Signed in successfully! Redirecting to dashboard...');
        router.push('/dashboard');
        router.refresh();
      } else {
        setIsSignInLoading(false);
      }
    } catch (err) {
      setError(formatErrorMessage(err));
      setIsSignInLoading(false);
    }
  }

  // 2. Handle Create Account with Email & Password
  async function handleSignUp() {
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('Please enter an email address and password to create an account.');
      return;
    }

    if (password.length < 6) {
      setError('Your password must be at least 6 characters long.');
      return;
    }

    setIsSignUpLoading(true);

    try {
      const redirectUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/confirm`
          : undefined;

      const { data, error: signUpError } = await supabaseClient.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: email.split('@')[0],
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        setError(formatErrorMessage(signUpError));
        setIsSignUpLoading(false);
        return;
      }

      // If user created, instruct them to check their email (since account is not usable until confirmed)
      if (data.user) {
        setSuccessMessage(
          'Check your email to confirm your account. Once verified, you can sign in with your email and password.'
        );
      } else {
        setSuccessMessage(
          'Account created! Please check your email to verify your account.'
        );
      }
      setIsSignUpLoading(false);
    } catch (err) {
      setError(formatErrorMessage(err));
      setIsSignUpLoading(false);
    }
  }

  // 3. Handle Google OAuth Sign In
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
        setError(formatErrorMessage(authError));
        setIsGoogleLoading(false);
      }
    } catch (err: unknown) {
      setError(formatErrorMessage(err));
      setIsGoogleLoading(false);
    }
  }

  const isAnyLoading = isSignInLoading || isSignUpLoading || isGoogleLoading;

  return (
    <div className="w-full">
      {/* Error Alert */}
      {activeError && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm">
          <span className="text-base shrink-0">⚠️</span>
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold">Notice:</span> {activeError}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {activeSuccess && (
        <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 shadow-sm">
          <span className="text-base shrink-0">✉️</span>
          <div className="flex-1 leading-relaxed font-medium">
            {activeSuccess}
          </div>
        </div>
      )}

      {/* ── 1. Email & Password Form ── */}
      <form onSubmit={handleSignIn} className="space-y-4">
        {/* Email Input */}
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
            disabled={isAnyLoading}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-all shadow-inner disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
        </div>

        {/* Password Input */}
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
              disabled={isAnyLoading}
              className="text-[11px] text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
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
            autoComplete="current-password"
            disabled={isAnyLoading}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#C9A24B] focus:ring-2 focus:ring-[#C9A24B]/20 transition-all shadow-inner disabled:bg-slate-100 disabled:cursor-not-allowed"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Minimum 6 characters
          </p>
        </div>

        {/* Two Buttons: "Sign In" and "Create Account" */}
        <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Button 1: Sign In */}
          <button
            type="submit"
            disabled={isAnyLoading}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-[#0B1E33] hover:bg-[#132c4a] active:bg-[#071320] text-white shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSignInLoading ? (
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
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In (लॉगिन)</span>
            )}
          </button>

          {/* Button 2: Create Account */}
          <button
            type="button"
            onClick={handleSignUp}
            disabled={isAnyLoading}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-white hover:bg-[#FAF8F3] active:bg-slate-100 text-[#0B1E33] border-2 border-[#0B1E33]/30 hover:border-[#0B1E33] shadow-sm hover:shadow hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSignUpLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-[#0B1E33]"
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
                <span>Creating...</span>
              </>
            ) : (
              <span>Create Account (खाता बनाएं)</span>
            )}
          </button>
        </div>
      </form>

      {/* ── 2. Visual Divider ("or") ── */}
      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-slate-300/80" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3.5 text-slate-500 font-semibold tracking-wider">
            or
          </span>
        </div>
      </div>

      {/* ── 3. Sign in with Google Button ── */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isAnyLoading}
        className="w-full relative group flex items-center justify-center gap-3 bg-white text-slate-800 font-semibold py-3.5 px-5 rounded-2xl border border-slate-300/80 shadow-sm hover:border-[#C9A24B] hover:shadow-[0_10px_25px_-4px_rgba(201,162,75,0.25)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 ease-out cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed disabled:hover:scale-100"
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
    </div>
  );
}

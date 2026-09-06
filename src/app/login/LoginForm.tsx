'use client';

/**
 * src/app/login/LoginForm.tsx
 *
 * Full-screen Dark Navy Authentication Portal matching image copy.png:
 * - Top Header: Handshake 🤝 logo, "साथी व्यापार", "उद्यमी पंजीकरण (Entrepreneur Registration)",
 *   interactive "🎤 बोलकर भरें (Voice Mode)" button, and "लॉगिन / Login" toggle.
 * - Center Card: Deep midnight navy (#0B1528) with crisp blue border (#162D59),
 *   golden step indicator, heading, subtitle, golden progress bar.
 * - Form: Email & Password (Sign In & Sign Up modes) + Google OAuth button.
 * - Bottom Buttons: "← पिछला (Back)" linking to home and "आगे बढ़ें (Next) →" in signature gold.
 * - Footer: "साथी व्यापार • सुरक्षित एवं पारदर्शी ग्रामीण वित्तीय प्रणाली".
 */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignInLoading, setIsSignInLoading] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Read URL query params (?confirmed=true or ?error=...)
  const isConfirmed = searchParams.get('confirmed') === 'true';
  const authError = searchParams.get('error');

  const urlErrorMessage =
    authError === 'confirmation_failed'
      ? 'The confirmation link is invalid or has expired. Please sign up again or request a new link.'
      : authError === 'auth_failed'
        ? 'Authentication failed. Please try signing in again.'
        : '';

  const urlSuccessMessage = isConfirmed
    ? 'ईमेल सफलतापूर्वक सत्यापित हुआ! अब आप लॉगिन कर सकते हैं। (Email confirmed successfully! You can now sign in.)'
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
   * Voice Assistant Narration (Web Speech API)
   */
  function handleToggleVoiceMode() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Voice mode is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const narration =
      mode === 'login'
        ? 'साथी व्यापार में आपका स्वागत है। कृपया अपना ईमेल और पासवर्ड दर्ज करें और आगे बढ़ें, अथवा नीचे दिए गए Google बटन से सीधे प्रवेश करें।'
        : 'साथी व्यापार में आपका स्वागत है। नया उद्यमी खाता बनाने के लिए अपना ईमेल और पासवर्ड दर्ज करें, अथवा Google खाते से सीधे रजिस्टर करें।';

    const utterance = new SpeechSynthesisUtterance(narration);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

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
      return 'अमान्य ईमेल या पासवर्ड। कृपया पुनः प्रयास करें। (Incorrect email or password).';
    }

    if (
      message.includes('user already registered') ||
      message.includes('already exists') ||
      message.includes('duplicate')
    ) {
      return 'इस ईमेल से खाता पहले से मौजूद है। कृपया "लॉगिन करें" चुनें। (Account already exists. Please Sign In).';
    }

    if (message.includes('email not confirmed')) {
      return 'आपका ईमेल अभी सत्यापित नहीं हुआ है। कृपया अपने इनबॉक्स में पुष्टिकरण लिंक देखें। (Email not confirmed yet).';
    }

    if (
      message.includes('password should be at least 6') ||
      message.includes('weak_password') ||
      message.includes('password must be at least 6')
    ) {
      return 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए। (Password must be at least 6 characters).';
    }

    if (
      message.includes('invalid email') ||
      message.includes('unable to validate email') ||
      message.includes('valid email')
    ) {
      return 'कृपया मान्य ईमेल पता दर्ज करें (उदा. name@example.com)। (Please enter a valid email address).';
    }

    if (message.includes('rate limit') || message.includes('too many requests')) {
      return 'बहुत सारे प्रयास किए गए हैं। कृपया कुछ देर प्रतीक्षा करें। (Too many attempts. Please try again in a minute).';
    }

    if (
      message.includes('failed to fetch') ||
      message.includes('network') ||
      message.includes('offline')
    ) {
      return 'सर्वर से संपर्क नहीं हो सका। कृपया इंटरनेट जांचें। (Unable to reach the server. Please check internet connection).';
    }

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
      setError('कृपया ईमेल और पासवर्ड दोनों दर्ज करें। (Please enter both email and password).');
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
        setSuccessMessage('लॉगिन सफल! डैशबोर्ड पर ले जाया जा रहा है... (Signed in successfully!)');
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

  // 2. Handle Sign Up with Email & Password
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setError('कृपया नया खाता बनाने के लिए ईमेल और पासवर्ड दर्ज करें।');
      return;
    }

    if (password.length < 6) {
      setError('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए। (Password must be at least 6 characters).');
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

      if (data.user) {
        setSuccessMessage(
          'खाता बनाया गया! कृपया अपने ईमेल इनबॉक्स में जाकर पुष्टिकरण लिंक पर क्लिक करें। (Account created! Please check your email to confirm).'
        );
      } else {
        setSuccessMessage(
          'खाता सफलतापूर्वक बनाया गया! कृपया ईमेल सत्यापित करें।'
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
    <div className="min-h-screen bg-[#031610] text-[#fdfcf7] flex flex-col justify-between selection:bg-[#10b981] selection:text-[#022c22] relative overflow-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_70%)] blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_70%)] blur-3xl pointer-events-none -z-10" />

      {/* ── Top Header ── */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between">
        {/* Left: Handshake + साथी व्यापार + उद्यमी पंजीकरण */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_12px_rgba(16,185,129,0.5)] transition-transform group-hover:scale-105">
            🤝
          </span>
          <div>
            <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight leading-tight flex items-center gap-2">
              साथी व्यापार
              <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                समृद्धि
              </span>
            </h1>
            <p className="text-emerald-300/80 text-xs sm:text-sm font-semibold tracking-normal">
              उद्यमी पंजीकरण (Entrepreneur Registration)
            </p>
          </div>
        </Link>

        {/* Right: Voice Mode pill + Login / Register switch button */}
        <div className="flex items-center gap-3">
          {/* Voice Mode Button */}
          <button
            type="button"
            onClick={handleToggleVoiceMode}
            className={`cursor-pointer px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-1.5 shadow-[0_2px_15px_rgba(16,185,129,0.3)] active:scale-95 ${
              isSpeaking
                ? 'bg-teal-300 text-emerald-950 ring-4 ring-emerald-400/40 animate-pulse'
                : 'bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-emerald-950'
            }`}
            title="क्लिक करके वॉइस गाइड सुनें (Listen to voice guide)"
          >
            <span>🎤</span>
            <span>बोलकर भरें (Voice Mode)</span>
          </button>

          {/* Login / Sign Up Switcher */}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setError('');
              setSuccessMessage('');
            }}
            className="cursor-pointer bg-[#072b20] hover:bg-[#0c3a2c] border border-[#134e3d] hover:border-emerald-400 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
          >
            {mode === 'login' ? 'नया खाता / Register' : 'लॉगिन / Login'}
          </button>
        </div>
      </header>

      {/* ── Main Center Panel ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-2xl bg-[#06241b]/95 border-2 border-[#134e3d] rounded-2xl p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(2,44,34,0.8)] relative backdrop-blur-xl">
          {/* Eyebrow step tag */}
          <div className="text-emerald-400 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-2">
            {mode === 'login'
              ? 'चरण 1 / 1 • STEP 1 OF 1 • LOGIN'
              : 'चरण 1 / 1 • STEP 1 OF 1 • SIGN UP'}
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {mode === 'login'
              ? '1. अपना ईमेल और पासवर्ड दर्ज करें'
              : '1. नया खाता बनाने के लिए विवरण दर्ज करें'}
          </h2>

          {/* Subtitle */}
          <p className="text-emerald-200/70 text-xs sm:text-sm mt-1 mb-5">
            {mode === 'login'
              ? 'Enter your email & password or sign in with Google'
              : 'Enter your email & password to register your account'}
          </p>

          {/* Luminous Emerald Progress Bar */}
          <div className="w-full bg-[#0a3527] h-1.5 rounded-full overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 h-full rounded-full transition-all duration-500 w-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>

          {/* Interactive Voice Mode Notification */}
          {isSpeaking && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs flex items-center justify-between gap-2 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-base animate-bounce">🎙️</span>
                <span>
                  वॉइस गाइड सक्रिय: कृपया नीचे अपना ईमेल व पासवर्ड दर्ज करें अथवा सीधे Google बटन का उपयोग करें।
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleVoiceMode}
                className="text-emerald-100 hover:text-white font-bold text-xs underline cursor-pointer shrink-0"
              >
                बंद करें
              </button>
            </div>
          )}

          {/* Error Alert */}
          {activeError && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-start gap-2.5 shadow-sm">
              <span className="text-base shrink-0">⚠️</span>
              <div className="flex-1 leading-relaxed">{activeError}</div>
            </div>
          )}

          {/* Success Alert */}
          {activeSuccess && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs flex items-start gap-2.5 shadow-sm">
              <span className="text-base shrink-0">✉️</span>
              <div className="flex-1 leading-relaxed font-medium">{activeSuccess}</div>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#031610] border border-[#134e3d] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 shadow-md'
                  : 'text-emerald-200/70 hover:text-white hover:bg-[#072b20]'
              }`}
            >
              लॉगिन (Sign In)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError('');
                setSuccessMessage('');
              }}
              className={`py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 shadow-md'
                  : 'text-emerald-200/70 hover:text-white hover:bg-[#072b20]'
              }`}
            >
              नया खाता (Create Account)
            </button>
          </div>

          {/* Form */}
          <form onSubmit={mode === 'login' ? handleSignIn : handleSignUp} className="space-y-4">
            {/* Email Address Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-bold text-emerald-100 mb-1.5"
              >
                ईमेल पता / Email Address <span className="text-emerald-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                disabled={isAnyLoading}
                className="w-full bg-[#02130e] border border-[#134e3d] text-white placeholder-emerald-700 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all shadow-inner disabled:opacity-50"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs sm:text-sm font-bold text-emerald-100"
                >
                  पासवर्ड / Password <span className="text-emerald-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isAnyLoading}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  {showPassword ? 'छुपाएं (Hide)' : 'दिखाएं (Show)'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={isAnyLoading}
                className="w-full bg-[#02130e] border border-[#134e3d] text-white placeholder-emerald-700 rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all shadow-inner disabled:opacity-50"
              />
            </div>

            {/* Helper text */}
            <p className="text-emerald-200/60 text-xs pt-1">
              {mode === 'login'
                ? 'इस ईमेल से आप भविष्य में पासवर्ड अथवा Google द्वारा कभी भी लॉगिन कर सकेंगे।'
                : 'न्यूनतम 6 अक्षर। खाता बनाने के बाद ईमेल सत्यापन लिंक भेजा जाएगा।'}
            </p>

            {/* Action Buttons Row */}
            <div className="flex items-center justify-between gap-4 pt-4">
              {/* Left Button: "← पिछला (Back)" */}
              <Link
                href="/"
                className="px-5 py-3 rounded-xl border border-[#134e3d] bg-[#031610] text-emerald-200/80 hover:text-white hover:border-emerald-400 hover:bg-[#072b20] text-xs sm:text-sm font-medium transition-all text-center"
              >
                ← पिछला (Back)
              </Link>

              {/* Right Button: "आगे बढ़ें (Next) →" */}
              <button
                type="submit"
                disabled={isAnyLoading}
                className="cursor-pointer px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 hover:from-emerald-300 hover:to-teal-200 active:scale-[0.98] text-emerald-950 font-black text-xs sm:text-base transition-all shadow-[0_4px_20px_rgba(16,185,129,0.4)] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSignInLoading || isSignUpLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-emerald-950"
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
                    <span>प्रतीक्षा करें...</span>
                  </>
                ) : mode === 'login' ? (
                  <span>आगे बढ़ें (Sign In) →</span>
                ) : (
                  <span>खाता बनाएं (Sign Up) →</span>
                )}
              </button>
            </div>
          </form>

          {/* Visual Divider ("या / OR") */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#134e3d]" />
            </div>
            <span className="relative bg-[#06241b] px-3.5 text-xs text-emerald-300/70 font-bold uppercase tracking-wider">
              या / OR
            </span>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isAnyLoading}
            className="w-full cursor-pointer bg-white hover:bg-emerald-50 active:scale-[0.99] text-slate-800 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-md disabled:opacity-60 border border-emerald-200"
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
                <span className="text-sm font-semibold text-slate-700">Connecting to Google...</span>
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
                <span className="text-sm font-bold text-slate-800">
                  Google से लॉगिन करें (Sign in with Google)
                </span>
              </>
            )}
          </button>

          {/* Switch mode footer link */}
          <div className="mt-5 text-center text-xs text-emerald-200/70">
            {mode === 'login' ? (
              <span>
                नया खाता बनाना चाहते हैं?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  यहाँ रजिस्टर करें (Create Account)
                </button>
              </span>
            ) : (
              <span>
                पहले से खाता है?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer ml-1"
                >
                  लॉगिन करें (Sign In)
                </button>
              </span>
            )}
          </div>
        </div>
      </main>

      {/* ── Bottom Footer ── */}
      <footer className="py-5 text-center text-xs text-emerald-300/60 tracking-wide border-t border-[#092b20]">
        साथी व्यापार • सुरक्षित एवं पारदर्शी ग्रामीण वित्तीय प्रणाली
      </footer>
    </div>
  );
}

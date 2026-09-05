'use client';

/**
 * src/app/login/LoginForm.tsx
 *
 * Client Component: Phone OTP login form using Supabase Auth.
 * Two-step: enter phone → receive OTP → verify OTP → redirect to dashboard.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseClient } from '@/lib/supabase/client';

type Step = 'phone' | 'otp' | 'loading';

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format phone to E.164 (+91...)
  function formatPhone(raw: string): string {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) return `+${digits}`;
    if (digits.length === 10) return `+91${digits}`;
    return `+${digits}`;
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formatted = formatPhone(phone);
    if (formatted.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      setIsSubmitting(false);
      return;
    }

    const { error: authError } = await supabaseClient.auth.signInWithOtp({
      phone: formatted,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setStep('otp');
    }

    setIsSubmitting(false);
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formatted = formatPhone(phone);

    const { error: verifyError } = await supabaseClient.auth.verifyOtp({
      phone: formatted,
      token: otp.trim(),
      type: 'sms',
    });

    if (verifyError) {
      setError(verifyError.message);
      setIsSubmitting(false);
    } else {
      // Redirect to dashboard on successful login
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div className="bg-[#16213e] rounded-2xl shadow-xl p-6 border border-[#0f3460]">
      {step === 'phone' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="block text-white text-sm font-medium mb-2"
            >
              मोबाइल नंबर / Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-[#0f3460] text-gray-300 text-sm border border-r-0 border-[#1a4a7a] rounded-l-lg">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                className="flex-1 bg-[#0f3460] text-white placeholder-gray-500 border border-[#1a4a7a] rounded-r-lg px-4 py-3 text-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                required
                maxLength={12}
                inputMode="numeric"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white font-semibold py-3 px-4 rounded-xl text-base transition-colors"
          >
            {isSubmitting ? '⏳ भेज रहे हैं...' : 'OTP भेजें / Send OTP'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <p className="text-green-400 text-sm mb-4 bg-green-900/20 rounded-lg p-3">
              ✅ OTP भेजा गया: {formatPhone(phone)}
            </p>
            <label
              htmlFor="otp"
              className="block text-white text-sm font-medium mb-2"
            >
              OTP दर्ज करें / Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              className="w-full bg-[#0f3460] text-white placeholder-gray-500 border border-[#1a4a7a] rounded-xl px-4 py-3 text-2xl font-mono text-center tracking-widest focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              required
              maxLength={6}
              inputMode="numeric"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-900/20 rounded-lg p-3">
              ❌ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-green-900 text-white font-semibold py-3 px-4 rounded-xl text-base transition-colors"
          >
            {isSubmitting ? '⏳ वेरिफाई हो रहा है...' : 'लॉगिन करें / Verify & Login'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
            }}
            className="w-full text-gray-400 text-sm py-2 hover:text-gray-200 transition-colors"
          >
            ← नंबर बदलें / Change Number
          </button>
        </form>
      )}
    </div>
  );
}

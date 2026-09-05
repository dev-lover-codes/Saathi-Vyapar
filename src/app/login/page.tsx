/**
 * src/app/login/page.tsx
 *
 * Phone OTP Login page using Supabase Phone Auth.
 * Server-rendered shell + client OTP form.
 */

import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Login — Saathi Vyapar',
  description: 'Login with your mobile number to access your financial dashboard',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#1a1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🤝</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            साथी व्यापार
          </h1>
          <p className="text-gray-400 mt-1 text-base">
            Saathi Vyapar
          </p>
          <p className="text-gray-300 mt-3 text-sm">
            अपने मोबाइल नंबर से लॉगिन करें
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Login with your mobile number
          </p>
        </div>

        {/* OTP Login Form (Client Component) */}
        <LoginForm />

        {/* Footer note */}
        <p className="text-center text-gray-500 text-xs mt-6">
          WhatsApp पर भी उपलब्ध • Also available on WhatsApp
        </p>
      </div>
    </main>
  );
}

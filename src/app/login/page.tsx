/**
 * src/app/login/page.tsx
 *
 * Sign in page using Supabase Google OAuth.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Login — Saathi Vyapar',
  description: 'Sign in with Google to access your financial advisory dashboard and government scheme matching.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0B1E33] text-slate-100 flex flex-col items-center justify-center px-4 py-12 selection:bg-[#C9A24B] selection:text-[#0B1E33]">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center mb-3">
            <span className="text-5xl p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
              🤝
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            साथी व्यापार
          </h1>
          <p className="text-[#C9A24B] mt-1 text-sm font-semibold tracking-wide">
            Saathi Vyapar
          </p>
          <p className="text-slate-300 mt-4 text-base font-medium">
            Google खाते से लॉगिन करें
          </p>
          <p className="text-slate-400 text-xs mt-0.5">
            Sign in with your Google account to access your business dashboard
          </p>
        </div>

        {/* Google Login Form */}
        <LoginForm />

        {/* Navigation & Help Links */}
        <div className="mt-8 text-center space-y-3">
          <div>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-[#C9A24B] transition-colors inline-flex items-center gap-1.5"
            >
              <span>←</span>
              <span>होमपेज पर वापस जाएं / Back to Home</span>
            </Link>
          </div>
          <p className="text-slate-500 text-[11px]">
            Smart India Hackathon • SIH26091 • Developed by Pantheon Eternal
          </p>
        </div>
      </div>
    </main>
  );
}

/**
 * src/app/login/page.tsx
 *
 * Full-screen dual-panel login experience for Saathi Vyapar.
 * Left: Deep Navy (#0B1E33) with drifting CSS gradient mesh & rotating value props.
 * Right: Warm Cream (#F5F1E6) with glassmorphic sign-in card and serif typography.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { playfair, jakarta } from '@/lib/fonts';
import LoginForm from './LoginForm';
import RotatingValueProps from './RotatingValueProps';

export const metadata: Metadata = {
  title: 'Sign In — Saathi Vyapar',
  description: 'Sign in with Google to access your financial dashboard and government scheme matching. SIH26091.',
};

export default function LoginPage() {
  return (
    <main className={`min-h-screen w-full flex flex-col lg:flex-row ${jakarta.className} selection:bg-[#C9A24B] selection:text-[#0B1E33]`}>
      {/* ── Left Half: Deep Navy Panel with Drifting Gradient Mesh ── */}
      <section className="relative w-full lg:w-1/2 bg-[#0B1E33] p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden min-h-[420px] lg:min-h-screen text-slate-100">
        {/* Animated Gradient Mesh (Pure CSS - Zero Added Library) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Drifting Gold Blob */}
          <div
            className="absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-35 blur-[90px] animate-[floatBlob1_18s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, #C9A24B 0%, rgba(201,162,75,0.05) 70%, transparent 100%)',
            }}
          />
          {/* Drifting Emerald Blob */}
          <div
            className="absolute top-1/2 -right-24 w-80 h-80 rounded-full opacity-25 blur-[100px] animate-[floatBlob2_22s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, #10B981 0%, rgba(16,185,129,0.05) 70%, transparent 100%)',
            }}
          />
          {/* Drifting Cyan/Indigo Blob */}
          <div
            className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full opacity-30 blur-[110px] animate-[floatBlob3_20s_ease-in-out_infinite]"
            style={{
              background: 'radial-gradient(circle, #38BDF8 0%, rgba(56,189,248,0.05) 70%, transparent 100%)',
            }}
          />
        </div>

        {/* Brand & Pantheon Eternal Emblem */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3.5 group">
            {/* Pantheon Eternal Insignia */}
            <div className="w-12 h-12 rounded-2xl bg-[#081726]/90 border border-[#C9A24B]/50 flex items-center justify-center shadow-lg shadow-black/30 group-hover:border-[#C9A24B] transition-colors">
              <svg className="w-7 h-7 text-[#C9A24B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                {/* Classical Pantheon / Temple columns icon */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M4 18h16M5 14v4M9 14v4M15 14v4M19 14v4M12 3l9 7H3l9-7z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold tracking-tight text-white ${playfair.className}`}>
                  Pantheon Eternal
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#C9A24B]/15 text-[#C9A24B] font-semibold border border-[#C9A24B]/30 tracking-wider">
                  SIH26091
                </span>
              </div>
              <div className="text-xs text-slate-400 tracking-wide font-medium">
                Saathi Vyapar • साथी व्यापार
              </div>
            </div>
          </Link>
        </div>

        {/* Center: Mission & Rotating Value Props Ticker */}
        <div className="relative z-10 my-10 lg:my-0 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-[#C9A24B] mb-6">
            <span>🇮🇳</span>
            <span>Empowering Bharat’s Micro-Enterprises</span>
          </div>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-8 ${playfair.className}`}>
            Bridging rural businesses to formal credit.
          </h2>

          {/* Rotating Value Proposition Ticker */}
          <div className="bg-[#081726]/70 backdrop-blur-md border border-slate-700/60 rounded-2xl p-6 shadow-xl">
            <RotatingValueProps />
          </div>
        </div>

        {/* Footer info on left panel */}
        <div className="relative z-10 pt-6 border-t border-slate-700/40 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>Smart India Hackathon 2024</span>
          <span className="text-slate-500">Pure Deterministic Math • Zero PII</span>
        </div>
      </section>

      {/* ── Right Half: Warm Cream Panel (#F5F1E6) with Glassmorphism Card ── */}
      <section className="w-full lg:w-1/2 bg-[#F5F1E6] p-6 sm:p-12 lg:p-16 flex flex-col justify-center items-center relative min-h-[500px]">
        {/* Subtle warm decorative background rings */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Glassmorphism Sign-In Card */}
          <div className="bg-white/85 backdrop-blur-xl border border-[#0B1E33]/10 shadow-[0_25px_60px_-15px_rgba(11,30,51,0.12)] rounded-3xl p-8 sm:p-10 transition-all">
            {/* Devanagari Tag & Heading */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-[#0B1E33]/5 text-[#0B1E33] border border-[#C9A24B]/50 mb-3">
                <span>🤝</span>
                <span>साथी व्यापार • SAATHI VYAPAR</span>
              </div>

              <h1 className={`text-2xl sm:text-3xl font-extrabold text-[#0B1E33] tracking-tight ${playfair.className}`}>
                Welcome to your business co-pilot.
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
                Sign in with your Google account to access your live financial dashboard, break-even unit analytics, and verified government subsidy matches.
              </p>
            </div>

            {/* Google Sign-in Form with Scale + Shadow Shift */}
            <LoginForm />

            {/* Trust signals inside the card */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Instant access without passwords or OTP delays</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                <span>Encrypted session with zero PII exposure to AI models</span>
              </div>
            </div>
          </div>

          {/* Navigation Links under card */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-[#0B1E33] transition-colors inline-flex items-center gap-1.5"
            >
              <span>←</span>
              <span>होमपेज पर वापस जाएं • Return to Home</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pure CSS Keyframes for Mesh Drift (Self-contained, Zero Library) */}
      <style>{`
        @keyframes floatBlob1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(45px, -55px) scale(1.18); }
        }
        @keyframes floatBlob2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 40px) scale(0.88); }
        }
        @keyframes floatBlob3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(35px, 45px) scale(1.12); }
        }
      `}</style>
    </main>
  );
}

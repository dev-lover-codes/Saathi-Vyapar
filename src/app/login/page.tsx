/**
 * src/app/login/page.tsx
 *
 * Full-screen Dark Navy Authentication Portal matching image copy.png.
 * Renders LoginForm with Suspense for static generation safety.
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'लॉगिन एवं पंजीकरण — साथी व्यापार (Saathi Vyapar)',
  description:
    'Sign in or create your Saathi Vyapar account using Email & Password or Google OAuth. SIH26091.',
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#031610] flex items-center justify-center text-emerald-400 font-mono text-sm">
          लोड हो रहा है (Loading authentication portal)...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

/**
 * src/app/uptime/layout.tsx
 * Metadata for the /uptime system status page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'System Status — Saathi Vyapar',
  description: 'Live uptime and database health status for Saathi Vyapar',
  robots: { index: false, follow: false },
};

export default function UptimeLayout({ children }: { children: React.ReactNode }) {
  return children;
}

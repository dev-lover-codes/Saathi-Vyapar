import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saathi Vyapar (साथी व्यापार) — Neoclassical AI Financial Advisory",
  description:
    "AI-driven hyper-local business advisory and financial structuring assistant for rural micro-entrepreneurs, accessible via WhatsApp, SMS, and web. SIH26091.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        {children}
      </body>
    </html>
  );
}

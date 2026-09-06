'use client';

/**
 * src/app/page.tsx
 *
 * Saathi Vyapar (साथी व्यापार) Homepage
 *
 * Features:
 * 1. Prominent "Register" button in the Hero section linking to /onboarding.
 * 2. Fixed Floating Action Button (FAB) in bottom-right corner styled in navy/gold/cream:
 *    - Expands on CLICK (touchscreen friendly, not hover) into two options:
 *      a) "WhatsApp Support" → opens https://wa.me/<WHATSAPP_PHONE_NUMBER> in a new tab.
 *      b) "Voice Assistant" → opens a full-screen modal/overlay for conversational voice registration.
 * 3. Complete brand-consistent landing page highlighting deterministic financial analytics,
 *    15+ Indian government schemes, OCR ledger digitization, and vernacular support.
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VoiceOnboardingModal from '@/components/VoiceOnboardingModal';

export default function HomePage() {
  const router = useRouter();
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // WhatsApp Support Number from env or default
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    '919876543210';
  const cleanWhatsappNumber = whatsappNumber.replace(/\D/g, '');

  // Prevent body scroll when voice modal is open
  useEffect(() => {
    if (isVoiceModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVoiceModalOpen]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B1B1B] font-['Poppins',sans-serif] flex flex-col selection:bg-[#151515] selection:text-white">
      {/* ── Soft Ambient Glows ─────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(255,65,108,0.07),transparent_70%)] blur-3xl" />
        <div className="absolute top-[30%] right-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,75,43,0.05),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[-5%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05),transparent_70%)] blur-3xl" />
      </div>

      {/* ── Floating Pill Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-3 z-30 px-4 sm:px-8 max-w-7xl mx-auto w-full transition-all">
        <div className="rounded-full bg-white/85 backdrop-blur-xl border border-[#E5E2E1] px-5 sm:px-8 py-3 shadow-[0_4px_25px_rgba(27,27,27,0.05)] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl sm:text-3xl filter drop-shadow-sm transition-transform group-hover:scale-110">
              🤝
            </span>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-[#151515] flex items-center gap-2">
                साथी व्यापार
                <span className="text-[10px] font-bold uppercase tracking-widest bg-[#151515] text-white px-2 py-0.5 rounded-full">
                  LUMIO
                </span>
              </span>
              <span className="text-[10px] text-[#8C8880] font-medium tracking-wide hidden sm:block">
                AI Financial Advisory & Scheme Matching for Micro-Enterprises
              </span>
            </div>
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/facilitator"
              className="hidden md:inline-flex items-center gap-1 text-xs font-semibold text-[#444748] hover:text-[#151515] px-3.5 py-1.5 rounded-full hover:bg-[#F0EFEB] transition-colors"
            >
              🏢 सुविधाकर्ता (Facilitator)
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#151515] hover:bg-[#F0EFEB] border border-[#E5E2E1] transition-all"
            >
              लॉगिन / Login
            </Link>

            <Link
              href="/onboarding"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white shadow-[0_4px_16px_rgba(255,65,108,0.3)] hover:shadow-[0_6px_22px_rgba(255,65,108,0.45)] transform hover:-translate-y-0.5 transition-all"
            >
              <span>रजिस्टर करें</span>
              <span className="hidden sm:inline">/ Register</span>
              <span className="text-base leading-none font-black">→</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col">
        {/* ── Hero Section ────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8">
          <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#E5E2E1] text-[#151515] text-xs sm:text-sm font-medium shadow-[0_2px_12px_rgba(27,27,27,0.03)]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              <span className="font-semibold text-[#151515]">ग्रामीण व सूक्ष्म उद्यमियों का सच्चा साथी</span>
              <span className="text-[#8C8880] hidden sm:inline">• 15+ सरकारी योजनाएं व वित्तीय सहायता</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#151515] tracking-tight leading-[1.12]">
              अपने व्यापार को दें{' '}
              <span className="bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] bg-clip-text text-transparent underline decoration-[#FF416C]/30 decoration-wavy decoration-2">
                वित्तीय शक्ति व गति
              </span>
              <br className="hidden sm:inline" />
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#444748] mt-2 block">
                सरल हिसाब • सही योजनाएं • सीधा मुनाफा
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#8C8880] leading-[1.6] font-normal">
              साथी व्यापार ग्रामीण व छोटे उद्यमियों को ब्रेक-इवन और लाभ का सही गणित समझाता है,{' '}
              <strong className="text-[#151515] font-semibold">15+ सरकारी योजनाओं (PMEGP, Mudra, PM SVANidhi)</strong> से जोड़ता है,
              और आपकी भाषा में WhatsApp व आवाज़ द्वारा सीधा मार्गदर्शन देता है।
            </p>

            {/* Prominent CTA Button Group */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              {/* Prominent Register Button */}
              <Link
                href="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base sm:text-lg font-bold bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white shadow-[0_10px_30px_rgba(255,65,108,0.35)] hover:shadow-[0_14px_40px_rgba(255,65,108,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="text-xl">🚀</span>
                <span>रजिस्टर करें / Register Now</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              {/* Voice Register Quick Trigger */}
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-base font-semibold bg-white hover:bg-[#F0EFEB] text-[#151515] border border-[#E5E2E1] shadow-[0_4px_16px_rgba(27,27,27,0.04)] hover:shadow-[0_6px_24px_rgba(27,27,27,0.08)] transition-all active:scale-[0.98]"
              >
                <span className="text-xl">🎙️</span>
                <span>बोलकर भरें (Voice Flow)</span>
              </button>
            </div>

            {/* Trust Highlights Grid */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
              <div className="p-4 rounded-2xl bg-white border border-[#EBE7E6] shadow-[0_4px_16px_rgba(27,27,27,0.03)] flex items-center gap-3 hover:border-[#151515]/20 transition-all">
                <span className="text-2xl p-2 rounded-xl bg-[#F0EFEB] text-[#151515]">⚡</span>
                <div>
                  <h2 className="text-xs font-bold text-[#151515]">शुद्ध गणित</h2>
                  <p className="text-[11px] text-[#8C8880]">100% पारदर्शी ब्रेक-इवन गणना</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EBE7E6] shadow-[0_4px_16px_rgba(27,27,27,0.03)] flex items-center gap-3 hover:border-[#151515]/20 transition-all">
                <span className="text-2xl p-2 rounded-xl bg-[#FF416C]/10 text-[#FF416C]">🏛️</span>
                <div>
                  <h2 className="text-xs font-bold text-[#151515]">15+ योजनाएं</h2>
                  <p className="text-[11px] text-[#8C8880]">सटीक पात्रता व सब्सिडी लिंक</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EBE7E6] shadow-[0_4px_16px_rgba(27,27,27,0.03)] flex items-center gap-3 hover:border-[#151515]/20 transition-all">
                <span className="text-2xl p-2 rounded-xl bg-[#22C55E]/10 text-[#22C55E]">📸</span>
                <div>
                  <h2 className="text-xs font-bold text-[#151515]">खाता-बही OCR</h2>
                  <p className="text-[11px] text-[#8C8880]">डायरी के पन्नों से हिसाब</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#EBE7E6] shadow-[0_4px_16px_rgba(27,27,27,0.03)] flex items-center gap-3 hover:border-[#151515]/20 transition-all">
                <span className="text-2xl p-2 rounded-xl bg-[#F0EFEB] text-[#151515]">💬</span>
                <div>
                  <h2 className="text-xs font-bold text-[#151515]">WhatsApp & आवाज़</h2>
                  <p className="text-[11px] text-[#8C8880]">बिना टाइप किए सरल संवाद</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Value Pillars Section ──────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-8 bg-[#F0EFEB] border-y border-[#E5E2E1]">
          <div className="max-w-6xl mx-auto space-y-10">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#151515] bg-white border border-[#E5E2E1] px-3.5 py-1 rounded-full inline-block shadow-sm">
                विशेषताएं / Key Features
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#151515] tracking-tight">
                हर छोटे व्यापारी के लिए संपूर्ण समाधान
              </h2>
              <p className="text-sm text-[#8C8880] max-w-xl mx-auto">
                चाहे आप किराना दुकान चलाते हों, सिलाई करते हों या डेयरी का काम — साथी व्यापार आपके साथ है।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-white border border-[#EBE7E6] shadow-[0_6px_24px_rgba(27,27,27,0.04)] hover:shadow-[0_12px_36px_rgba(27,27,27,0.08)] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#F4F3EF] flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  📊
                </div>
                <h3 className="text-lg font-bold text-[#151515] mb-2">सटीक वित्तीय विश्लेषण</h3>
                <p className="text-sm text-[#8C8880] leading-[1.6] mb-5">
                  अपने मासिक खर्च और बिक्री के आधार पर जानिए कि लाभ कमाने के लिए कितनी बिक्री जरूरी है (Break-even & Margin Analysis)।
                </p>
                <div className="text-xs text-[#22C55E] font-semibold flex items-center gap-1.5">
                  <span>✓</span>
                  <span>जीरो-हैलुसिनेशन शुद्ध गणित</span>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-white border border-[#EBE7E6] shadow-[0_6px_24px_rgba(27,27,27,0.04)] hover:shadow-[0_12px_36px_rgba(27,27,27,0.08)] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#FF416C]/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  🏛️
                </div>
                <h3 className="text-lg font-bold text-[#151515] mb-2">सरकारी योजनाओं का मिलान</h3>
                <p className="text-sm text-[#8C8880] leading-[1.6] mb-5">
                  PMEGP, PM मुद्रा योजना, स्टैंड-अप इंडिया और PM स्वनिधि जैसी योजनाओं की पात्रता जांचें और सीधे आवेदन पोर्टल पर जाएं।
                </p>
                <div className="text-xs text-[#FF416C] font-semibold flex items-center gap-1.5">
                  <span>✓</span>
                  <span>स्पष्ट पात्रता कारण व सब्सिडी विवरण</span>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-white border border-[#EBE7E6] shadow-[0_6px_24px_rgba(27,27,27,0.04)] hover:shadow-[0_12px_36px_rgba(27,27,27,0.08)] transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-[#22C55E]/10 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  🗣️
                </div>
                <h3 className="text-lg font-bold text-[#151515] mb-2">आवाज़ और व्हाट्सएप पर सहायता</h3>
                <p className="text-sm text-[#8C8880] leading-[1.6] mb-5">
                  इंग्लिश या जटिल ऐप सीखने की जरूरत नहीं। व्हाट्सएप पर मैसेज भेजें या अपनी आवाज़ में बोलकर खाता बनाएं।
                </p>
                <div className="text-xs text-[#22C55E] font-semibold flex items-center gap-1.5">
                  <span>✓</span>
                  <span>हिंदी व स्थानीय भाषाओं में उपलब्ध</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How It Works Section ───────────────────────────────────── */}
        <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#151515] bg-[#F0EFEB] border border-[#E5E2E1] px-3.5 py-1 rounded-full inline-block">
              प्रक्रिया / How It Works
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#151515] tracking-tight">
              3 आसान चरणों में शुरू करें
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-7 rounded-3xl bg-white border border-[#EBE7E6] shadow-[0_6px_20px_rgba(27,27,27,0.03)] relative">
              <div className="w-10 h-10 rounded-full bg-[#151515] text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-[#151515] mb-1.5">रजिस्टर करें</h3>
              <p className="text-xs sm:text-sm text-[#8C8880] leading-[1.6]">
                वेबसाइट, WhatsApp या वॉइस असिस्टेंट के माध्यम से अपना खाता सुरक्षित बनाएं।
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#EBE7E6] shadow-[0_6px_20px_rgba(27,27,27,0.03)] relative">
              <div className="w-10 h-10 rounded-full bg-[#151515] text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-[#151515] mb-1.5">व्यापार की जानकारी दें</h3>
              <p className="text-xs sm:text-sm text-[#8C8880] leading-[1.6]">
                अपने काम का क्षेत्र, मासिक कमाई और खर्च बताएं या डायरी का फोटो भेजें।
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white border border-[#EBE7E6] shadow-[0_6px_20px_rgba(27,27,27,0.03)] relative">
              <div className="w-10 h-10 rounded-full bg-[#151515] text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-[#151515] mb-1.5">प्लान व योजनाएं पाएं</h3>
              <p className="text-xs sm:text-sm text-[#8C8880] leading-[1.6]">
                तुरंत अपना वित्तीय रिपोर्ट कार्ड और उपयुक्त सरकारी सब्सिडी की सूची देखें।
              </p>
            </div>
          </div>

          {/* Bottom Register CTA Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#151515] text-white text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#FF416C]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#FF4B2B]/20 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white relative z-10">
              आज ही अपने व्यापार को नई दिशा दें
            </h3>
            <p className="text-white/70 text-sm sm:text-base max-w-xl mx-auto relative z-10 leading-[1.6]">
              हजारों सूक्ष्म उद्यमियों के साथ जुड़ें और अपनी दुकान व व्यवसाय को मुनाफेदार बनाएं।
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
              <Link
                href="/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-base font-bold bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white shadow-lg shadow-[#FF416C]/30 hover:scale-105 active:scale-95 transition-all"
              >
                <span>नया खाता खोलें (Register)</span>
                <span>→</span>
              </Link>
              <Link
                href="/facilitator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
              >
                <span>सुविधाकर्ता पोर्टल (Facilitator)</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-[#E5E2E1] py-8 px-4 sm:px-8 text-center text-xs text-[#8C8880] space-y-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#151515] font-bold">
            <span>🤝 साथी व्यापार (Saathi Vyapar)</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#8C8880]">
            <Link href="/login" className="hover:text-[#151515] transition-colors">
              लॉगिन (Login)
            </Link>
            <span>•</span>
            <Link href="/onboarding" className="hover:text-[#151515] transition-colors">
              रजिस्टर (Register)
            </Link>
            <span>•</span>
            <Link href="/facilitator" className="hover:text-[#151515] transition-colors">
              सुविधाकर्ता (Facilitator)
            </Link>
            <span>•</span>
            <a
              href={`https://wa.me/${cleanWhatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF416C] hover:underline transition-colors"
            >
              WhatsApp Support
            </a>
          </div>
        </div>
        <p className="text-[11px] text-[#8C8880]/80">
          सशक्त ग्रामीण भारत के निर्माण हेतु समर्पित • AI Financial Advisory & Scheme Matching
        </p>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── Floating Action Button (FAB) (Fixed bottom-right corner) ──── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        {/* Backdrop for FAB menu dismiss on click outside */}
        {isFabOpen && (
          <div
            onClick={() => setIsFabOpen(false)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity"
            aria-hidden="true"
          />
        )}

        {/* Expanded Options Container (Stacked above the FAB button) */}
        {isFabOpen && (
          <div className="relative z-50 flex flex-col items-end gap-2.5 mb-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Option 1: WhatsApp Support */}
            <a
              href={`https://wa.me/${cleanWhatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsFabOpen(false)}
              className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white text-[#151515] border border-[#E5E2E1] shadow-[0_8px_30px_rgba(27,27,27,0.12)] hover:scale-105 transition-all"
            >
              <span className="text-xs sm:text-sm font-bold text-[#151515] whitespace-nowrap">
                WhatsApp Support
                <span className="block text-[10px] text-[#8C8880] font-normal">
                  व्हाट्सएप पर सहायता लें
                </span>
              </span>
              <div className="w-10 h-10 rounded-full bg-[#22C55E] text-white flex items-center justify-center text-xl shadow-sm shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
            </a>

            {/* Option 2: Voice Assistant */}
            <button
              type="button"
              onClick={() => {
                setIsFabOpen(false);
                setIsVoiceModalOpen(true);
              }}
              className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white text-[#151515] border border-[#E5E2E1] shadow-[0_8px_30px_rgba(27,27,27,0.12)] hover:scale-105 transition-all text-left"
            >
              <span className="text-xs sm:text-sm font-bold text-[#151515] whitespace-nowrap">
                Voice Assistant
                <span className="block text-[10px] text-[#8C8880] font-normal">
                  आवाज़ से पंजीकरण शुरू करें
                </span>
              </span>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white flex items-center justify-center text-xl shadow-sm shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Primary Circular FAB Trigger Button */}
        <button
          type="button"
          onClick={() => setIsFabOpen((prev) => !prev)}
          aria-label={isFabOpen ? 'Close quick action menu' : 'Open WhatsApp and Voice Assistant options'}
          aria-expanded={isFabOpen}
          className={`relative z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#151515] hover:bg-[#000000] text-white shadow-[0_8px_30px_rgba(27,27,27,0.25)] flex items-center justify-center transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#151515]/20 ${
            isFabOpen ? 'rotate-90 bg-black' : 'hover:scale-105'
          }`}
        >
          {isFabOpen ? (
            /* Close X Icon */
            <svg
              className="w-6 h-6 text-white transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            /* Combined Chat + Mic Icon */
            <div className="relative flex items-center justify-center">
              {/* Chat Bubble Base */}
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-current" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              {/* Microphone Overlay Badge */}
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] text-white rounded-full p-0.5 border border-white">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── Conversational Voice Assistant Modal ───────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <VoiceOnboardingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSwitchToText={() => {
          setIsVoiceModalOpen(false);
          router.push('/onboarding');
        }}
      />
    </div>
  );
}


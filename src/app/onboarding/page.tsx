'use client';

/**
 * src/app/onboarding/page.tsx
 *
 * Micro-Entrepreneur Registration & Onboarding Page
 *
 * Capabilities:
 * - Native Web Speech API Voice Onboarding Modal
 * - Browser compatibility detection (`'webkitSpeechRecognition' in window || 'SpeechRecognition' in window`)
 * - Clean, accessible TEXT-BASED Onboarding Form as reliable fallback (for Firefox, iOS Safari limitations, or user preference)
 * - 8-Step Conversational & Form Flow with strict DPDP Act Consent verification
 * - Calls /api/onboarding/complete and redirects to /dashboard
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VoiceOnboardingModal, { OnboardingData } from '@/components/VoiceOnboardingModal';
import { supabaseClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const router = useRouter();

  // Browser voice support state
  const [hasVoiceSupport, setHasVoiceSupport] = useState<boolean | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Text Form Step State (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<OnboardingData>({
    phone: '',
    name: '',
    district: '',
    state: 'India',
    sector: '',
    business_name: '',
    monthly_revenue_est: 0,
    monthly_expense_est: 0,
    existing_loans: false,
    consent_given: false,
  });

  // Check auth session & detect speech recognition support on mount
  useEffect(() => {
    // 1. Voice detection
    const voiceSupported =
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

    setHasVoiceSupport(voiceSupported);

    // Auto-open voice assistant if voice is supported
    if (voiceSupported) {
      setIsVoiceModalOpen(true);
    }

    // 2. Check Supabase session
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();
        if (session?.user) {
          setFormData((prev) => ({
            ...prev,
            user_id: session.user.id,
            phone: session.user.phone || prev.phone,
          }));
        }
      } catch (err) {
        console.warn('Session check warning:', err);
      }
    }

    checkAuth();
  }, []);

  // Handle Text-Based Form Submission
  async function handleTextSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    // Step validations
    if (currentStep === 1 && !formData.name.trim()) {
      setErrorMessage('कृपया अपना नाम दर्ज करें (Please enter your name)');
      return;
    }

    if (currentStep === 2 && !formData.district.trim()) {
      setErrorMessage('कृपया अपना गांव या जिला दर्ज करें (Please enter district)');
      return;
    }

    if (currentStep === 3 && !formData.sector.trim()) {
      setErrorMessage('कृपया अपने काम या व्यापार का क्षेत्र चुनें या लिखें');
      return;
    }

    if (currentStep === 4) {
      if (formData.monthly_revenue_est <= 0) {
        setErrorMessage('कृपया अनुमानित मासिक कमाई (Revenue) दर्ज करें');
        return;
      }
    }

    if (currentStep === 7) {
      if (!formData.phone || formData.phone.length < 10) {
        setErrorMessage('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें');
        return;
      }
    }

    if (currentStep === 8) {
      if (!formData.consent_given) {
        setErrorMessage('डेटा सुरक्षा (DPDP Act) सहमति आवश्यक है');
        return;
      }

      // Final Submission
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/onboarding/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const resData = await response.json();

        if (!response.ok || !resData.success) {
          throw new Error(resData.error || 'Failed to complete registration');
        }

        router.push(resData.redirectUrl || `/dashboard?user_id=${resData.userId}`);
        router.refresh();
      } catch (err: any) {
        setErrorMessage(err.message || 'पंजीकरण सेव करने में त्रुटि हुई');
        setIsSubmitting(false);
      }
      return;
    }

    // Advance to next step
    setCurrentStep((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-[#0a1128] text-[#fdfbf7] font-sans flex flex-col justify-between selection:bg-[#f5a623] selection:text-[#0a1128]">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="border-b border-[#1c2e56] bg-[#0a1128]/90 backdrop-blur-md px-4 sm:px-8 py-3.5 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl filter drop-shadow">🤝</span>
            <div>
              <span className="text-lg sm:text-xl font-black text-white">साथी व्यापार</span>
              <span className="text-[10px] text-amber-300 block -mt-1">
                उद्यमी पंजीकरण (Entrepreneur Registration)
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {hasVoiceSupport && (
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 text-xs font-black shadow-md hover:scale-105 transition-all"
              >
                <span>🎙️ बोलकर भरें</span>
                <span className="hidden sm:inline">(Voice Mode)</span>
              </button>
            )}

            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-[#233868] bg-[#162544]"
            >
              लॉगिन / Login
            </Link>
          </div>
        </div>
      </header>

      {/* ── Voice Assistant Modal ─────────────────────────────────── */}
      <VoiceOnboardingModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSwitchToText={() => setIsVoiceModalOpen(false)}
      />

      {/* ── Main Container (Text Form Fallback & Direct Flow) ─────── */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col justify-center">
        <div className="bg-[#0f1d3e] border-2 border-[#1c356e] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header Banner */}
          <div className="space-y-1 text-center sm:text-left border-b border-[#1b2d56] pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                चरण {currentStep} / 8 • Step {currentStep} of 8
              </span>
              {hasVoiceSupport === false && (
                <span className="text-[11px] bg-zinc-800 text-zinc-400 px-2.5 py-0.5 rounded-md border border-zinc-700">
                  टेक्स्ट मोड (Standard Mode)
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentStep === 1 && '1. आपका शुभ नाम क्या है?'}
              {currentStep === 2 && '2. आपका गांव या जिला कौन सा है?'}
              {currentStep === 3 && '3. आप क्या काम या व्यापार करते हैं?'}
              {currentStep === 4 && '4. मासिक कमाई और खर्च का विवरण'}
              {currentStep === 5 && '5. क्या आपके ऊपर कोई पुराना लोन या कर्ज है?'}
              {currentStep === 6 && '6. विवरण की पुष्टि करें'}
              {currentStep === 7 && '7. अपना मोबाइल नंबर दर्ज करें'}
              {currentStep === 8 && '8. डेटा सुरक्षा सहमति (DPDP Act)'}
            </h1>
            <p className="text-xs text-zinc-400">
              {currentStep === 1 && 'What is your full name?'}
              {currentStep === 2 && 'Which village or district are you located in?'}
              {currentStep === 3 && 'What trade or work do you do? (e.g. Kirana, Tailoring, Dairy...)'}
              {currentStep === 4 && 'Roughly how much do you earn and spend monthly in ₹?'}
              {currentStep === 5 && 'Do you have any existing loans or debts?'}
              {currentStep === 6 && 'Review your business profile summary'}
              {currentStep === 7 && 'Enter your mobile number to link your account'}
              {currentStep === 8 && 'Plain-language consent before saving data'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#091124] h-2 rounded-full overflow-hidden border border-[#1b2d56]">
            <div
              className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 8) * 100}%` }}
            />
          </div>

          {/* Form Fields */}
          <form onSubmit={handleTextSubmit} className="space-y-5">
            {/* Step 1: Name */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-white">
                  उद्यमी का नाम / Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="उदा. रमेश कुमार (e.g. Ramesh Kumar)"
                  className="w-full bg-[#0b1633] text-white border border-[#1f376e] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
              </div>
            )}

            {/* Step 2: District */}
            {currentStep === 2 && (
              <div className="space-y-2">
                <label htmlFor="district" className="block text-sm font-semibold text-white">
                  गांव / जिला / Village or District <span className="text-amber-400">*</span>
                </label>
                <input
                  id="district"
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="उदा. वाराणसी, उत्तर प्रदेश (e.g. Varanasi)"
                  className="w-full bg-[#0b1633] text-white border border-[#1f376e] rounded-xl px-4 py-3 text-base focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  autoFocus
                />
              </div>
            )}

            {/* Step 3: Sector */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <label htmlFor="sector" className="block text-sm font-semibold text-white">
                  व्यापार का क्षेत्र / Business Sector <span className="text-amber-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'retail', label: '🛒 किराना / दुकान (Retail)' },
                    { id: 'tailoring', label: '🧵 सिलाई / वस्त्र (Tailoring)' },
                    { id: 'dairy', label: '🥛 डेयरी / पशुपालन (Dairy)' },
                    { id: 'agriculture', label: '🌾 खेती / किसानी (Farming)' },
                    { id: 'food', label: '🍲 खाना / चाय नाश्ता (Food)' },
                    { id: 'manufacturing', label: '🔨 निर्माण / कारीगरी (Crafts)' },
                    { id: 'services', label: '🔧 मरम्मत / सेवाएं (Services)' },
                    { id: 'general', label: '📦 अन्य व्यापार (General)' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, sector: s.id, business_name: s.label })}
                      className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                        formData.sector === s.id
                          ? 'bg-amber-400/20 border-amber-400 text-amber-200'
                          : 'bg-[#0b1633] border-[#1f376e] text-zinc-300 hover:border-zinc-500'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label htmlFor="customSector" className="block text-xs text-zinc-400 mb-1">
                    या विवरण खुद लिखें (Or type custom trade):
                  </label>
                  <input
                    id="customSector"
                    type="text"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    placeholder="उदा. स्टेशनरी और फोटोकॉपी दुकान"
                    className="w-full bg-[#0b1633] text-white border border-[#1f376e] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Finances */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="rev" className="block text-sm font-semibold text-white">
                    औसत मासिक कमाई (बिक्री) / Monthly Revenue (₹) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-zinc-400 font-bold">₹</span>
                    <input
                      id="rev"
                      type="number"
                      min="0"
                      required
                      value={formData.monthly_revenue_est || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, monthly_revenue_est: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="उदा. 25000"
                      className="w-full bg-[#0b1633] text-white pl-8 pr-4 py-3 border border-[#1f376e] rounded-xl text-base focus:outline-none focus:border-amber-400"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="exp" className="block text-sm font-semibold text-white">
                    औसत मासिक खर्च / Monthly Expenses (₹) <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-zinc-400 font-bold">₹</span>
                    <input
                      id="exp"
                      type="number"
                      min="0"
                      value={formData.monthly_expense_est || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, monthly_expense_est: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="उदा. 15000"
                      className="w-full bg-[#0b1633] text-white pl-8 pr-4 py-3 border border-[#1f376e] rounded-xl text-base focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Loans */}
            {currentStep === 5 && (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-white">
                  क्या आपके ऊपर कोई सक्रिय बैंक या समूह का लोन है? / Any Existing Loans?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, existing_loans: true })}
                    className={`p-4 rounded-xl border text-center font-bold text-base transition-all ${
                      formData.existing_loans === true
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                        : 'bg-[#0b1633] border-[#1f376e] text-zinc-300'
                    }`}
                  >
                    हाँ (Yes, have loans)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, existing_loans: false })}
                    className={`p-4 rounded-xl border text-center font-bold text-base transition-all ${
                      formData.existing_loans === false
                        ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300'
                        : 'bg-[#0b1633] border-[#1f376e] text-zinc-300'
                    }`}
                  >
                    नहीं (No loans)
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Confirmation Summary */}
            {currentStep === 6 && (
              <div className="bg-[#0b1633] border border-amber-400/40 rounded-2xl p-5 space-y-3 text-sm">
                <h3 className="font-bold text-amber-300 text-xs uppercase tracking-wider border-b border-zinc-800 pb-2">
                  📋 आपके व्यापार का सारांश (Profile Summary)
                </h3>
                <div className="grid grid-cols-2 gap-3 text-zinc-300">
                  <div>
                    <span className="text-zinc-500 block text-xs">उद्यमी का नाम:</span>
                    <strong className="text-white text-base">{formData.name}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">स्थान (जिला):</span>
                    <strong className="text-white text-base">{formData.district}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">व्यवसाय का क्षेत्र:</span>
                    <strong className="text-white text-base">{formData.sector}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">सक्रिय लोन:</span>
                    <strong className={formData.existing_loans ? 'text-amber-300' : 'text-emerald-400'}>
                      {formData.existing_loans ? 'हाँ (Active Loan)' : 'नहीं (No Loans)'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">मासिक बिक्री (कमाई):</span>
                    <strong className="text-emerald-400 text-base">
                      ₹{formData.monthly_revenue_est.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-xs">मासिक खर्च:</span>
                    <strong className="text-rose-400 text-base">
                      ₹{formData.monthly_expense_est.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Phone Auth Link */}
            {currentStep === 7 && (
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-white">
                  मोबाइल नंबर / Mobile Number <span className="text-amber-400">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 bg-[#0b1633] text-zinc-400 text-sm border border-r-0 border-[#1f376e] rounded-l-xl">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className="flex-1 bg-[#0b1633] text-white border border-[#1f376e] rounded-r-xl px-4 py-3 text-lg focus:outline-none focus:border-amber-400 font-mono"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-zinc-400">
                  इस नंबर से आप भविष्य में OTP द्वारा कभी भी लॉगिन कर सकेंगे।
                </p>
              </div>
            )}

            {/* Step 8: DPDP Act Consent */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                    <span className="text-lg">🛡️</span>
                    <span>डेटा सुरक्षा एवं गोपनीयता सहमति (DPDP Act 2023)</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    &quot;Do you agree to let us store this information to give you advice?&quot;
                    <br />
                    क्या आप हमें व्यापारिक सलाह (Break-even, Margin) और सरकारी सब्सिडी योजनाएं (PMEGP, Mudra) ढूंढने के लिए यह जानकारी सुरक्षित रूप से सेव करने की अनुमति देते हैं?
                  </p>
                </div>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-[#0b1633] border border-[#1f376e] cursor-pointer hover:border-emerald-400 transition-colors">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent_given}
                    onChange={(e) => setFormData({ ...formData, consent_given: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 border-zinc-700 bg-zinc-900"
                  />
                  <span className="text-xs sm:text-sm text-white font-medium">
                    हाँ, मैं अपनी जानकारी सुरक्षित रूप से सेव करने की अनुमति देता/देती हूँ। (I give consent to store my data)
                  </span>
                </label>
              </div>
            )}

            {/* Error Message Display */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950 border border-rose-500 text-xs text-rose-200 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Button Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-[#1b2d56]">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setCurrentStep((prev) => prev - 1);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#162544] hover:bg-[#1f335c] text-zinc-300 text-xs sm:text-sm font-semibold border border-zinc-700"
                >
                  ← पिछला (Back)
                </button>
              ) : (
                <Link
                  href="/"
                  className="text-xs text-zinc-400 hover:text-white underline"
                >
                  होमपेज (Home)
                </Link>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-sm font-extrabold shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting
                  ? '⏳ खाता तैयार हो रहा है...'
                  : currentStep === 8
                  ? 'सहमति दें और खाता बनाएं (Complete) →'
                  : 'आगे बढ़ें (Next) →'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-[#14203d] py-4 text-center text-xs text-zinc-500">
        साथी व्यापार • सुरक्षित एवं पारदर्शी ग्रामीण वित्तीय प्रणाली
      </footer>
    </div>
  );
}

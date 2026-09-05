import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0B1E33] text-slate-100 flex flex-col font-sans selection:bg-[#C9A24B] selection:text-[#0B1E33]">
      {/* 1. Header */}
      <header className="border-b border-slate-700/60 bg-[#0B1E33]/95 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true">🤝</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Saathi Vyapar
              </span>
              <span className="text-[11px] text-[#C9A24B] font-medium tracking-wide">
                साथी व्यापार
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/facilitator"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:inline"
            >
              Facilitator
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold bg-[#C9A24B] text-[#0B1E33] hover:bg-[#d8b15a] transition-colors shadow-sm"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-[#C9A24B]/10 text-[#C9A24B] border border-[#C9A24B]/30 mb-6">
            <span>SIH26091</span>
            <span>•</span>
            <span>Smart India Hackathon</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
            Saathi Vyapar
          </h1>

          <p className="mt-4 text-lg sm:text-xl font-medium text-[#C9A24B] max-w-3xl mx-auto leading-snug">
            AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs
          </p>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Saathi Vyapar works seamlessly over WhatsApp, SMS, or the web, enabling micro-business owners to access formal financial advisory in simple vernacular language without installing complex apps.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-[#C9A24B] text-[#0B1E33] hover:bg-[#d8b15a] transition-colors text-center shadow-md"
            >
              Get Started / Login
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors text-center"
            >
              View Demo Dashboard
            </Link>
            <Link
              href="/facilitator"
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold bg-transparent text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 transition-colors text-center"
            >
              Facilitator / SHG Portal
            </Link>
          </div>
        </section>

        {/* 3. How It Works Section */}
        <section className="py-16 bg-[#081726] border-y border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How It Works
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                A simple 4-step workflow tailored for rural micro-enterprises and field facilitators.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="bg-[#0B1E33] border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#C9A24B] text-[#0B1E33] text-sm font-bold flex items-center justify-center mb-4">
                    1
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Message Us
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Message us on WhatsApp, SMS, or through the web application to begin the conversation.
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-[#C9A24B] font-medium">
                  WhatsApp • SMS • Web
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#0B1E33] border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#C9A24B] text-[#0B1E33] text-sm font-bold flex items-center justify-center mb-4">
                    2
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Share Business Details
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Share your business details effortlessly by voice note, plain text, or a photo of your handwritten notebook ledger.
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-[#C9A24B] font-medium">
                  Voice • Text • Bahi-Khata Photo
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#0B1E33] border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#C9A24B] text-[#0B1E33] text-sm font-bold flex items-center justify-center mb-4">
                    3
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Get Financial Plan
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Receive a tailored Financial Structuring Plan with deterministic break-even calculations, margin rates, and working capital advice.
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-[#C9A24B] font-medium">
                  Break-Even & Margin Analysis
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#0B1E33] border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-full bg-[#C9A24B] text-[#0B1E33] text-sm font-bold flex items-center justify-center mb-4">
                    4
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    Match Govt Schemes
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    See central and state government schemes you are eligible for, complete with transparent eligibility reasons and direct next steps.
                  </p>
                </div>
                <div className="mt-4 text-[11px] text-[#C9A24B] font-medium">
                  PMEGP • Mudra • PM SVANidhi
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Platform Features
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Built to serve low-connectivity environments and non-technical business owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#081726] border border-slate-700/70 rounded-xl p-6">
              <div className="text-2xl mb-3 text-[#C9A24B]">💬</div>
              <h3 className="text-base font-bold text-white mb-2">
                WhatsApp & SMS Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect via existing messaging channels without requiring app downloads, smartphone upgrades, or high-speed data.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#081726] border border-slate-700/70 rounded-xl p-6">
              <div className="text-2xl mb-3 text-[#C9A24B]">📷</div>
              <h3 className="text-base font-bold text-white mb-2">
                Notebook Photo OCR
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Scan physical bahi-khata and notebook pages using OCR to digitize daily income, expenditure, and cash ledger records automatically.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#081726] border border-slate-700/70 rounded-xl p-6">
              <div className="text-2xl mb-3 text-[#C9A24B]">🧠</div>
              <h3 className="text-base font-bold text-white mb-2">
                Explainable AI Reasoning
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Delivers plain-language explanations in vernacular tongues with strict zero-PII privacy data protection and no financial hallucinations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#081726] border border-slate-700/70 rounded-xl p-6">
              <div className="text-2xl mb-3 text-[#C9A24B]">🏛️</div>
              <h3 className="text-base font-bold text-white mb-2">
                Automatic Government Scheme Matching
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Rules-based matching against 15+ central schemes including PMEGP, Mudra (Shishu, Kishor, Tarun), and PM SVANidhi with exact criteria checks.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#081726] border border-slate-700/70 rounded-xl p-6 md:col-span-2 lg:col-span-2">
              <div className="text-2xl mb-3 text-[#C9A24B]">👥</div>
              <h3 className="text-base font-bold text-white mb-2">
                Facilitator & SHG Mode
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Empowers field coordinators, Self-Help Group (SHG) leaders, and CSC operators to manage cohorts, onboard micro-enterprises, and track financial progress.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 5. Footer */}
      <footer className="bg-[#081726] border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-sm font-semibold text-white">
              Saathi Vyapar
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Developed by <span className="text-[#C9A24B] font-medium">Pantheon Eternal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/facilitator"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Facilitator
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#C9A24B] text-[#0B1E33] hover:bg-[#d8b15a] transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

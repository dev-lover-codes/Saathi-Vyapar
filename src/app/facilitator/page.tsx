/**
 * src/app/facilitator/page.tsx
 *
 * Facilitator Dashboard
 * Allows field officers, SHG leaders, and CSC operators to monitor
 * and assist multiple rural micro-entrepreneurs.
 */

import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import AddEntrepreneurModal from './AddEntrepreneurModal';

interface EntrepreneurViewItem {
  id: string;
  name: string;
  phone: string;
  sector: string;
  monthly_revenue: number;
  monthly_expense: number;
  lastPlanDate: string | null;
  marginPercent: number | null;
  cashFlowRisk: string | null;
}

export const dynamic = 'force-dynamic';

export default async function FacilitatorPage() {
  // 1. Fetch all users who have the role of entrepreneur
  const { data: usersData } = await supabaseServer
    .from('users')
    .select('id, name, phone, language, created_at')
    .eq('role', 'entrepreneur')
    .order('created_at', { ascending: false });

  const entrepreneurs: EntrepreneurViewItem[] = [];

  for (const u of usersData || []) {
    // Fetch profile
    const { data: profile } = await supabaseServer
      .from('business_profiles')
      .select('sector, monthly_revenue_est, monthly_expense_est')
      .eq('user_id', u.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Fetch latest plan
    const { data: plan } = await supabaseServer
      .from('financial_plans')
      .select('margin_percent, plan_json, created_at')
      .eq('user_id', u.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    const planJson = plan?.plan_json as {
      financialMetrics?: { cashFlowRisk?: string };
    } | null;

    entrepreneurs.push({
      id: u.id,
      name: u.name || 'उद्यमी (Entrepreneur)',
      phone: u.phone,
      sector: profile?.sector || 'अनिर्दिष्ट (General)',
      monthly_revenue: Number(profile?.monthly_revenue_est) || 0,
      monthly_expense: Number(profile?.monthly_expense_est) || 0,
      lastPlanDate: plan?.created_at || null,
      marginPercent: plan?.margin_percent ? Number(plan.margin_percent) : null,
      cashFlowRisk: planJson?.financialMetrics?.cashFlowRisk || null,
    });
  }

  return (
    <div className="min-h-screen bg-[#031610] text-[#fdfcf7] p-3 sm:p-6 pb-24 font-sans selection:bg-[#10b981] selection:text-[#022c22] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* ── Top Header ────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0d382b] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🤝</span>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                सुविधाकर्ता डैशबोर्ड / Facilitator Hub
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Field Ops
                </span>
              </h1>
            </div>
            <p className="text-emerald-200/70 text-xs sm:text-sm mt-0.5">
              ग्रामीण उद्यमियों की सहायता और वित्तीय निगरानी प्रणाली (Field Assistant Portal)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AddEntrepreneurModal />
            <Link
              href="/dashboard"
              className="px-3.5 py-2 bg-[#06241b] hover:bg-[#0b382a] text-emerald-300 text-xs font-bold rounded-xl border border-[#134e3d] shadow-sm transition-all"
            >
              ← उद्यमी दृश्य (Entrepreneur View)
            </Link>
          </div>
        </header>

        <main className="space-y-6">
          {/* ── Stats Overview ───────────────────────────────────────── */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-[#06241b]/95 border-2 border-[#134e3d] rounded-2xl p-4 shadow-lg">
              <span className="text-emerald-300/80 text-xs font-bold uppercase">कुल पंजीकृत उद्यमी</span>
              <p className="text-3xl font-black text-white mt-1">{entrepreneurs.length}</p>
              <p className="text-[11px] text-emerald-400/60 mt-1">Total Registered Entrepreneurs</p>
            </div>

            <div className="bg-[#06241b]/95 border-2 border-[#134e3d] rounded-2xl p-4 shadow-lg">
              <span className="text-emerald-300/80 text-xs font-bold uppercase">प्लान जनरेटेड</span>
              <p className="text-3xl font-black text-emerald-400 mt-1">
                {entrepreneurs.filter((e) => e.lastPlanDate).length}
              </p>
              <p className="text-[11px] text-emerald-400/60 mt-1">Active Financial Plans</p>
            </div>

            <div className="bg-[#06241b]/95 border-2 border-[#134e3d] rounded-2xl p-4 shadow-lg">
              <span className="text-emerald-300/80 text-xs font-bold uppercase">औसत मासिक आय</span>
              <p className="text-3xl font-black text-amber-300 mt-1">
                ₹
                {entrepreneurs.length > 0
                  ? Math.round(
                      entrepreneurs.reduce((sum, e) => sum + e.monthly_revenue, 0) /
                        entrepreneurs.length
                    ).toLocaleString('en-IN')
                  : '0'}
              </p>
              <p className="text-[11px] text-emerald-400/60 mt-1">Avg. Monthly Revenue</p>
            </div>

            <div className="bg-[#06241b]/95 border-2 border-[#134e3d] rounded-2xl p-4 shadow-lg">
              <span className="text-emerald-300/80 text-xs font-bold uppercase">उच्च जोखिम मामले</span>
              <p className="text-3xl font-black text-rose-400 mt-1">
                {entrepreneurs.filter((e) => e.cashFlowRisk === 'high').length}
              </p>
              <p className="text-[11px] text-emerald-400/60 mt-1">High Risk Profiles</p>
            </div>
          </section>

          {/* ── Entrepreneurs Table ───────────────────────────────────── */}
          <section className="bg-[#06241b]/95 border-2 border-[#134e3d] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                📋 उद्यमियों की सूची / Entrepreneur Directory
              </h2>
              <span className="text-xs text-emerald-300/70">
                {entrepreneurs.length} उद्यमी जुड़े हुए हैं
              </span>
            </div>

            {entrepreneurs.length === 0 ? (
              <div className="text-center py-12 text-emerald-400/60 space-y-2">
                <p className="text-lg">अभी कोई उद्यमी पंजीकृत नहीं है।</p>
                <p className="text-xs">
                  ऊपर दिए गए &quot;नया उद्यमी जोड़ें&quot; बटन से पहला उद्यमी जोड़ें।
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#0d382b] text-emerald-300/80 text-xs uppercase font-extrabold">
                      <th className="pb-3 px-3">उद्यमी / Name</th>
                      <th className="pb-3 px-3">क्षेत्र / Sector</th>
                      <th className="pb-3 px-3">मासिक आय / खर्च</th>
                      <th className="pb-3 px-3">मुनाफा / जोखिम</th>
                      <th className="pb-3 px-3">अंतिम प्लान तारीख</th>
                      <th className="pb-3 px-3 text-right">कार्रवाई / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0d382b]">
                    {entrepreneurs.map((item) => (
                      <tr key={item.id} className="hover:bg-[#02130e]/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-xs text-emerald-200/60">{item.phone}</div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 bg-[#02130e] border border-[#134e3d] rounded-xl text-xs text-emerald-200 font-medium">
                            {item.sector}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-emerald-400 font-bold">
                            ₹{item.monthly_revenue.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-rose-400">
                            खर्च: ₹{item.monthly_expense.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {item.marginPercent !== null ? (
                            <div className="space-y-1">
                              <span
                                className={`text-xs font-black ${
                                  item.marginPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                                }`}
                              >
                                {item.marginPercent.toFixed(1)}%
                              </span>
                              {item.cashFlowRisk && (
                                <div className="text-[10px] uppercase font-bold text-emerald-300/60">
                                  जोखिम: {item.cashFlowRisk}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-emerald-400/50">कोई प्लान नहीं</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-xs text-emerald-300/60">
                          {item.lastPlanDate
                            ? new Date(item.lastPlanDate).toLocaleDateString('hi-IN')
                            : 'लंबित (Pending)'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            href={`/dashboard?user_id=${item.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 text-xs font-black rounded-xl transition-all shadow-sm"
                          >
                            प्लान देखें (View Plan) →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1B1B1B] p-3 sm:p-6 pb-24 font-['Poppins',sans-serif] selection:bg-[#151515] selection:text-white relative overflow-hidden">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,65,108,0.06),transparent_70%)] blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(255,75,43,0.04),transparent_70%)] blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* ── Top Header ────────────────────────────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E2E1] pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">🤝</span>
              <h1 className="text-2xl font-black tracking-tight text-[#151515] flex items-center gap-2">
                सुविधाकर्ता डैशबोर्ड / Facilitator Hub
                <span className="text-[11px] font-bold bg-[#F0EFEB] text-[#151515] border border-[#E5E2E1] px-2.5 py-0.5 rounded-full">
                  Field Ops
                </span>
              </h1>
            </div>
            <p className="text-[#8C8880] text-xs sm:text-sm mt-0.5">
              ग्रामीण उद्यमियों की सहायता और वित्तीय निगरानी प्रणाली (Field Assistant Portal)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AddEntrepreneurModal />
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-white hover:bg-[#F0EFEB] text-[#151515] text-xs font-semibold rounded-full border border-[#E5E2E1] shadow-xs transition-all"
            >
              ← उद्यमी दृश्य (Entrepreneur View)
            </Link>
          </div>
        </header>

        <main className="space-y-6">
          {/* ── Stats Overview ───────────────────────────────────────── */}
          <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white/95 border border-[#E5E2E1] rounded-[24px] p-5 shadow-[0_8px_24px_rgba(27,27,27,0.04)]">
              <span className="text-[#8C8880] text-xs font-bold uppercase tracking-wider">कुल पंजीकृत उद्यमी</span>
              <p className="text-3xl font-extrabold text-[#151515] mt-1">{entrepreneurs.length}</p>
              <p className="text-[11px] text-[#8C8880] mt-1">Total Registered</p>
            </div>

            <div className="bg-white/95 border border-[#E5E2E1] rounded-[24px] p-5 shadow-[0_8px_24px_rgba(27,27,27,0.04)]">
              <span className="text-[#8C8880] text-xs font-bold uppercase tracking-wider">प्लान जनरेटेड</span>
              <p className="text-3xl font-extrabold text-emerald-700 mt-1">
                {entrepreneurs.filter((e) => e.lastPlanDate).length}
              </p>
              <p className="text-[11px] text-[#8C8880] mt-1">Active Financial Plans</p>
            </div>

            <div className="bg-white/95 border border-[#E5E2E1] rounded-[24px] p-5 shadow-[0_8px_24px_rgba(27,27,27,0.04)]">
              <span className="text-[#8C8880] text-xs font-bold uppercase tracking-wider">औसत मासिक आय</span>
              <p className="text-3xl font-extrabold text-[#151515] mt-1">
                ₹
                {entrepreneurs.length > 0
                  ? Math.round(
                      entrepreneurs.reduce((sum, e) => sum + e.monthly_revenue, 0) /
                        entrepreneurs.length
                    ).toLocaleString('en-IN')
                  : '0'}
              </p>
              <p className="text-[11px] text-[#8C8880] mt-1">Avg. Monthly Revenue</p>
            </div>

            <div className="bg-white/95 border border-[#E5E2E1] rounded-[24px] p-5 shadow-[0_8px_24px_rgba(27,27,27,0.04)]">
              <span className="text-[#8C8880] text-xs font-bold uppercase tracking-wider">उच्च जोखिम मामले</span>
              <p className="text-3xl font-extrabold text-[#FF416C] mt-1">
                {entrepreneurs.filter((e) => e.cashFlowRisk === 'high').length}
              </p>
              <p className="text-[11px] text-[#8C8880] mt-1">High Risk Profiles</p>
            </div>
          </section>

          {/* ── Entrepreneurs Table ───────────────────────────────────── */}
          <section className="bg-white/95 border border-[#E5E2E1] rounded-[24px] p-5 sm:p-6 shadow-[0_10px_30px_rgba(27,27,27,0.05)] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#151515] flex items-center gap-2">
                📋 उद्यमियों की सूची / Entrepreneur Directory
              </h2>
              <span className="text-xs text-[#8C8880]">
                {entrepreneurs.length} उद्यमी जुड़े हुए हैं
              </span>
            </div>

            {entrepreneurs.length === 0 ? (
              <div className="text-center py-12 text-[#8C8880] space-y-2">
                <p className="text-lg font-semibold text-[#151515]">अभी कोई उद्यमी पंजीकृत नहीं है।</p>
                <p className="text-xs text-[#8C8880]">
                  ऊपर दिए गए &quot;नया उद्यमी जोड़ें&quot; बटन से पहला उद्यमी जोड़ें।
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E2E1] text-[#8C8880] text-xs uppercase font-bold">
                      <th className="pb-3 px-3">उद्यमी / Name</th>
                      <th className="pb-3 px-3">क्षेत्र / Sector</th>
                      <th className="pb-3 px-3">मासिक आय / खर्च</th>
                      <th className="pb-3 px-3">मुनाफा / जोखिम</th>
                      <th className="pb-3 px-3">अंतिम प्लान तारीख</th>
                      <th className="pb-3 px-3 text-right">कार्रवाई / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E2E1]">
                    {entrepreneurs.map((item) => (
                      <tr key={item.id} className="hover:bg-[#F4F3EF]/60 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-[#151515]">{item.name}</div>
                          <div className="text-xs text-[#8C8880]">{item.phone}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-3 py-1 bg-[#F0EFEB] border border-[#E5E2E1] rounded-full text-xs text-[#151515] font-medium capitalize">
                            {item.sector}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-[#151515] font-bold">
                            ₹{item.monthly_revenue.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[11px] text-[#FF416C]">
                            खर्च: ₹{item.monthly_expense.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          {item.marginPercent !== null ? (
                            <div className="space-y-0.5">
                              <span
                                className={`text-xs font-bold ${
                                  item.marginPercent >= 0 ? 'text-emerald-700' : 'text-[#FF416C]'
                                }`}
                              >
                                {item.marginPercent.toFixed(1)}%
                              </span>
                              {item.cashFlowRisk && (
                                <div className="text-[10px] uppercase font-bold text-[#8C8880]">
                                  जोखिम: {item.cashFlowRisk}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-[#8C8880]">कोई प्लान नहीं</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-[#8C8880]">
                          {item.lastPlanDate
                            ? new Date(item.lastPlanDate).toLocaleDateString('hi-IN')
                            : 'लंबित (Pending)'}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href={`/dashboard?user_id=${item.id}`}
                            className="inline-flex items-center px-4 py-2 bg-[#151515] hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-full transition-all shadow-xs"
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

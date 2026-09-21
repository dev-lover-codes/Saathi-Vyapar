/**
 * src/app/api/keepalive/route.ts
 *
 * GET /api/keepalive
 *
 * Health check endpoint — no auth required.
 * Pings every core table (users, schemes, business_profiles, financial_plans,
 * ledger_entries, business_guides, facilitators, khata_customers) to verify
 * DB connectivity and row counts.
 *
 * Safe for UptimeRobot / external monitoring:
 *   - Always returns HTTP 200 (degraded status is in the JSON body).
 *   - Cache-Control: no-store so monitors get fresh data every poll.
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { describeLlm } from '@/lib/llm/provider';

/** Tables to health-check on every ping */
const WATCHED_TABLES = [
  'users',
  'schemes',
  'business_profiles',
  'financial_plans',
  'ledger_entries',
  'business_guides',
  'facilitators',
  'khata_customers',
] as const;

type TableName = (typeof WATCHED_TABLES)[number];

export async function GET() {
  const startMs = Date.now();

  const tablesOk: TableName[] = [];
  const tablesError: TableName[] = [];
  const tableCounts: Record<string, number> = {};
  let dbStatus: 'ok' | 'error' = 'ok';
  let errorDetail: string | null = null;

  // Ping every watched table in parallel
  await Promise.all(
    WATCHED_TABLES.map(async (table) => {
      try {
        const { count, error } = await supabaseServer
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`Keepalive: table "${table}" error:`, error.message);
          tablesError.push(table);
          dbStatus = 'error';
          errorDetail = errorDetail ?? error.message;
        } else {
          tablesOk.push(table);
          tableCounts[table] = count ?? 0;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Keepalive: table "${table}" threw:`, msg);
        tablesError.push(table);
        dbStatus = 'error';
        errorDetail = errorDetail ?? msg;
      }
    }),
  );

  const latencyMs = Date.now() - startMs;

  const overall =
    dbStatus === 'ok'
      ? 'ok'
      : tablesOk.length > 0
      ? 'degraded'
      : 'down';

  return NextResponse.json(
    {
      status: overall,
      timestamp: new Date().toISOString(),
      latency_ms: latencyMs,
      db: dbStatus,
      // Which model is serving, so a demo can be checked at a glance.
      llm: describeLlm(),
      tables_ok: tablesOk,
      tables_error: tablesError,
      counts: tableCounts,
      error: errorDetail,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    },
  );
}

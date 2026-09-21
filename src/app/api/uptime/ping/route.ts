/**
 * src/app/api/uptime/ping/route.ts
 *
 * GET /api/uptime/ping
 *
 * Called by UptimeRobot (or a cron job) to:
 *  1. Health-check all core tables.
 *  2. Write a snapshot row to `uptime_logs` so the /uptime dashboard shows
 *     historical availability.
 *
 * UptimeRobot config:
 *   Monitor type : HTTP(s)
 *   URL          : https://<your-domain>/api/uptime/ping
 *   Interval     : 5 minutes
 *   Alert keyword: "status":"ok"   (keyword monitor for up/down detection)
 */

import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

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

export async function GET(request: Request) {
  const startMs = Date.now();

  const tablesOk: TableName[] = [];
  const tablesError: TableName[] = [];
  const tableCounts: Record<string, number> = {};
  let dbStatus: 'ok' | 'error' = 'ok';
  let errorDetail: string | null = null;

  // ── 1. Ping all tables in parallel ────────────────────────────────────────
  await Promise.all(
    WATCHED_TABLES.map(async (table) => {
      try {
        const { count, error } = await supabaseServer
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          tablesError.push(table);
          dbStatus = 'error';
          errorDetail = errorDetail ?? error.message;
        } else {
          tablesOk.push(table);
          tableCounts[table] = count ?? 0;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        tablesError.push(table);
        dbStatus = 'error';
        errorDetail = errorDetail ?? msg;
      }
    }),
  );

  const latencyMs = Date.now() - startMs;
  const overall: 'ok' | 'degraded' | 'down' =
    dbStatus === 'ok' ? 'ok' : tablesOk.length > 0 ? 'degraded' : 'down';

  // Detect caller (UptimeRobot sends a specific user-agent)
  const ua = request.headers.get('user-agent') ?? '';
  const source = ua.toLowerCase().includes('uptimerobot')
    ? 'uptimerobot'
    : 'api';

  // ── 2. Write snapshot to uptime_logs ──────────────────────────────────────
  try {
    const { error: insertError } = await supabaseServer
      .from('uptime_logs')
      .insert({
        overall,
        latency_ms: latencyMs,
        db_status: dbStatus,
        tables_ok: tablesOk,
        tables_error: tablesError,
        error_detail: errorDetail,
        source,
      });

    if (insertError) {
      console.error('uptime/ping: could not write log row:', insertError.message);
    }
  } catch (err) {
    // Don't crash the health endpoint if the log write fails
    console.error('uptime/ping: log write threw:', err);
  }

  // ── 3. Return JSON that UptimeRobot can keyword-monitor ───────────────────
  return NextResponse.json(
    {
      status: overall,         // "ok" | "degraded" | "down"
      timestamp: new Date().toISOString(),
      latency_ms: latencyMs,
      db: dbStatus,
      tables_ok: tablesOk,
      tables_error: tablesError,
      counts: tableCounts,
      error: errorDetail,
    },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    },
  );
}

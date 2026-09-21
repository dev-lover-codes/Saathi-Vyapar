/**
 * src/app/uptime/page.tsx
 *
 * /uptime — Live System Status Dashboard
 *
 * Shows:
 *  • Current DB health across all 8 core tables
 *  • Average uptime % over last 24 h / 7 days from uptime_logs
 *  • Last 100 ping log entries (timeline)
 *  • One-click "Ping Now" to trigger a fresh check
 */

'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface PingResult {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  latency_ms: number;
  db: string;
  tables_ok: string[];
  tables_error: string[];
  counts: Record<string, number>;
  error: string | null;
}

interface UptimeLog {
  id: string;
  checked_at: string;
  overall: 'ok' | 'degraded' | 'down';
  latency_ms: number | null;
  db_status: string;
  tables_ok: string[];
  tables_error: string[];
  error_detail: string | null;
  source: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_COLOR: Record<string, string> = {
  ok: '#10B981',
  degraded: '#F59E0B',
  down: '#EF4444',
  loading: '#6B7280',
};

const STATUS_LABEL: Record<string, string> = {
  ok: '✅ Operational',
  degraded: '⚠️ Degraded',
  down: '🔴 Down',
  loading: '⏳ Checking…',
};

function pct(logs: UptimeLog[]) {
  if (!logs.length) return null;
  const ok = logs.filter((l) => l.overall === 'ok').length;
  return ((ok / logs.length) * 100).toFixed(2);
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const TABLES = [
  'users',
  'schemes',
  'business_profiles',
  'financial_plans',
  'ledger_entries',
  'business_guides',
  'facilitators',
  'khata_customers',
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function UptimePage() {
  const [ping, setPing] = useState<PingResult | null>(null);
  const [logs, setLogs] = useState<UptimeLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);
  // "now" updated inside effects/callbacks — never called during render body
  const [nowTs, setNowTs] = useState<number>(0);

  // ── Fetch live ping ──────────────────────────────────────────────────────
  const doPing = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/uptime/ping', { cache: 'no-store' });
      const data = await res.json();
      setPing(data as PingResult);
      setLastRefreshed(new Date().toLocaleTimeString('en-IN'));
    } catch {
      setPing({
        status: 'down',
        timestamp: new Date().toISOString(),
        latency_ms: 0,
        db: 'error',
        tables_ok: [],
        tables_error: TABLES,
        counts: {},
        error: 'Network error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch uptime_logs from Supabase anon key ─────────────────────────────
  const fetchLogs = useCallback(async () => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!url || url.includes('placeholder')) return;

      const res = await fetch(
        `${url}/rest/v1/uptime_logs?select=*&order=checked_at.desc&limit=200`,
        { headers: { apikey: key!, Authorization: `Bearer ${key}` } },
      );
      if (res.ok) {
        const rows: UptimeLog[] = await res.json();
        setLogs(rows);
        setNowTs(Date.now()); // set in async callback (not render body) — valid
      }
    } catch {
      // silently ignore — logs are supplementary
    }
  }, []);

  // ── Initial load ──────────────────────────────────────────────────────────
  // Wrapped in setTimeout to avoid setState-during-render lint errors
  useEffect(() => {
    const id = setTimeout(() => {
      doPing();
      fetchLogs();
    }, 0);
    return () => clearTimeout(id);
  }, [doPing, fetchLogs]);

  // ── Auto-refresh every 60 s ───────────────────────────────────────────────
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(() => {
      doPing();
      fetchLogs();
    }, 60_000);
    return () => clearInterval(id);
  }, [autoRefresh, doPing, fetchLogs]);

  // ── Derived stats ─────────────────────────────────────────────────────────
  // nowTs is set via setNowTs(Date.now()) inside fetchLogs (async callback).
  // Reading it here is pure — it's just a state value.
  const { logs24h, logs7d, barLogs } = useMemo(() => {
    return {
      logs24h: logs.filter(
        (l) => nowTs - new Date(l.checked_at).getTime() < 24 * 3_600_000,
      ),
      logs7d: logs.filter(
        (l) => nowTs - new Date(l.checked_at).getTime() < 7 * 86_400_000,
      ),
      barLogs: logs.slice(0, 60).reverse(),
    };
  }, [logs, nowTs]);

  const status = loading ? 'loading' : (ping?.status ?? 'loading');
  const color = STATUS_COLOR[status];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#0B1E33', minHeight: '100vh', color: '#F5F1E6' }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header style={{ background: '#071528', borderBottom: '1px solid #1E3A5F', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/Logo.png" alt="Saathi Vyapar" style={{ height: 36, width: 'auto' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#C9A24B' }}>Saathi Vyapar</div>
            <div style={{ fontSize: 11, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>System Status</div>
          </div>
        </div>
        <Link href="/" style={{ color: '#C9A24B', textDecoration: 'none', fontSize: 13, border: '1px solid #C9A24B44', borderRadius: 20, padding: '6px 16px' }}>← Back to App</Link>
      </header>

      <main style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
        {/* ── Hero Status Card ─────────────────────────────────────────────── */}
        <div style={{ background: '#0D2540', border: `2px solid ${color}44`, borderRadius: 20, padding: '32px 28px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${color}22`, border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
            {status === 'ok' ? '✅' : status === 'degraded' ? '⚠️' : status === 'down' ? '🔴' : '⏳'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4 }}>{STATUS_LABEL[status]}</div>
            <div style={{ fontSize: 14, color: '#94A3B8' }}>
              {ping ? `Last checked: ${fmtDate(ping.timestamp)} at ${fmtTime(ping.timestamp)}` : 'Fetching status…'}
              {ping?.latency_ms != null && ` · ${ping.latency_ms} ms`}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <button
              onClick={() => { doPing(); fetchLogs(); }}
              disabled={loading}
              style={{ background: '#C9A24B', color: '#0B1E33', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}
            >
              {loading ? '⏳ Pinging…' : '🔄 Ping Now'}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94A3B8', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
              Auto-refresh (60 s)
            </label>
          </div>
        </div>

        {/* ── Uptime % Stats ───────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Uptime (24 h)', value: pct(logs24h) ? `${pct(logs24h)}%` : '—', sub: `${logs24h.length} pings` },
            { label: 'Uptime (7 days)', value: pct(logs7d) ? `${pct(logs7d)}%` : '—', sub: `${logs7d.length} pings` },
            { label: 'Avg Latency (24 h)', value: logs24h.filter(l => l.latency_ms).length ? `${Math.round(logs24h.filter(l => l.latency_ms).reduce((s, l) => s + (l.latency_ms ?? 0), 0) / logs24h.filter(l => l.latency_ms).length)} ms` : '—', sub: 'DB round-trip' },
            { label: 'Tables Monitored', value: TABLES.length.toString(), sub: 'Supabase tables' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{ background: '#0D2540', borderRadius: 16, padding: '20px', border: '1px solid #1E3A5F' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#C9A24B', marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F1E6', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: '#64748B' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Per-table Status Grid ────────────────────────────────────────── */}
        <section style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#C9A24B', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Table Health</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {TABLES.map((table) => {
              const ok = ping?.tables_ok?.includes(table);
              const err = ping?.tables_error?.includes(table);
              const tStatus = loading ? 'loading' : ok ? 'ok' : err ? 'down' : 'loading';
              const tColor = STATUS_COLOR[tStatus];
              return (
                <div key={table} style={{ background: '#0D2540', borderRadius: 12, padding: '14px 16px', border: `1px solid ${tColor}44`, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: tColor, flexShrink: 0, boxShadow: `0 0 8px ${tColor}88` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#F5F1E6', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{table}</div>
                    <div style={{ fontSize: 11, color: '#64748B' }}>
                      {ping?.counts?.[table] != null ? `${ping.counts[table]} rows` : '—'}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: tColor, textTransform: 'uppercase' }}>
                    {tStatus === 'loading' ? '…' : tStatus}
                  </div>
                </div>
              );
            })}
          </div>
          {ping?.error && (
            <div style={{ marginTop: 12, background: '#3B0E0E', border: '1px solid #EF444444', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#FCA5A5', fontFamily: 'monospace' }}>
              ⚠ {ping.error}
            </div>
          )}
        </section>

        {/* ── 60-Ping Timeline Bar ─────────────────────────────────────────── */}
        {barLogs.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#C9A24B', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Pings (last 60)</h2>
            <div style={{ background: '#0D2540', borderRadius: 16, padding: '20px', border: '1px solid #1E3A5F' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60, overflowX: 'auto' }}>
                {barLogs.map((log) => {
                  const c = STATUS_COLOR[log.overall] ?? '#6B7280';
                  const latH = log.latency_ms ? Math.min((log.latency_ms / 2000) * 100, 100) : 20;
                  return (
                    <div
                      key={log.id}
                      title={`${fmtDate(log.checked_at)} ${fmtTime(log.checked_at)}\nStatus: ${log.overall}\nLatency: ${log.latency_ms ?? '?'} ms`}
                      style={{ flex: 1, minWidth: 6, maxWidth: 14, height: `${Math.max(latH, 14)}%`, background: c, borderRadius: '3px 3px 0 0', cursor: 'default', opacity: 0.85 }}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: '#475569' }}>
                <span>Oldest</span>
                <span>Latest</span>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                {[['ok', '✅ OK'], ['degraded', '⚠️ Degraded'], ['down', '🔴 Down']].map(([s, label]) => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94A3B8' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: STATUS_COLOR[s] }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Recent Log Table ─────────────────────────────────────────────── */}
        {logs.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#C9A24B', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Ping History</h2>
            <div style={{ background: '#0D2540', borderRadius: 16, border: '1px solid #1E3A5F', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#071528', borderBottom: '1px solid #1E3A5F' }}>
                      {['Time', 'Status', 'Latency', 'Tables OK', 'Tables Err', 'Source'].map((h) => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logs.slice(0, 50).map((log, i) => {
                      const c = STATUS_COLOR[log.overall];
                      return (
                        <tr key={log.id} style={{ borderBottom: '1px solid #112035', background: i % 2 === 0 ? 'transparent' : '#071528' }}>
                          <td style={{ padding: '8px 14px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                            {fmtDate(log.checked_at)}<br />
                            <span style={{ color: '#475569' }}>{fmtTime(log.checked_at)}</span>
                          </td>
                          <td style={{ padding: '8px 14px' }}>
                            <span style={{ color: c, fontWeight: 700, fontSize: 11, textTransform: 'uppercase' }}>
                              {log.overall === 'ok' ? '✅' : log.overall === 'degraded' ? '⚠️' : '🔴'} {log.overall}
                            </span>
                          </td>
                          <td style={{ padding: '8px 14px', color: '#94A3B8' }}>{log.latency_ms != null ? `${log.latency_ms} ms` : '—'}</td>
                          <td style={{ padding: '8px 14px', color: '#10B981', fontFamily: 'monospace', fontSize: 11 }}>{(log.tables_ok ?? []).length}</td>
                          <td style={{ padding: '8px 14px', color: (log.tables_error ?? []).length ? '#EF4444' : '#64748B', fontFamily: 'monospace', fontSize: 11 }}>
                            {(log.tables_error ?? []).length || '—'}
                            {(log.tables_error ?? []).length > 0 && <div style={{ color: '#EF4444', fontSize: 10 }}>{(log.tables_error ?? []).join(', ')}</div>}
                          </td>
                          <td style={{ padding: '8px 14px', color: '#64748B', fontFamily: 'monospace', fontSize: 11 }}>{log.source}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── UptimeRobot Setup Guide ──────────────────────────────────────── */}
        <section>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#C9A24B', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>UptimeRobot Setup Guide</h2>
          <div style={{ background: '#0D2540', borderRadius: 16, padding: '24px', border: '1px solid #1E3A5F' }}>
            <ol style={{ paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { n: 1, title: 'Create a free account', body: 'Go to uptimerobot.com and sign up for a free account (up to 50 monitors at 5-minute intervals).' },
                { n: 2, title: 'Add a new monitor', body: 'Click "Add New Monitor". Choose type: Keyword Monitor (so it checks for "ok" in the response body, not just HTTP 200).' },
                { n: 3, title: 'Set the URL', body: 'URL: https://<your-vercel-domain>/api/uptime/ping\nKeyword to check for: "ok"\nInterval: 5 minutes' },
                { n: 4, title: 'Set alert contacts', body: 'Add your email or phone number. You will receive an alert if the status changes to "degraded" or "down".' },
                { n: 5, title: 'Verify it works', body: 'After saving, UptimeRobot immediately pings the URL. This page will show the first log entry within seconds.' },
              ].map(({ n, title, body }) => (
                <li key={n} style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#C9A24B22', border: '1.5px solid #C9A24B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C9A24B', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{n}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#F5F1E6', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'pre-line', fontFamily: body.includes('\n') ? 'monospace' : 'inherit' }}>{body}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div style={{ marginTop: 20, background: '#071528', borderRadius: 10, padding: '14px', fontFamily: 'monospace', fontSize: 12 }}>
              <div style={{ color: '#64748B', marginBottom: 6 }}># Quick copy — your monitor URL (writes to uptime_logs)</div>
              <div style={{ color: '#C9A24B', wordBreak: 'break-all' }}>
                {'https://<your-domain>/api/uptime/ping'}
              </div>
              <div style={{ color: '#64748B', marginTop: 8, marginBottom: 4 }}># Also available (pure health-check, no DB write):</div>
              <div style={{ color: '#10B981', wordBreak: 'break-all' }}>
                {'https://<your-domain>/api/keepalive'}
              </div>
            </div>

            {lastRefreshed && (
              <div style={{ marginTop: 16, fontSize: 11, color: '#475569', textAlign: 'right' }}>
                Page last refreshed: {lastRefreshed}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

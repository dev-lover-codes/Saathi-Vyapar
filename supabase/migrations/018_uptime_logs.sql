-- ============================================================
--  Migration 007: Uptime Logs Table
--  Saathi Vyapar — Uptime Robot integration
--  Run via: supabase db push
--  Or paste into: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Stores a snapshot of system health per ping
CREATE TABLE IF NOT EXISTS public.uptime_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  overall       TEXT NOT NULL DEFAULT 'ok' CHECK (overall IN ('ok', 'degraded', 'down')),
  latency_ms    INTEGER,                       -- total round-trip ms for the ping
  db_status     TEXT NOT NULL DEFAULT 'ok' CHECK (db_status IN ('ok', 'error')),
  tables_ok     TEXT[] DEFAULT '{}',           -- list of tables that responded correctly
  tables_error  TEXT[] DEFAULT '{}',           -- list of tables that failed
  error_detail  TEXT,                          -- any error message, null if all good
  source        TEXT DEFAULT 'api'             -- 'api' | 'uptimerobot' | 'cron'
);

COMMENT ON TABLE public.uptime_logs IS 'System health ping snapshots recorded by the /api/uptime/ping endpoint';

-- Index for time-series queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_uptime_logs_checked_at ON public.uptime_logs (checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_uptime_logs_overall    ON public.uptime_logs (overall);

-- ============================================================
-- Auto-cleanup: keep only 7 days of logs (prevents unbounded growth)
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_old_uptime_logs()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM public.uptime_logs
  WHERE checked_at < NOW() - INTERVAL '7 days';
  RETURN NEW;
END;
$$;

-- Fire cleanup on every new insert (cheap: deletes only if needed)
DROP TRIGGER IF EXISTS trg_cleanup_uptime_logs ON public.uptime_logs;
CREATE TRIGGER trg_cleanup_uptime_logs
  AFTER INSERT ON public.uptime_logs
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.cleanup_old_uptime_logs();

-- ============================================================
-- RLS: allow public read so the /uptime page can show live data.
--      Only the service-role key (used by API routes) can insert.
-- ============================================================
ALTER TABLE public.uptime_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uptime_logs_public_read" ON public.uptime_logs;
CREATE POLICY "uptime_logs_public_read"
  ON public.uptime_logs
  FOR SELECT
  USING (true);   -- anyone can read status; no PII here

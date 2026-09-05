-- ============================================================
-- Migration: 002_rls_policies.sql
-- Description: Row Level Security (RLS) policies for Saathi Vyapar
-- Ensures entrepreneurs only access their own data, and facilitators
-- can view read-only data for linked entrepreneurs.
-- ============================================================

-- 1. Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilitators_entrepreneurs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- 2. Schemes policies (Public read-only for all users)
-- ------------------------------------------------------------
CREATE POLICY "Schemes are readable by all authenticated users"
  ON schemes FOR SELECT
  TO authenticated, anon
  USING (true);

-- ------------------------------------------------------------
-- 3. Users policies
-- ------------------------------------------------------------
-- User can view own profile or facilitators can view linked entrepreneurs
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR id IN (
      SELECT entrepreneur_id
      FROM facilitators_entrepreneurs
      WHERE facilitator_id = auth.uid()
    )
  );

-- User can update own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- User can insert own profile on signup
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------
-- 4. Business Profiles policies
-- ------------------------------------------------------------
-- User can view own profile, facilitator can view linked entrepreneur profiles
CREATE POLICY "Users and facilitators can view business profiles"
  ON business_profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR user_id IN (
      SELECT entrepreneur_id
      FROM facilitators_entrepreneurs
      WHERE facilitator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own business profile"
  ON business_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own business profile"
  ON business_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 5. Financial Plans policies
-- ------------------------------------------------------------
-- User can view own plans, facilitator can view linked entrepreneur plans
CREATE POLICY "Users and facilitators can view financial plans"
  ON financial_plans FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR user_id IN (
      SELECT entrepreneur_id
      FROM facilitators_entrepreneurs
      WHERE facilitator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own financial plans"
  ON financial_plans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 6. Ledger Entries policies
-- ------------------------------------------------------------
-- User can view own entries, facilitator can view linked entrepreneur entries
CREATE POLICY "Users and facilitators can view ledger entries"
  ON ledger_entries FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR user_id IN (
      SELECT entrepreneur_id
      FROM facilitators_entrepreneurs
      WHERE facilitator_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own ledger entries"
  ON ledger_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ledger entries"
  ON ledger_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ledger entries"
  ON ledger_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 7. Conversations policies
-- ------------------------------------------------------------
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 8. Facilitators-Entrepreneurs link policies
-- ------------------------------------------------------------
-- Facilitators can view their links; Entrepreneurs can see who facilitates them
CREATE POLICY "Facilitators and entrepreneurs can view links"
  ON facilitators_entrepreneurs FOR SELECT
  TO authenticated
  USING (
    auth.uid() = facilitator_id
    OR auth.uid() = entrepreneur_id
  );

-- Facilitators can link new entrepreneurs
CREATE POLICY "Facilitators can add entrepreneur links"
  ON facilitators_entrepreneurs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = facilitator_id);

-- Facilitators can remove links
CREATE POLICY "Facilitators can delete entrepreneur links"
  ON facilitators_entrepreneurs FOR DELETE
  TO authenticated
  USING (auth.uid() = facilitator_id);

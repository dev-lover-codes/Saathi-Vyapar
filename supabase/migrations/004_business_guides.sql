-- ============================================================
-- Migration: 004_business_guides.sql
-- Description: Business Guides table and RLS policies for Saathi Vyapar
-- Allows micro-entrepreneurs to receive and revisit AI-generated
-- 5-stage business transformation roadmaps.
-- ============================================================

-- 1. Create business_guides table
CREATE TABLE IF NOT EXISTS business_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  roadmap_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_business_guides_user_id ON business_guides(user_id);
CREATE INDEX IF NOT EXISTS idx_business_guides_created_at ON business_guides(created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE business_guides ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can view their own guides; facilitators can view guides of linked entrepreneurs
CREATE POLICY "Users and facilitators can view business guides"
  ON business_guides FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR user_id IN (
      SELECT entrepreneur_id
      FROM facilitators_entrepreneurs
      WHERE facilitator_id = auth.uid()
    )
  );

-- Users can insert their own business guides
CREATE POLICY "Users can insert own business guides"
  ON business_guides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own business guides
CREATE POLICY "Users can update own business guides"
  ON business_guides FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own business guides
CREATE POLICY "Users can delete own business guides"
  ON business_guides FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

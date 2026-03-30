-- ============================================================
-- Supabase migration for Huang Portfolio
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Contacts table — stores contact form submissions
CREATE TABLE IF NOT EXISTS contacts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT        NOT NULL CHECK (char_length(name) <= 100),
  email       TEXT        NOT NULL CHECK (char_length(email) <= 254),
  message     TEXT        NOT NULL CHECK (char_length(message) <= 2000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for reading recent contacts
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);

-- 2. Page views table — tracks view counts per resource
CREATE TABLE IF NOT EXISTS page_views (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_type  TEXT    NOT NULL CHECK (resource_type IN ('blog', 'project', 'video')),
  slug           TEXT    NOT NULL CHECK (char_length(slug) <= 200),
  view_count     BIGINT  NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Each (type, slug) pair is unique
  UNIQUE (resource_type, slug)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_page_views_lookup ON page_views (resource_type, slug);

-- 3. RPC function — atomic upsert + increment view count
--    Returns the new view count. Safe from race conditions.
CREATE OR REPLACE FUNCTION increment_page_view(
  p_resource_type TEXT,
  p_slug          TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  INSERT INTO page_views (resource_type, slug, view_count, updated_at)
  VALUES (p_resource_type, p_slug, 1, now())
  ON CONFLICT (resource_type, slug)
  DO UPDATE SET
    view_count = page_views.view_count + 1,
    updated_at = now()
  RETURNING view_count INTO new_count;

  RETURN new_count;
END;
$$;

-- 4. Row Level Security (RLS)
-- Enable RLS on both tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- contacts: allow anonymous INSERT only (no SELECT/UPDATE/DELETE from client)
CREATE POLICY "anon_insert_contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- page_views: allow anonymous SELECT and call the RPC
CREATE POLICY "anon_read_page_views"
  ON page_views
  FOR SELECT
  TO anon
  USING (true);

-- page_views: allow anonymous INSERT/UPDATE via the RPC function
-- The RPC runs as SECURITY INVOKER by default, so we need INSERT+UPDATE
CREATE POLICY "anon_upsert_page_views"
  ON page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "anon_update_page_views"
  ON page_views
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Done! Your portfolio backend is ready.
--
-- Environment variables needed in Cloudflare:
--   SUPABASE_URL     = https://your-project.supabase.co
--   SUPABASE_ANON_KEY = your-anon-key
-- ============================================================

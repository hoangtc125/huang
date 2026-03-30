-- ============================================================
-- Supabase migration for Huang Portfolio
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1) Contacts table
CREATE TABLE IF NOT EXISTS huang_contacts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL CHECK (char_length(name) <= 100),
  email       TEXT NOT NULL CHECK (char_length(email) <= 254),
  message     TEXT NOT NULL CHECK (char_length(message) <= 2000),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_huang_contacts_created_at ON huang_contacts (created_at DESC);

-- 2) Page views table
CREATE TABLE IF NOT EXISTS huang_page_views (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  resource_type  TEXT NOT NULL CHECK (resource_type IN ('blog', 'project', 'video')),
  slug           TEXT NOT NULL CHECK (char_length(slug) <= 200),
  view_count     BIGINT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (resource_type, slug)
);

CREATE INDEX IF NOT EXISTS idx_huang_page_views_lookup ON huang_page_views (resource_type, slug);

-- 3) RPC function: atomic upsert + increment
CREATE OR REPLACE FUNCTION huang_increment_page_view(
  p_resource_type TEXT,
  p_slug          TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  INSERT INTO huang_page_views (resource_type, slug, view_count, updated_at)
  VALUES (p_resource_type, p_slug, 1, now())
  ON CONFLICT (resource_type, slug)
  DO UPDATE SET
    view_count = huang_page_views.view_count + 1,
    updated_at = now()
  RETURNING view_count INTO new_count;

  RETURN new_count;
END;
$$;

-- 4) RLS
ALTER TABLE huang_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE huang_page_views ENABLE ROW LEVEL SECURITY;

-- contacts: allow anonymous INSERT only
DROP POLICY IF EXISTS "huang_anon_insert_contacts" ON huang_contacts;
CREATE POLICY "huang_anon_insert_contacts"
  ON huang_contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- page views: anonymous can read only
DROP POLICY IF EXISTS "huang_anon_read_page_views" ON huang_page_views;
CREATE POLICY "huang_anon_read_page_views"
  ON huang_page_views
  FOR SELECT
  TO anon
  USING (true);

-- cleanup old policy names if they still exist
DROP POLICY IF EXISTS "anon_insert_contacts" ON huang_contacts;
DROP POLICY IF EXISTS "anon_read_page_views" ON huang_page_views;
DROP POLICY IF EXISTS "anon_upsert_page_views" ON huang_page_views;
DROP POLICY IF EXISTS "anon_update_page_views" ON huang_page_views;

-- grant execute only for service role
REVOKE ALL ON FUNCTION huang_increment_page_view(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION huang_increment_page_view(TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION huang_increment_page_view(TEXT, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION huang_increment_page_view(TEXT, TEXT) TO service_role;

-- cleanup legacy function grants (if function still exists)
REVOKE ALL ON FUNCTION increment_page_view(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_page_view(TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION increment_page_view(TEXT, TEXT) FROM authenticated;

-- ============================================================
-- Required env variables:
--   SUPABASE_URL
--   SUPABASE_ANON_KEY
--   SUPABASE_SERVICE_ROLE_KEY
-- ============================================================

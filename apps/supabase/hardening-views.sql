-- Apply this on existing databases to migrate legacy names to huang_*.

-- 1) Rename tables (data preserved)
ALTER TABLE IF EXISTS contacts RENAME TO huang_contacts;
ALTER TABLE IF EXISTS page_views RENAME TO huang_page_views;

-- 2) Rename indexes if they exist
ALTER INDEX IF EXISTS idx_contacts_created_at RENAME TO idx_huang_contacts_created_at;
ALTER INDEX IF EXISTS idx_page_views_lookup RENAME TO idx_huang_page_views_lookup;

-- 3) Recreate RPC on new table name
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

-- 4) Policies
DROP POLICY IF EXISTS "anon_insert_contacts" ON huang_contacts;
DROP POLICY IF EXISTS "anon_read_page_views" ON huang_page_views;
DROP POLICY IF EXISTS "anon_upsert_page_views" ON huang_page_views;
DROP POLICY IF EXISTS "anon_update_page_views" ON huang_page_views;

DROP POLICY IF EXISTS "huang_anon_insert_contacts" ON huang_contacts;
CREATE POLICY "huang_anon_insert_contacts"
  ON huang_contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "huang_anon_read_page_views" ON huang_page_views;
CREATE POLICY "huang_anon_read_page_views"
  ON huang_page_views
  FOR SELECT
  TO anon
  USING (true);

-- 5) Function permissions
REVOKE ALL ON FUNCTION increment_page_view(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION increment_page_view(TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION increment_page_view(TEXT, TEXT) FROM authenticated;

REVOKE ALL ON FUNCTION huang_increment_page_view(TEXT, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION huang_increment_page_view(TEXT, TEXT) FROM anon;
REVOKE ALL ON FUNCTION huang_increment_page_view(TEXT, TEXT) FROM authenticated;
GRANT EXECUTE ON FUNCTION huang_increment_page_view(TEXT, TEXT) TO service_role;

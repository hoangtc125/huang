import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "@/lib/env.server";

/**
 * Supabase client for server-side API routes.
 * No cookie/auth needed — portfolio is public, uses anon key only.
 */
export function createSupabaseServerClient() {
  const env = getSupabaseServerEnv();
  return createClient(env.url, env.anonKey);
}

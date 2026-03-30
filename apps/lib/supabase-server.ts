import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "@/lib/env.server";

/**
 * Supabase client for read-only server routes.
 * No cookie/auth needed; portfolio data is public.
 */
export function createSupabaseServerClient() {
  const env = getSupabaseServerEnv();
  return createClient(env.url, env.anonKey);
}

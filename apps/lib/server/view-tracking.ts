import type { NextFetchEvent, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resolveViewTargetFromPathname } from "@/lib/server/view-route";

const BOT_UA_RE =
  /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|whatsapp|telegram|discord/i;

function shouldSkipTracking(req: NextRequest) {
  if (req.method !== "GET") return true;

  const prefetch = req.headers.get("next-router-prefetch");
  const purpose = req.headers.get("purpose");
  if (prefetch === "1" || purpose === "prefetch") return true;

  const accept = req.headers.get("accept") ?? "";
  if (!accept.includes("text/html")) return true;

  const userAgent = req.headers.get("user-agent") ?? "";
  if (BOT_UA_RE.test(userAgent)) return true;

  return false;
}

export function queueViewIncrement(req: NextRequest, event: NextFetchEvent) {
  if (shouldSkipTracking(req)) return;

  const target = resolveViewTargetFromPathname(req.nextUrl.pathname);
  if (!target) return;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return;

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const timeoutMs = 800;
  const timeoutPromise = new Promise((resolve) => setTimeout(resolve, timeoutMs));

  const incrementPromise = (async () => {
    try {
      await supabase.rpc("huang_increment_page_view", {
        p_resource_type: target.type,
        p_slug: target.slug,
      });
    } catch {
      // no-op: view tracking is best-effort
    }
  })();

  event.waitUntil(
    Promise.race([incrementPromise, timeoutPromise]).catch(() => undefined)
  );
}

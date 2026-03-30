import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { dbError } from "@/lib/server/api-error";

const VALID_TYPES = ["blog", "project", "video"] as const;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? "";
    const slug = searchParams.get("slug") ?? "";

    if (!VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
      return NextResponse.json(
        { error: "Invalid resource type" },
        { status: 400 }
      );
    }

    if (!slug || slug.length > 200 || !SLUG_RE.test(slug)) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("huang_page_views")
      .select("view_count")
      .eq("resource_type", type)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return dbError(error, "views/get");
    }

    return NextResponse.json({ views: data?.view_count ?? 0 });
  } catch (err) {
    return dbError(err, "views/get");
  }
}

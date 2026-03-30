import { NextRequest, NextResponse, type NextFetchEvent } from "next/server";
import { queueViewIncrement } from "@/lib/server/view-tracking";

export function middleware(req: NextRequest, event: NextFetchEvent) {
  queueViewIncrement(req, event);
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};

import { NextResponse } from "next/server";

/**
 * Return a sanitized JSON error response.
 * Logs the real error server-side; sends a generic message to the client.
 */
export function dbError(
  error: unknown,
  context: string,
  statusCode = 500,
  clientMessage = "Loi he thong, vui long thu lai sau"
) {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, msg);
  return NextResponse.json({ error: clientMessage }, { status: statusCode });
}

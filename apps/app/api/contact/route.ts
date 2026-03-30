import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { dbError } from "@/lib/server/api-error";

const NAME_MAX = 100;
const EMAIL_MAX = 254;
const MESSAGE_MAX = 2000;

// Simple email regex — not exhaustive, just sanity check
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ thông tin" },
        { status: 400 }
      );
    }

    if (name.length > NAME_MAX) {
      return NextResponse.json(
        { error: `Tên không được quá ${NAME_MAX} ký tự` },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email) || email.length > EMAIL_MAX) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    if (message.length > MESSAGE_MAX) {
      return NextResponse.json(
        { error: `Nội dung không được quá ${MESSAGE_MAX} ký tự` },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Parameterized query via Supabase SDK — safe from SQL injection
    const { error } = await supabase.from("huang_contacts").insert({
      name,
      email,
      message,
    });

    if (error) {
      return dbError(error, "contact/insert");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return dbError(err, "contact/handler");
  }
}

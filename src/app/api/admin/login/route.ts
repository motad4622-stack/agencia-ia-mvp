import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, adminSessionToken, checkAdminPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  if (!checkAdminPassword(password)) {
    return NextResponse.json({ error: "Password incorreta." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, adminSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });
  return response;
}

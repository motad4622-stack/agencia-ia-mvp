import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_session";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "muda-me";
}

/** Token de sessão determinístico derivado da password do admin (sem base de dados de sessões). */
export function adminSessionToken(): string {
  return crypto.createHmac("sha256", adminPassword()).update("admin-session-v1").digest("hex");
}

export function checkAdminPassword(password: string): boolean {
  const expected = Buffer.from(adminPassword());
  const given = Buffer.from(password || "");
  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(given, expected);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(value) && value === adminSessionToken();
}

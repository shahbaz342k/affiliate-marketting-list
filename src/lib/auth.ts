import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "picks_admin_session";
const DEFAULT_PASSWORD = "admin123";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEFAULT_PASSWORD;
}

export function isUsingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD?.trim();
}

export function getDefaultPassword(): string {
  return DEFAULT_PASSWORD;
}

function getSecret(): string {
  return process.env.AUTH_SECRET?.trim() || `picks-dev-secret::${getAdminPassword()}`;
}

function safeEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/** A deterministic session token derived from the secret + password. Rotates when either changes. */
export function sessionToken(): string {
  return createHmac("sha256", getSecret())
    .update(`admin-session:${getAdminPassword()}`)
    .digest("hex");
}

export function verifyPassword(input: string): boolean {
  return safeEqual(input, getAdminPassword());
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}

export async function requireAdmin(nextPath = "/admin"): Promise<void> {
  if (!(await isAdmin())) {
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }
}

export async function createAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

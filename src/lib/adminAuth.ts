import { cookies } from "next/headers";

export const ADMIN_AUTH_COOKIE_NAME = "ai_os_admin_session";

export interface AdminSession {
  userId: string;
  name: string;
  email: string;
  role: "admin";
  authenticatedAt: string;
}

export function parseAdminSessionCookie(cookieValue?: string): AdminSession | null {
  if (!cookieValue) return null;
  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as AdminSession;
    if (parsed.userId && parsed.role === "admin") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(ADMIN_AUTH_COOKIE_NAME);
  return parseAdminSessionCookie(sessionCookie?.value);
}

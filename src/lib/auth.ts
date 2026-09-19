import { cookies } from "next/headers";
import { CustomerRole } from "./types";

export const AUTH_COOKIE_NAME = "ai_os_customer_session";

export interface CustomerSession {
  customerId: string;
  role: CustomerRole;
  name: string;
  email: string;
  authenticatedAt: string;
}

export function parseSessionCookie(cookieValue?: string): CustomerSession | null {
  if (!cookieValue) return null;
  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as CustomerSession;
    if (parsed.role === "customer" && parsed.customerId) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentCustomerSession(): Promise<CustomerSession | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return parseSessionCookie(sessionCookie?.value);
}

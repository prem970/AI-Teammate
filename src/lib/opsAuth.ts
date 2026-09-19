import { cookies } from "next/headers";
import { EmployeeRole, EmployeeUser } from "./opsTypes";
import { MOCK_EMPLOYEES } from "./opsMockData";

export const OPS_AUTH_COOKIE_NAME = "ai_os_ops_session";

export interface OpsSession {
  userId: string;
  name: string;
  email: string;
  role: EmployeeRole;
  department: string;
  badgeId: string;
  authenticatedAt: string;
}

export function parseOpsSessionCookie(cookieValue?: string): OpsSession | null {
  if (!cookieValue) return null;
  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded) as OpsSession;
    if (
      parsed.userId &&
      (parsed.role === "support" ||
        parsed.role === "sales_ops" ||
        parsed.role === "policy_owner")
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getCurrentOpsSession(): Promise<OpsSession | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(OPS_AUTH_COOKIE_NAME);
  return parseOpsSessionCookie(sessionCookie?.value);
}

export function getEmployeeForRole(role: EmployeeRole): EmployeeUser {
  return MOCK_EMPLOYEES[role] || MOCK_EMPLOYEES.support;
}

import { redirect } from "next/navigation";
import { getCurrentCustomerSession } from "@/lib/auth";

export default async function RootPage() {
  const session = await getCurrentCustomerSession();
  if (session && session.role === "customer") {
    redirect("/customer");
  } else {
    redirect("/login/customer");
  }
}

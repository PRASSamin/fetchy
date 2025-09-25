import { cookies } from "next/headers";
import { LoginScreen } from "./LoginScreen";
import { ADMIN_AUTH_COOKIE } from "@/constants";

export default async function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(ADMIN_AUTH_COOKIE);
  if (authCookie) return <>{children}</>;
  return <LoginScreen>{children}</LoginScreen>;
}
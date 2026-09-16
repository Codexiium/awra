import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AdminClaims {
  userId: string;
  email: string | undefined;
}

export async function getAdminClaims(): Promise<AdminClaims | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return null;

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", auth.claims.sub).single();
  if (!profile?.is_admin) return null;

  return { userId: auth.claims.sub as string, email: auth.claims.email as string | undefined };
}

// 404s rather than redirecting — a redirect would confirm /admin exists to
// anyone probing it. Works from Server Components/layouts and Server Actions.
export async function requireAdmin(): Promise<AdminClaims> {
  const admin = await getAdminClaims();
  if (!admin) notFound();
  return admin;
}

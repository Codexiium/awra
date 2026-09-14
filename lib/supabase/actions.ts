"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

export interface AuthActionState {
  error: string | null;
}

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/account");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: error.message };
  }

  redirect(next.startsWith("/") ? next : "/account");
}

export interface SignUpActionState {
  error: string | null;
  success: boolean;
}

export async function signUp(_prevState: SignUpActionState, formData: FormData): Promise<SignUpActionState> {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });
  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

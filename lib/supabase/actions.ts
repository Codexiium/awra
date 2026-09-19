"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";
import { safeRedirectTarget } from "./safeRedirect";
import { getSiteOrigin } from "@/lib/site";

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

  redirect(safeRedirectTarget(next));
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
  const origin = await getSiteOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      // Without this, Supabase's confirmation link falls back to its own
      // default redirect (nowhere in this app), so the PKCE code exchange
      // that /auth/confirm performs would never run.
      emailRedirectTo: `${origin}/auth/confirm?next=/account`
    }
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

export interface RequestPasswordResetState {
  error: string | null;
  success: boolean;
}

export async function requestPasswordReset(
  _prevState: RequestPasswordResetState,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const email = String(formData.get("email") || "").trim();
  if (!email.includes("@")) {
    return { error: "Enter a valid email address.", success: false };
  }

  const supabase = await createClient();
  const origin = await getSiteOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`
  });

  // Always report success regardless of whether the email exists — telling
  // the caller "no such account" here would be an account-enumeration oracle
  // on top of the intended flow.
  if (error) {
    console.error("requestPasswordReset error", error);
  }
  return { error: null, success: true };
}

export interface UpdatePasswordState {
  error: string | null;
  success: boolean;
}

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") || "");
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters.", success: false };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) {
    return { error: "Your password reset link has expired. Please request a new one.", success: false };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}

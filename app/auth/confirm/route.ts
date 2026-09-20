import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectTarget } from "@/lib/supabase/safeRedirect";

// Where every Supabase auth email link (signup confirmation, password
// recovery) lands. The custom email templates (supabase/templates/*.html)
// link here directly with token_hash + type, verified via verifyOtp() — the
// pattern Supabase's own docs recommend for Next.js SSR apps. `code` is kept
// as a fallback for any link still using the default {{ .ConfirmationURL }}
// shape (which routes through Supabase's own hosted /auth/v1/verify
// redirect first, and can produce a code instead of token_hash).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = safeRedirectTarget(searchParams.get("next") ?? "/account");

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmation_failed", origin));
}

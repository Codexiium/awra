import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectTarget } from "@/lib/supabase/safeRedirect";

// Where every Supabase auth email link (signup confirmation, password
// recovery) lands. Previously this route didn't exist at all, so
// exchangeCodeForSession was never called anywhere in the app — Supabase's
// PKCE-based confirmation/recovery links had nowhere to land.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeRedirectTarget(searchParams.get("next") ?? "/account");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=confirmation_failed", origin));
}

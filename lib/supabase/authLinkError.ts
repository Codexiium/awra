// When a confirmation/recovery link is expired or already used, Supabase's
// own GoTrue server redirects straight to the site with error details as a
// URL *hash fragment* (`#error=...&error_code=...&error_description=...`),
// never touching /auth/confirm at all — fragments are never sent to a
// server, so this can only be read client-side. Browsers also tend to carry
// that fragment forward across a subsequent server-side redirect (e.g. our
// own /auth/confirm -> /login?error=confirmation_failed), so the login page
// needs to check both this hash-based shape and its own ?error= query param.
export interface AuthLinkError {
  code: string | null;
  message: string;
}

// Accepts anything with a .get() (URLSearchParams or Next's
// ReadonlyURLSearchParams from useSearchParams(), which doesn't structurally
// satisfy the full URLSearchParams interface).
export function parseAuthLinkError(params: { get(name: string): string | null }): AuthLinkError | null {
  const errorCode = params.get("error_code");
  const errorDescription = params.get("error_description");
  const error = params.get("error");

  if (!error && !errorCode) return null;

  if (errorCode === "otp_expired") {
    return { code: errorCode, message: "This link has expired. Please request a new one." };
  }
  if (errorDescription) {
    // URLSearchParams already decodes both %XX escapes and "+" as space per
    // the application/x-www-form-urlencoded spec, regardless of whether this
    // came from a query string or a parsed hash fragment.
    return { code: errorCode, message: errorDescription };
  }
  return { code: errorCode, message: "This link is invalid or has expired. Please try again." };
}

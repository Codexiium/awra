import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/env";

const SUPABASE_HOSTNAME = new URL(publicEnv.NEXT_PUBLIC_SUPABASE_URL).hostname;

// Security response headers (SEC-7): the app previously shipped none of
// these — no CSP, no clickjacking protection on /checkout, no MIME-sniffing
// guard. script-src uses a per-request nonce (generated below) rather than
// 'unsafe-inline'; Next's App Router automatically applies the nonce to the
// inline scripts it renders once it's present in both the request header
// (x-nonce, read via headers() in Server Components) and the response's CSP
// header, which is exactly what this function does.
function buildSecurityHeaders(nonce: string) {
  // Next's dev server (Fast Refresh, Turbopack HMR) uses eval() for
  // debugging/hot-reload plumbing — React explicitly never uses eval() in
  // production, so 'unsafe-eval' is only added outside production rather
  // than weakening the CSP that actually ships.
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? `'self' 'nonce-${nonce}' 'strict-dynamic'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;

  const csp = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://${SUPABASE_HOSTNAME};
    font-src 'self';
    connect-src 'self' https://${SUPABASE_HOSTNAME};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    "Content-Security-Policy": csp,
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload"
  };
}

export async function updateSession(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const securityHeaders = buildSecurityHeaders(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  for (const [key, value] of Object.entries(securityHeaders)) {
    requestHeaders.set(key, value);
  }

  let response = NextResponse.next({ request: { headers: requestHeaders } });
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  const supabase = createServerClient(publicEnv.NEXT_PUBLIC_SUPABASE_URL, publicEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const [key, value] of Object.entries(securityHeaders)) {
          response.headers.set(key, value);
        }
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      }
    }
  });

  // getClaims() validates the JWT (and refreshes it via setAll above if needed) —
  // never trust a locally-stored session alone for authorization.
  const { data } = await supabase.auth.getClaims();
  const isAuthed = !!data?.claims;

  const requiresAuth =
    request.nextUrl.pathname.startsWith("/account") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/admin");
  if (!isAuthed && requiresAuth) {
    const url = request.nextUrl.clone();
    const next = url.pathname + url.search;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", next);
    const redirectResponse = NextResponse.redirect(url);
    for (const [key, value] of Object.entries(securityHeaders)) {
      redirectResponse.headers.set(key, value);
    }
    return redirectResponse;
  }

  return response;
}

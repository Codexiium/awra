// A `next` value of "//evil.example" starts with "/" and is a valid
// protocol-relative URL — a browser sent there goes to https://evil.example.
// "/\evil.example" is treated the same way by several browsers. Since `next`
// flows straight from a query string into a redirect (post-login, and
// post-email-confirmation via /auth/confirm), reject anything that isn't an
// actual same-site path.
export function safeRedirectTarget(next: string, fallback = "/account"): string {
  if (next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")) {
    return next;
  }
  return fallback;
}

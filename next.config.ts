import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
	allowedDevOrigins: ['vanguard.local'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lwzyjavrdbawgqpwrlme.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**"
      }
    ],
    // This environment resolves the Supabase Storage hostname through NAT64
    // (64:ff9b::/96) to an address Next 16's image-optimization SSRF guard
    // flags as "private" — confirmed by re-testing after removing this line
    // (SEC-8): every product image failed with "hostname resolved to
    // private IP" pointing at 64:ff9b::-prefixed addresses. remotePatterns
    // above already restricts fetches to this exact hostname+path, so this
    // is safe here. If this app is ever deployed somewhere with normal
    // public DNS resolution (e.g. Vercel), re-check whether this is still
    // needed there before assuming it is.
    dangerouslyAllowLocalIP: true
  }
};

export default nextConfig;

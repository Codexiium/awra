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
    // This dev network resolves the Supabase hostname through NAT64 (64:ff9b::/96),
    // which Next 16's local-IP SSRF check flags as private. remotePatterns above
    // already restricts fetches to this exact hostname+path, so this is safe here.
    dangerouslyAllowLocalIP: true
  }
};

export default nextConfig;

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
    ]
    // dangerouslyAllowLocalIP was here to work around this specific dev
    // sandbox's NAT64 DNS resolution (see TODO.md) relaxing Next 16's
    // image-optimization SSRF guard. Removed for production — re-add it only
    // if product images fail to load on the actual deployment target for the
    // same NAT64 reason, with a comment scoping it to why it's needed there.
  }
};

export default nextConfig;

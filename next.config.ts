import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep client interactivity reliable for the timeline carousel.
  // cacheComponents was shipping static markup without hydrating handlers.
  // Note: do not set output:"standalone" with `next start` on App Platform.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "schemaverse.com",
      },
      {
        protocol: "https",
        hostname: "storage.ghost.io",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

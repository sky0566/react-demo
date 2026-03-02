import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Required for better-sqlite3 native module
  serverExternalPackages: ['better-sqlite3'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  typescript: {
    ignoreBuildErrors: true,
  },
  // Production Optimizations
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;

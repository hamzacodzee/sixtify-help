import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.29.41"],
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;

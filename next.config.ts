import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "profixapi.runasp.net",
      },
      {
        protocol: "http",
        hostname: "profixapi.runasp.net",
      },
    ],
  },
};

export default nextConfig;

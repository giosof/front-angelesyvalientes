import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
};

export default nextConfig;

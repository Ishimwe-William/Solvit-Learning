import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.143.78.7",
    "10.143.78.7:3000",
    "10.*.*.*",
    "192.168.*.*",
    "172.16.*.*",
    "*.local",
  ],
};

export default nextConfig;

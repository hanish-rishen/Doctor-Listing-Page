import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "doctorlistingingestionpr.azureedge.net",
      "doctorlistingingestionpr.blob.core.windows.net",
    ],
  },
};

export default nextConfig;

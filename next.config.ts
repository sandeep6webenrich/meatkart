import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coreva-normal.trae.ai',
        port: '',
        pathname: '/api/ide/v1/text_to_image/**',
      },
    ],
  },
};

export default nextConfig;

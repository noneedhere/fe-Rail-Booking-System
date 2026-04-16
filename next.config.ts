import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/profilePicture/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/train_picture/**',
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: true, // Disable image optimization for localhost
  },
};

export default nextConfig;

import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'content.hsp.gimmonix.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.travsrv.com',
      },
    ],
  },
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;

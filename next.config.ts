import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/signup',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

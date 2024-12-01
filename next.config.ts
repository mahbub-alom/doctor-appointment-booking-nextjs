import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com", "img.clerk.com"],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://doctor-appointment-booking-web-app.netlify.app/api/:path*', // Proxy to your backend
      },
    ];
  },
};

export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode:false,
  images:{
    domains:["res.cloudinary.com","img.clerk.com"]
}
};

export default nextConfig;

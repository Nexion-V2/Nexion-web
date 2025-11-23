import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/", // incoming request path
        destination: "/dashboard", // redirect target
        permanent: false, // false = 307 redirect, true = 308 permanent
      },
    ];
  },
  devIndicators: false,
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "cdn-icons-png.flaticon.com",
      "res.cloudinary.com",
      "api.dicebear.com",
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["react-simple-maps"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
}

export default nextConfig

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
/* config options here */
  output: 'export',
  
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  
  // Add trailing slashes
  trailingSlash: true,
};

export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Gunakan default (tidak perlu static export)
  // Netlify akan handle Next.js runtime secara otomatis
  
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  
  // Add trailing slashes
  trailingSlash: true,
};

export default nextConfig;
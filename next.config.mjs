/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["randomuser.me", "via.placeholder.com","accm.8e57be3431cfed150bc5d5643a027333.r2.cloudflarestorage.com"],
    minimumCacheTTL: 60 * 60 * 48, // 48 hours
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

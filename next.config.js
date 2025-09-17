/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-image-domain.com', 'res.cloudinary.com'], // Added Cloudinary domain
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  experimental: {
    authInterrupts: true,
  },
};

module.exports = nextConfig;

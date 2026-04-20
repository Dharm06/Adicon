/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  distDir: "next-build",
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;

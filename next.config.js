/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isVercel ? {} : { distDir: "next-build" }),
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;

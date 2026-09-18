import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  /**
   * Route /api/source-code membungkus seluruh source code proyek menjadi .zip.
   * Daftar di bawah memastikan berkas-berkas sumber ikut terbawa saat proses
   * build/tracing (mis. deploy Vercel), bukan hanya saat dijalankan lokal.
   */
  outputFileTracingIncludes: {
    "/api/source-code": [
      "./src/**/*",
      "./drizzle/**/*",
      "./README.md",
      "./LICENSE",
      "./package.json",
      "./package-lock.json",
      "./tsconfig.json",
      "./next.config.ts",
      "./next-env.d.ts",
      "./postcss.config.mjs",
      "./eslint.config.mjs",
      "./drizzle.config.json",
      "./vercel.json",
      "./.env.example",
      "./.gitattributes",
    ],
  },
};

export default nextConfig;

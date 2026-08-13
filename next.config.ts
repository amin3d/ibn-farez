import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(isDev && {
    async rewrites() {
      return [
        {
          source: "/api/dev/poems/:id",
          destination: "http://127.0.0.1:3847/api/dev/poems/:id",
        },
      ];
    },
  }),
};

export default nextConfig;

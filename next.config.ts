import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root so a stray lockfile above this folder is ignored.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

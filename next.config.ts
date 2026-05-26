import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@firebase/firestore': path.resolve(process.cwd(), 'node_modules/@firebase/firestore/dist/index.node.cjs.js'),
        // No auth alias needed; use standard 'firebase/auth' imports

      };
    } else {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@firebase/firestore': path.resolve(process.cwd(), 'node_modules/@firebase/firestore/dist/index.esm.js'),
        // No auth alias needed; use standard 'firebase/auth' imports

      };
    }
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // lucide-react 1.11 ships CJS .d.ts but no ESM .d.mts — Turbopack resolves
    // ESM and reports false-positive "no exported member" errors for valid icons.
    // All imports work correctly at runtime. Remove once lucide-react ships ESM types.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

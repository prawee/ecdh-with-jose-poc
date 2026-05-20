import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Transpile the shared package so Next.js can handle its ESM source
  transpilePackages: ['@repo/jose-utils'],
};

export default nextConfig;

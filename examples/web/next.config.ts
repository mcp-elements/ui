import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@mcp-elements/react', '@mcp-elements/core'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig

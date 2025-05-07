import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  turbopack: {
    // Configure Turbopack for better performance during development
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
};

// Helper function to safely check if a path contains a string
const pathMatches = (path: unknown, pattern: string): boolean => {
  if (typeof path === 'string') {
    return path.includes(pattern);
  }
  return false;
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Exclude problematic files from precaching
  buildExcludes: [
    // Add specific files that cause 404 errors
    (path: unknown) => pathMatches(path, 'app-build-manifest.json'),
    // Default excludes
    (path: unknown) => pathMatches(path, 'middleware-manifest.json'),
    (path: unknown) => pathMatches(path, '_middleware.js'),
    (path: unknown) => pathMatches(path, '_middleware.js.map'),
    (path: unknown) => pathMatches(path, 'middleware-runtime.js')
  ]
});

export default pwaConfig(nextConfig);

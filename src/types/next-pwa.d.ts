declare module 'next-pwa' {
  import { NextConfig } from 'next';

  interface RuntimeCacheRule {
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses: number[];
      };
      [key: string]: unknown;
    };
  }

  type PWAConfig = {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    skipWaiting?: boolean;
    runtimeCaching?: RuntimeCacheRule[];
    publicExcludes?: string[];
    buildExcludes?: string[] | ((path: string) => boolean)[];
  };

  export default function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}

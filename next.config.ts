/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  webpack: (config: { resolve: { fallback: any; }, devtool: string; }, { isServer, dev }: any) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        crypto: false,
        os: false,
        perf_hooks: false,
        stream: false,
      };
      if (dev) {
        config.devtool = 'source-map'
      }
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: { resolve: { fallback: any; }; }, { isServer }: any) => {
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
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['postgres'],
  },
};

module.exports = nextConfig;
const withPWA = require('next-pwa');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: true,
  images: {
    domains: [
      'aaafuria-reborn.s3.amazonaws.com',
      'aaafuria-reborn.s3.sa-east-1.amazonaws.com',
    ],
  },
  env: {
    BACKEND_DOMAIN: 'https://backend.aaafuria.site',
    DIRETORIA_DOMAIN: 'https://diretoria.aaafuria.site',
    NEXT_PUBLIC_GA_ID: 'G-K5LPGWWJL1',
    PUBLIC_AWS_URI: 'https://aaafuria-reborn.s3.sa-east-1.amazonaws.com/public',
    ANALYZE: false,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (process.env.ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        }),
      );
    }
    return config;
  },
});

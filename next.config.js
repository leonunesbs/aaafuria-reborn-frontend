const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos'],
  },
  env: {
    BACKEND_DOMAIN: 'http://192.168.1.110:8000',
  },
});

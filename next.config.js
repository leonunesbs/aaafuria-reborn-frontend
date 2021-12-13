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
    BACKEND_DOMAIN: 'https://aaafuria-reborn.herokuapp.com',
  },
});

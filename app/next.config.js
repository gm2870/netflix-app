const path = require('path');
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  i18n: {
    locales: ['default', 'en-US', 'de', 'fr'],
    defaultLocale: 'default',
    localeDetection: true,
  },
  trailingSlash: false,
};
module.exports = nextConfig;

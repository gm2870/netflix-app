const path = require('path');
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },

  trailingSlash: true,
};
module.exports = nextConfig;

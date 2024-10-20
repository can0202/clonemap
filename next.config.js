const withTM = require('next-transpile-modules')([
  '@mui/material',
  '@mui/system',
  '@mui/icons-material',
]); // pass the modules you would like to see transpiled

module.exports = withTM({
  basePath: process.env.CONTEXT_PATH,
  reactStrictMode: true,
  swcMinify: true,
  // productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  env: {
    CONTEXT_PATH: process.env.CONTEXT_PATH,
  },
});

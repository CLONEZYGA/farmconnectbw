const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution
config.resolver.alias = {
  '@': __dirname,
  '@assets': __dirname + '/assets',
  '@components': __dirname + '/components',
  '@context': __dirname + '/context',
  '@services': __dirname + '/services',
  '@types': __dirname + '/types',
  '@utils': __dirname + '/utils',
};

module.exports = config; 
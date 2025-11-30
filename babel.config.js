module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './', // ← root-level alias, not src/
        },
      }],
      'react-native-reanimated/plugin',
    ],
  };
};

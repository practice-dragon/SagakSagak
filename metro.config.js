const {getDefaultConfig, mergeConfig} = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolverMainFields: [
    "sbmodern",
    ...getDefaultConfig(__dirname).resolver.resolverMainFields,
  ],
  transformer: {
    unstable_allowRequireContext: true,
  },
  resolver: {
    extraNodeModules: {
      "@storybook/react-native": require.resolve("@storybook/react-native"),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

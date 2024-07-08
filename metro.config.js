const {getDefaultConfig, mergeConfig} = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolverMainFields: [
    "sbmodern",
    ...defaultConfig.resolver.resolverMainFields,
  ],
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    unstable_allowRequireContext: true,
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== "svg"),
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"],
    extraNodeModules: {
      "@": "./src",
      "@const": "./src/const",
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);

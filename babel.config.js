// babel.config.js
module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
        ],
        alias: {
          "@": "./src",
          "@const": "./src/const",
        },
      },
    ],
    [
      "module:react-native-dotenv",
      {
        envName: "APP_ENV",
        moduleName: "@env",
        path: ".env.local",
      },
    ],
    ["react-native-reanimated/plugin"],
  ],
};

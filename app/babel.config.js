module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [".ios.js", ".android.js", ".ios.tsx", ".android.tsx", ".js", ".ts", ".tsx", ".json"],
        alias: {
          "@": "./src",
          "@shared": "../shared/src",
          "@design": "./src/design-system/index.ts",
          "@components": "./src/components",
          "@features": "./src/features",
          "@db": "./src/db",
          "@services": "./src/services",
          "@sync": "./src/sync",
          "@security": "./src/security",
          "@permissions": "./src/permissions",
          "@state": "./src/state",
          "@hooks": "./src/hooks",
          "@utils": "./src/utils",
          "@constants": "./src/constants",
          "@navigation": "./src/navigation"
        }
      }
    ],
    "react-native-reanimated/plugin"
  ]
};


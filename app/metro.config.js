const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const workspaceRoot = path.resolve(__dirname, "..");
const projectRoot = __dirname;

const defaultConfig = getDefaultConfig(projectRoot);

const config = {
  watchFolders: [workspaceRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, "node_modules"),
      path.resolve(workspaceRoot, "node_modules")
    ],
    disableHierarchicalLookup: true,
    blockList: [
      // Exclude Gradle build artifacts from Metro file watcher
      /android[/\\]\.gradle\/.*/,
      /android[/\\]app[/\\]build\/.*/,
    ],
    assetExts: [...defaultConfig.resolver.assetExts.filter((ext) => ext !== "svg"), "db", "sqlite"],
    sourceExts: [...defaultConfig.resolver.sourceExts, "svg"]
  },
  transformer: {
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true
      }
    })
  }
};

module.exports = mergeConfig(defaultConfig, config);


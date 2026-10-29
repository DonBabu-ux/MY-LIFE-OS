// Web stub: catch-all for react-native sub-path imports (e.g. react-native/Libraries/...)
// These are aliased away from the Flow-typed source files.
// react-native-web handles the actual implementations.
export default {};
export const Platform = { OS: 'web', select: (obj: any) => obj.web ?? obj.default };
export const StyleSheet = { create: (s: any) => s, flatten: (s: any) => s };
export const Animated = {};
export const NativeModules = {};
export const DeviceEventEmitter = { addListener: () => ({ remove: () => {} }), emit: () => {} };

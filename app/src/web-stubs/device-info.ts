// Web stub for react-native-device-info
export const getVersion = () => '0.1.0';
export const getBuildNumber = () => '1';
export const getUniqueId = async () => 'web-browser';
export const getSystemName = () => 'Web';
export const getSystemVersion = () => navigator.userAgent;
export const getModel = () => 'Browser';
export const isEmulator = async () => false;
export const getDeviceId = () => 'web';
export default { getVersion, getBuildNumber, getUniqueId, getSystemName, getSystemVersion, getModel, isEmulator, getDeviceId };

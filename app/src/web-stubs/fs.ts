// Web stub for react-native-fs
export const DocumentDirectoryPath = '/web-documents';
export const TemporaryDirectoryPath = '/web-temp';
export const readFile = async (_path: string): Promise<string> => '';
export const writeFile = async (_path: string, _data: string): Promise<void> => {};
export const unlink = async (_path: string): Promise<void> => {};
export const exists = async (_path: string): Promise<boolean> => false;
export const mkdir = async (_path: string): Promise<void> => {};
export const readDir = async (_path: string): Promise<any[]> => [];
export const copyFile = async (_src: string, _dst: string): Promise<void> => {};
export const moveFile = async (_src: string, _dst: string): Promise<void> => {};
export default { DocumentDirectoryPath, TemporaryDirectoryPath, readFile, writeFile, unlink, exists, mkdir, readDir, copyFile, moveFile };

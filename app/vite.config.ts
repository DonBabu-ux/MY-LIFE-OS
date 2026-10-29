import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // React Native → Web (main entry)
      'react-native': 'react-native-web',

      // Native modules → stubs
      'react-native-gesture-handler': path.resolve(__dirname, 'src/web-stubs/gesture-handler.ts'),
      'react-native-safe-area-context': path.resolve(__dirname, 'src/web-stubs/safe-area-context.ts'),
      'react-native-screens': path.resolve(__dirname, 'src/web-stubs/screens.ts'),
      'react-native-reanimated': path.resolve(__dirname, 'src/web-stubs/reanimated.ts'),
      'react-native-mmkv': path.resolve(__dirname, 'src/web-stubs/mmkv.ts'),
      'react-native-keychain': path.resolve(__dirname, 'src/web-stubs/keychain.ts'),
      'react-native-device-info': path.resolve(__dirname, 'src/web-stubs/device-info.ts'),
      'react-native-fs': path.resolve(__dirname, 'src/web-stubs/fs.ts'),
      'react-native-document-picker': path.resolve(__dirname, 'src/web-stubs/empty.ts'),
      'react-native-permissions': path.resolve(__dirname, 'src/web-stubs/empty.ts'),
      'react-native-vector-icons': path.resolve(__dirname, 'src/web-stubs/empty.ts'),
      'react-native-svg': path.resolve(__dirname, 'src/web-stubs/svg.ts'),
      'react-native-svg-transformer': path.resolve(__dirname, 'src/web-stubs/empty.ts'),
      '@op-engineering/op-sqlite': path.resolve(__dirname, 'src/web-stubs/op-sqlite.ts'),

      // Path aliases
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
      '@design': path.resolve(__dirname, './src/design-system/index.ts'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@db': path.resolve(__dirname, './src/db'),
      '@services': path.resolve(__dirname, './src/services'),
      '@sync': path.resolve(__dirname, './src/sync'),
      '@security': path.resolve(__dirname, './src/security'),
      '@permissions': path.resolve(__dirname, './src/permissions'),
      '@state': path.resolve(__dirname, './src/state'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@navigation': path.resolve(__dirname, './src/navigation'),
    },
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.tsx', '.ts', '.jsx', '.js'],
  },
  define: {
    __DEV__: JSON.stringify(true),
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify('development'),
  },
  server: {
    port: 3000,
    open: true,
  },
  optimizeDeps: {
    // Force esbuild to treat .js files as JSX so RN's Flow+JSX source doesn't crash
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      define: { global: 'globalThis', __DEV__: 'true' },
    },
    include: [
      'react-native-web',
      'react',
      'react-dom',
      '@react-navigation/native',
      '@react-navigation/native-stack',
      '@react-navigation/bottom-tabs',
      '@tanstack/react-query',
      'i18next',
      'react-i18next',
      'zustand',
      'date-fns',
      'zod',
    ],
  },
});

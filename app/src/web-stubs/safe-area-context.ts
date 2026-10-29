// Web stub for react-native-safe-area-context
import React from 'react';
import { View } from 'react-native';

const defaultInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const defaultFrame = { x: 0, y: 0, width: 390, height: 844 };

export const SafeAreaInsetsContext = React.createContext(defaultInsets);
export const SafeAreaFrameContext = React.createContext(defaultFrame);

export const SafeAreaProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) =>
  React.createElement(
    SafeAreaFrameContext.Provider,
    { value: defaultFrame },
    React.createElement(
      SafeAreaInsetsContext.Provider,
      { value: defaultInsets },
      React.createElement(View, { style: { flex: 1 } }, children)
    )
  );

export const SafeAreaView: React.FC<{ children?: React.ReactNode; style?: any; edges?: any }> = ({ children, style }) =>
  React.createElement(View, { style }, children);

export const useSafeAreaInsets = () => defaultInsets;
export const useSafeAreaFrame = () => defaultFrame;

export const SafeAreaConsumer = SafeAreaInsetsContext.Consumer;

export const initialWindowMetrics = {
  insets: defaultInsets,
  frame: defaultFrame,
};

export default { SafeAreaProvider, SafeAreaView, useSafeAreaInsets, SafeAreaInsetsContext, SafeAreaFrameContext };

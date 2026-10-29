// Web stub for react-native-gesture-handler
import React from 'react';
import { View } from 'react-native';

export const GestureHandlerRootView: React.FC<{ style?: any; children?: React.ReactNode }> = ({ children, style }) =>
  React.createElement(View, { style }, children);

export const Swipeable = GestureHandlerRootView;
export const DrawerLayout = GestureHandlerRootView;
export const State = {};
export const PanGestureHandler = GestureHandlerRootView;
export const TapGestureHandler = GestureHandlerRootView;
export const BaseButton = GestureHandlerRootView;
export const BorderlessButton = GestureHandlerRootView;
export const RectButton = GestureHandlerRootView;
export const TouchableHighlight = View;
export const TouchableNativeFeedback = View;
export const TouchableOpacity = View;
export const TouchableWithoutFeedback = View;
export const ScrollView = View;
export const FlatList = View;
export const createNativeWrapper = (Comp: any) => Comp;
export const gestureHandlerRootHOC = (Comp: any) => Comp;

export default { GestureHandlerRootView };

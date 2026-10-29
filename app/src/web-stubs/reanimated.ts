// Web stub for react-native-reanimated
import React from 'react';
import { View, ScrollView, FlatList } from 'react-native';

export const useSharedValue = (init: any) => ({ value: init });
export const useAnimatedStyle = (fn: () => any) => fn();
export const useAnimatedScrollHandler = (_handlers: any) => (_event: any) => {};
export const useAnimatedRef = () => React.createRef();
export const useAnimatedGestureHandler = (handlers: any) => handlers;
export const useDerivedValue = (fn: () => any) => ({ value: fn() });
export const useAnimatedReaction = (_deps: any, _effect: any) => {};
export const useAnimatedProps = (fn: () => any) => fn();
export const withTiming = (val: any, _opts?: any, _cb?: any) => val;
export const withSpring = (val: any, _opts?: any, _cb?: any) => val;
export const withDelay = (_delay: number, val: any) => val;
export const withSequence = (...vals: any[]) => vals[vals.length - 1];
export const withRepeat = (val: any) => val;
export const cancelAnimation = () => {};
export const runOnJS = (fn: any) => fn;
export const runOnUI = (fn: any) => fn;
export const interpolate = (value: number, input: number[], output: number[]) => {
  const ratio = (value - input[0]) / (input[input.length - 1] - input[0]);
  return output[0] + ratio * (output[output.length - 1] - output[0]);
};
export const Extrapolation = { CLAMP: 'clamp', IDENTITY: 'identity', EXTEND: 'extend' };

const identity = (t: number) => t;
export const Easing = {
  linear: identity,
  ease: identity,
  bezier: () => identity,
  out: (fn: any) => fn || identity,
  in: (fn: any) => fn || identity,
  inOut: (fn: any) => fn || identity,
  poly: () => identity,
  quad: identity,
  cubic: identity,
  exp: identity,
  circle: identity,
};

export const FadeIn = {};
export const FadeOut = {};
export const SlideInRight = {};
export const SlideOutLeft = {};
export const Layout = {};
export const ZoomIn = {};
export const ZoomOut = {};

export const createAnimatedComponent = (Component: any) => Component;

export const Animated = {
  View,
  ScrollView,
  FlatList,
  createAnimatedComponent,
  Text: (props: any) => React.createElement('span', props),
  Image: (props: any) => React.createElement('img', props),
};

export default { Animated, useSharedValue, useAnimatedStyle, withTiming, withSpring, createAnimatedComponent };

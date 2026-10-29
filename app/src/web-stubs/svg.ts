import React from "react";

// Web implementation of react-native-svg using native HTML/DOM SVG elements
const createSvgComponent = (tag: string) => {
  return React.forwardRef<any, any>(({ style, ...props }, ref) => {
    // Convert style object if needed
    return React.createElement(tag, {
      ref,
      ...props,
      style: { ...(props.style || {}), ...(style || {}) },
    });
  });
};

export const Svg = createSvgComponent("svg");
export const Circle = createSvgComponent("circle");
export const Ellipse = createSvgComponent("ellipse");
export const G = createSvgComponent("g");
export const Text = createSvgComponent("text");
export const TSpan = createSvgComponent("tspan");
export const TextPath = createSvgComponent("textPath");
export const Path = createSvgComponent("path");
export const Polygon = createSvgComponent("polygon");
export const Polyline = createSvgComponent("polyline");
export const Line = createSvgComponent("line");
export const Rect = createSvgComponent("rect");
export const Use = createSvgComponent("use");
export const Image = createSvgComponent("image");
export const Symbol = createSvgComponent("symbol");
export const Defs = createSvgComponent("defs");
export const LinearGradient = createSvgComponent("linearGradient");
export const RadialGradient = createSvgComponent("radialGradient");
export const Stop = createSvgComponent("stop");
export const ClipPath = createSvgComponent("clipPath");
export const Pattern = createSvgComponent("pattern");
export const Mask = createSvgComponent("mask");
export const Marker = createSvgComponent("marker");
export const ForeignObject = createSvgComponent("foreignObject");

export default Svg;

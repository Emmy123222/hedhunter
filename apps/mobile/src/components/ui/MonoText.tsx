import React from "react";
import { Text, type TextProps } from "react-native";

export function MonoText({ style, children, ...props }: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: "monospace", fontSize: 11, letterSpacing: 1.5, color: "#64748b", textTransform: "uppercase" }, style]}
    >
      {children}
    </Text>
  );
}

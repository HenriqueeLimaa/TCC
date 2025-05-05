import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { Text } from "./Text";

type BodyTextProps = {
  children: string;
  style?: TextStyle | TextStyle[];
};

export const BodyText = ({ children, style }: BodyTextProps) => {
  const defaultAndOptionalStyles: TextStyle[] = [styles.bodyText, ...(Array.isArray(style) ? style : [style])].filter(Boolean) as TextStyle[];
  return <Text style={defaultAndOptionalStyles} fontFamily="regular">{children}</Text>;
};

const styles = StyleSheet.create({
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

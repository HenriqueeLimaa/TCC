import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { Text } from "./Text";

type SubtitleProps = {
  children: string;
  style?: TextStyle | TextStyle[];
};

export const Subtitle = ({ children, style }: SubtitleProps) => {
  const defaultAndOptionalStyles = [styles.subtitle, ...(Array.isArray(style) ? style : [style])].filter(
    (s): s is TextStyle => s !== undefined
  );
  return <Text style={defaultAndOptionalStyles} fontFamily="medium">{children}</Text>;
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});

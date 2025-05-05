import React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { Text } from "./Text";

type TitleProps = { children: string; style?: TextStyle | TextStyle[] };

export const Title = ({ children, style }: TitleProps) => {
  const defaultAndOptionalStyles = [styles.title, ...(Array.isArray(style) ? style : [style])].filter((s): s is TextStyle => s !== undefined);
  return <Text style={defaultAndOptionalStyles} fontFamily="bold">{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

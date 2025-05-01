import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

type AuthPageButtonProps = {
  children: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
};

export const AuthPageButton = ({
  children,
  onPress,
  style,
  disabled,
}: AuthPageButtonProps) => {
  const disabledStyle = disabled ? styles.disabledButton : {};
  const defaultAndCustomStyles = [styles.button, disabledStyle, style];
  return (
    <TouchableOpacity
      style={defaultAndCustomStyles}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    padding: 20,
    width: "100%",
    backgroundColor: "blue",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f5f5f7",
    textAlign: "center",
  },
});

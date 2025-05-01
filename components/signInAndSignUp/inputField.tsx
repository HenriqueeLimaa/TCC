import React from "react";
import { KeyboardTypeOptions, TextInput, StyleSheet } from "react-native";

type InputFieldProps = {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText: (text: string) => void;
  isPasswordField?: boolean;
};

export const InputField = ({
  placeholder,
  keyboardType,
  value,
  onChangeText,
  isPasswordField,
}: InputFieldProps) => {
  return (
    <TextInput
      style={styles.inputField}
      placeholder={placeholder}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={isPasswordField}
    />
  );
};

const styles = StyleSheet.create({
  inputField: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});

import { KeyboardTypeOptions, TextInput, StyleSheet } from "react-native";

export const InputField = ({
  placeholder,
  keyboardType,
  value,
  onChangeText,
  isPasswordField,
}: {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  value: string;
  onChangeText: (text: string) => void;
  isPasswordField?: boolean;
}) => {
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

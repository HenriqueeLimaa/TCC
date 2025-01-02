import { StyleSheet, Text, TextStyle } from "react-native";

export const Title = ({
  children,
  style,
}: {
  children: string;
  style?: TextStyle | TextStyle[];
}) => {
  const defaultAndOptionalStyles = [styles.title, style];
  return <Text style={defaultAndOptionalStyles}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

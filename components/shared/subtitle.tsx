import { StyleSheet, TextStyle, Text } from "react-native";

export const Subtitle = ({
  children,
  style,
}: {
  children: string;
  style?: TextStyle | TextStyle[];
}) => {
  const defaultAndOptionalStyles = [styles.subtitle, style];
  return <Text style={defaultAndOptionalStyles}>{children}</Text>;
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

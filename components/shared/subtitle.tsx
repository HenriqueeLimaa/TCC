import { StyleSheet, TextStyle, Text } from "react-native";

type SubtitleProps = {
  children: string;
  style?: TextStyle | TextStyle[];
};

export const Subtitle = ({ children, style }: SubtitleProps) => {
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

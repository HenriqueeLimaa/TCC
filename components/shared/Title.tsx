import { StyleSheet, Text, TextStyle } from "react-native";

type TitleProps = { children: string; style?: TextStyle | TextStyle[] };

export const Title = ({ children, style }: TitleProps) => {
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

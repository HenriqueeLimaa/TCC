import { Text, StyleSheet, TextStyle } from "react-native";

export const BodyText = ({
  children,
  style,
}: {
  children: string;
  style?: TextStyle | TextStyle[];
}) => {
  const defaultAndOptionalStyles = [stylesSheet.bodyText, style];
  return <Text style={defaultAndOptionalStyles}>{children}</Text>;
};

// the name of this variable should be stylesSheet because of our optional prop
// called styles to apply more specific styles to each instance of the component
const stylesSheet = StyleSheet.create({
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
});

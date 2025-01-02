import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

export const FormContainer = ({ children }: { children: ReactNode }) => {
  return <View style={styles.formContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: '100%',
  },
});

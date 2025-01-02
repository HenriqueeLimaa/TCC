import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return <View style={styles.pageContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
    width: "100%",
    height: "100%",
    padding: 20,
  },
});

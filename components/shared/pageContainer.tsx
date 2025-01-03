import React, { ReactNode } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return <View style={styles.pageContainer}>{children}</View>;
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#f5f5f7",
    width: "100%",
    height: "100%",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: StatusBar.currentHeight,
  },
});

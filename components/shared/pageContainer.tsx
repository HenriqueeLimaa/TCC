import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: "#FFFFFF", paddingTop: insets.top + 16 }}>
      <View style={[styles.pageContent]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  pageContent: {
    backgroundColor: "#F4F4F5",
    paddingHorizontal: 20,
    paddingTop: 32,
  },
});

import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { NotificationType } from "@/types/notification";
import { Colors } from "@/constants/Colors";

export const Notification = ({
  message,
  type,
  onClose,
}: NotificationType) => {
  useEffect(() => {
    if (type === "success" && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: type === "error" ? Colors.warning : Colors.primary },
      ]}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name="warning" size={24} color="white" />
        <Text style={styles.text} fontFamily="bold">
          {message}
        </Text>
      </View>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    paddingHorizontal: 12,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    height: 150,
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    flexShrink: 1,
    marginLeft: 8,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

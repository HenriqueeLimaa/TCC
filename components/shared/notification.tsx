import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { NotificationType } from "@/types/notification";

export const Notification = ({ message, type, onClose }: NotificationType) => {

  useEffect(() => {
    if (type === "success" && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const notificationIcon = type === "error" ? "warning" : "checkmark-circle";
  const notificationTitle = type === "error" ? "Erro!" : "Sucesso!";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: type === "error" ? "#D32F2F" : "#2E7D32" },
      ]}
      edges={["left", "right"]}
    >
      <View style={styles.contentContainer}>
        <Ionicons name={notificationIcon} size={24} color="white" />
        <Text style={styles.text} fontFamily="bold">
          {message}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    paddingTop: 40,
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
  },
  closeButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});

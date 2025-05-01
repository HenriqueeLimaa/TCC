import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export const AddGoalButton = () => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Add Goal</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    alignItems: "center",
    width: "50%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

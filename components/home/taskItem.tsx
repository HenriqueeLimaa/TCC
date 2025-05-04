import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

export const TaskItem = () => {
  return (
    <View style={styles.taskItem}>
      <View style={styles.taskItemLeft}>
        <Text>taskIcon</Text>
        <Text>Task Title</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.radioButton} onPress={() => {}}>
          <View style={styles.radioButtonCircle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  taskItemLeft: {
   flexDirection: "row", 
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
});

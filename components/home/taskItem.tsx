import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text } from "../shared";
import { Ionicons } from "@expo/vector-icons";

interface TaskItemProps {
  isFirst?: boolean;
  isLast?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ isFirst = false, isLast = false }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const toggleTaskCompletion = () => {
    setIsCompleted(!isCompleted);
  };

  return (
    <View style={[
      styles.taskItem,
      !isFirst && { marginTop: 8 },
      !isLast && { marginBottom: 8 }
    ]}>
      <View style={styles.taskItemLeft}>
        <View style={styles.iconBackground}>
         <Image 
          source={require('../../assets/images/taskIconMock.png')} 
          style={styles.icon} 
        />
        </View>
        <Text style={styles.taskTitle}>Task Title</Text>
      </View>
      <View>
        <TouchableOpacity 
          style={[
            styles.radioButton, 
            isCompleted && styles.radioButtonCompleted
          ]} 
          onPress={toggleTaskCompletion}
        >
          {isCompleted ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : null}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  taskItemLeft: {
   flexDirection: "row",
   alignItems: "center",
   justifyContent: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  radioButtonCompleted: {
    backgroundColor: "#00CC66", // Verde
    borderColor: 'transparent',
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconBackground: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "rgba(205, 121, 171, 0.25)", // provisory color
    alignItems: "center",
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 20,
    lineHeight: 20,
    color: "#333333",
    marginLeft: 16,
  }
});

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { TaskItem } from "./taskItem";
import { Text } from "../shared";
import { Ionicons } from "@expo/vector-icons";

interface TasksProps {
  title: string;
  tasks: { id: number; title: string; time?: string }[]; // list of tasks
}

export const Tasks: React.FC<TasksProps> = ({ title, tasks }) => {
  const [showTasks, setShowTasks] = useState(true);

  const toggleTasks = () => {
    setShowTasks(!showTasks);
  };

  return (
    <View style={{ marginTop: 16 }}>
      <View style={styles.taskHeader}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={toggleTasks}>
          <Ionicons
            name={showTasks ? "chevron-up" : "chevron-down"}
            color={"#525252"}
            size={24}
          />
        </TouchableOpacity>
      </View>
      {showTasks && (
        <View>
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              isFirst={index === 0}
              isLast={index === tasks.length - 1}
              taskTime={task.time}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600",
    color: "#181818",
  },
});

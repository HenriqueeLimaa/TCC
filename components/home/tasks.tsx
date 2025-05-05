import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Button } from "react-native";
import { TaskItem } from "./taskItem";
import { Text } from "../shared";

interface TasksProps {
  title: string;
  tasks: { id: number; title: string; time: string }[]; // list of tasks
}

export const Tasks: React.FC<TasksProps> = ({ title, tasks }) => {
  const [showTasks, setShowTasks] = useState(true);

  const toggleTasks = () => {
    setShowTasks(!showTasks);
  };

  return (
    <View>
      <View style={styles.taskHeader}>
        <Text style={styles.title}>{title}</Text>
        <Button title="arrowIcon" onPress={toggleTasks} />
      </View>
      {showTasks && (
        <ScrollView>
          {tasks.map((task, index) => (
            <TaskItem key={index} />
          ))}
        </ScrollView>
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
    fontWeight: "medium",
  },
});

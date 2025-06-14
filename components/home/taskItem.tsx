import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, HourIcon } from "../shared";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { UserTask, UserTaskService } from "@/api/userTasksService";

interface TaskItemProps {
  isFirst?: boolean;
  isLast?: boolean;
  userTask: UserTask;
  formattedDate?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  isFirst = false,
  isLast = false,
  userTask,
  formattedDate = undefined,
}: TaskItemProps) => {
  const userTaskService = new UserTaskService();
  const [isCompleted, setIsCompleted] = useState(userTask.isCompleted);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleTaskCompletion = async () => {
    const editedTask = { ...userTask, isCompleted: !userTask.isCompleted };
    const editResponse = await userTaskService.editTask(editedTask);
    if (editResponse) {
      setIsCompleted(!isCompleted);
    } else {
      alert("Houve um erro, tente novamente");
    }
  };

  const getHourType = (date: string) => {
    const hour = parseInt(date.split(":")[0], 10);

    if (hour >= 5 && hour < 12) {
      return "morning";
    } else if (hour >= 12 && hour < 18) {
      return "afternoon";
    } else {
      return "night";
    }
  };

  return (
    <View
      style={[
        styles.taskItem,
        !isFirst && { marginTop: 4 },
        !isLast && { marginBottom: 4 },
      ]}
    >
      <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            width: "100%",
          }}
        >
          <View style={styles.taskItemLeft}>
            <View style={styles.iconBackground}>
              <Image
                source={require("../../assets/images/taskIconMock.png")}
                style={styles.icon}
              />
            </View>
            <Text style={styles.taskTitle}>{userTask.title}</Text>
          </View>

          <View style={styles.taskItemRight}>
            <View style={styles.rightControls}>
              {formattedDate && formattedDate !== "00:00" && (
                <HourIcon
                  taskHour={formattedDate}
                  hourType={getHourType(formattedDate)}
                  size={24}
                />
              )}
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  isCompleted && styles.radioButtonCompleted,
                ]}
                onPress={toggleTaskCompletion}
              >
                {isCompleted && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <TouchableOpacity
          onPress={() => setIsExpanded(false)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View>
            <Text style={{ fontSize: 12 }}>{userTask.description}</Text>
          </View>
          <Ionicons name="chevron-up" size={24} color="#999999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    // flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  taskItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  taskItemRight: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#999999",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginLeft: 16,
  },
  radioButtonCompleted: {
    backgroundColor: Colors.primary,
    borderColor: "transparent",
  },
  icon: {
    width: 20,
    height: 20,
  },
  iconBackground: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: "rgba(205, 121, 171, 0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  taskTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333333",
    marginLeft: 16,
  },
  taskTime: {
    fontSize: 14,
    color: "#666666",
  },
});

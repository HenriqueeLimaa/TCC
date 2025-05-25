import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Text, HourIcon } from "../shared";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface TaskItemProps {
    isFirst?: boolean;
    isLast?: boolean;
    taskTime?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
    isFirst = false,
    isLast = false,
    taskTime = "",
}) => {
    const [isCompleted, setIsCompleted] = useState(false);

    const toggleTaskCompletion = () => {
        setIsCompleted(!isCompleted);
    };

    const getHourType = () => {
        const hour = parseInt(taskTime.split(":")[0], 10);

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
            <View style={styles.taskItemLeft}>
                <View style={styles.iconBackground}>
                    <Image
                        source={require("../../assets/images/taskIconMock.png")}
                        style={styles.icon}
                    />
                </View>
                <Text style={styles.taskTitle}>Task Title</Text>
            </View>
            <View style={styles.taskItemRight}>
                <View style={styles.rightControls}>
                    {taskTime && (
                        <HourIcon
                            taskHour={taskTime}
                            hourType={getHourType()}
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
                        {isCompleted ? (
                            <Ionicons
                                name="checkmark"
                                size={16}
                                color="#FFFFFF"
                            />
                        ) : null}
                    </TouchableOpacity>
                </View>
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

import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { TaskItem } from "./taskItem";
import { Text } from "../shared";
import { UserTask } from "@/api/userTasksService";
import { Ionicons } from "@expo/vector-icons";

interface TasksProps {
    title: string;
    tasks: UserTask[];
}

export const Tasks: React.FC<TasksProps> = ({ title, tasks }) => {
    const [showTasks, setShowTasks] = useState(true);
    const spinValue = useRef(new Animated.Value(showTasks ? 1 : 0)).current;

    const toggleTasks = () => {
        setShowTasks(!showTasks);
    };

    useEffect(() => {
        Animated.timing(spinValue, {
            toValue: showTasks ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [showTasks, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const formatTime = (dateString: string): string => {
        if (!dateString || typeof dateString !== "string") {
            return "";
        }

        let dateObj;
        if (dateString.includes("T") && dateString.includes("Z")) {
            dateObj = new Date(dateString);
        } else if (dateString.includes("/") && dateString.includes(" ")) {
            const parts = dateString.split(" ");
            const dateParts = parts[0].split("/");
            const timeParts = parts[1].split(":");
            if (dateParts.length === 3 && timeParts.length === 2) {
                dateObj = new Date(
                    parseInt(dateParts[2]),
                    parseInt(dateParts[0]) - 1,
                    parseInt(dateParts[1]),
                    parseInt(timeParts[0]),
                    parseInt(timeParts[1])
                );
            }
        } else if (dateString.includes("-") && dateString.includes(" ")) {
            const parts = dateString.split(" ");
            const dateParts = parts[0].split("-");
            const timeParts = parts[1].split(":");
            if (dateParts.length === 3 && timeParts.length === 2) {
                dateObj = new Date(
                    parseInt(dateParts[0]),
                    parseInt(dateParts[1]) - 1,
                    parseInt(dateParts[2]),
                    parseInt(timeParts[0]),
                    parseInt(timeParts[1])
                );
            }
        }

        if (dateObj && !isNaN(dateObj.getTime())) {
            const hours = String(dateObj.getHours()).padStart(2, "0");
            const minutes = String(dateObj.getMinutes()).padStart(2, "0");
            return `${hours}:${minutes}`;
        }

        const timeMatch = dateString.match(/(\d{2}:\d{2})/);
        if (timeMatch && timeMatch[1]) {
            return timeMatch[1];
        }

        return "";
    };

    return (
        <View style={{ marginTop: 16 }}>
            <View style={styles.taskHeader}>
                <Text style={styles.title}>{title}</Text>
                <Pressable onPress={toggleTasks}>
                    {tasks.length > 0 && (
                        <Animated.View
                            style={{
                                transform: [{ rotate: spin }],
                                marginRight: 16,
                            }}
                        >
                            <Ionicons
                                name={"chevron-up"}
                                size={20}
                                color="#888"
                            />
                        </Animated.View>
                    )}
                </Pressable>
            </View>
            {showTasks && (
                <View>
                    {tasks.map((task, index) => (
                        <TaskItem
                            key={task.id}
                            isFirst={index === 0}
                            isLast={index === tasks.length - 1}
                            userTask={task}
                            formattedDate={
                                task.date ? formatTime(task.date) : ""
                            }
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
        gap: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "600",
        color: "#181818",
        maxWidth: "90%",
    },
});

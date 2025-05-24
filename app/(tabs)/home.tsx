import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Header,
    Tasks,
    SunflowerButton,
    AddTaskModal,
} from "@/components/home";
import { PageContainer } from "@/components/shared";
import {
    ActivityIndicator,
    StyleSheet,
    View,
    Text,
    Button,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { UserTask, UserTaskService } from "@/api/userTasksService";
import { getWeekIdentifier } from "@/utils/dateUtils";

export default function HomeScreen() {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [allTasksByWeek, setAllTasksByWeek] = useState<{
        [weekKey: string]: UserTask[];
    }>({});
    const [tasksWithTime, setTasksWithTime] = useState<UserTask[]>([]);
    const [tasksWithoutTime, setTasksWithoutTime] = useState<UserTask[]>([]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const userTaskService = useMemo(() => new UserTaskService(), []);

    const handleDateSelectedFromHeader = useCallback(
        (newDate: Date) => {
            const currentWeekKey = getWeekIdentifier(selectedDate);
            const newWeekKey = getWeekIdentifier(newDate);
            if (
                currentWeekKey !== newWeekKey ||
                selectedDate.toDateString() !== newDate.toDateString()
            ) {
                setSelectedDate(newDate);
            }
        },
        [selectedDate]
    );

    useEffect(() => {
        const loadTasks = async () => {
            console.log("fetching...");
            const weekKey = getWeekIdentifier(selectedDate);
            const cachedTasks = allTasksByWeek[weekKey];
            if (cachedTasks && cachedTasks.length > 0) {
                categorizeAndSetTasks(allTasksByWeek[weekKey]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const day = selectedDate.getDate();
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();
                const formattedMonth = String(month).padStart(2, "0");
                const formattedDay = String(day).padStart(2, "0");
                const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;
                const fetchedTasks = await userTaskService.getTasksForWeek({
                    date: formattedDate,
                });

                if (!fetchedTasks || fetchedTasks.length === 0) {
                    setIsLoading(false);
                    setTasksWithTime([]);
                    setTasksWithoutTime([]);
                    return;
                }

                setAllTasksByWeek((prev) => ({
                    ...prev,
                    [weekKey]: fetchedTasks,
                }));
                categorizeAndSetTasks(fetchedTasks);
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError(
                    err instanceof Error ? err.message : "Algo deu errado"
                );
                setTasksWithTime([]);
                setTasksWithoutTime([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadTasks();
    }, [selectedDate, userTaskService, allTasksByWeek]);

    const categorizeAndSetTasks = (tasks: UserTask[]) => {
        if (tasks && tasks.length === 0) {
            setTasksWithTime([]);
            setTasksWithoutTime([]);
            return;
        }

        const withTime = tasks.filter(
            (task) => task.date && task.date.trim() !== ""
        );
        const withoutTime = tasks.filter(
            (task) => !task.date || task.date.trim() === ""
        );
        setTasksWithTime(withTime);
        setTasksWithoutTime(withoutTime);
    };

    const handleSunflowerPress = () => {
        setShowAddTaskModal(true);
    };

    const refreshTasksForCurrentWeek = useCallback(() => {
        const weekKey = getWeekIdentifier(selectedDate);
        setAllTasksByWeek((prev) => {
            const updatedCache = { ...prev };
            delete updatedCache[weekKey];
            return updatedCache;
        });
    }, [selectedDate]);

    return (
        <PageContainer>
            <Header onDateSelected={handleDateSelectedFromHeader} />
            {isLoading && (
                <View
                    style={[
                        styles.statusContainer,
                        { marginTop: styles.headerPlaceholder.height + 130 },
                    ]}
                >
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.statusText}>Carregando tarefas...</Text>
                </View>
            )}
            {error && (
                <View
                    style={[
                        styles.statusContainer,
                        { marginTop: styles.headerPlaceholder.height + 130 },
                    ]}
                >
                    <Text style={styles.errorText}>Erro: {error}</Text>
                    <Button
                        title="Tentar novamente"
                        onPress={refreshTasksForCurrentWeek}
                    />
                </View>
            )}

            <ScrollView
                style={[
                    styles.scrollView,
                    { marginTop: styles.headerPlaceholder.height },
                ]}
                contentContainerStyle={styles.scrollViewContentContainer}
                keyboardShouldPersistTaps="handled"
            >
                <View style={{ opacity: isLoading || error ? 0.3 : 1 }}>
                    <Tasks title="Com horário" tasks={tasksWithTime} />
                    <Tasks
                        title="Em algum momento do dia"
                        tasks={tasksWithoutTime}
                    />
                    {!isLoading &&
                        !error &&
                        tasksWithTime.length === 0 &&
                        tasksWithoutTime.length === 0 && (
                            <Text style={styles.noTasksText}>
                                Nenhuma tarefa para esta semana.
                            </Text>
                        )}
                </View>
            </ScrollView>

            <View style={styles.floatingButtonContainer}>
                <SunflowerButton onPress={handleSunflowerPress} />
            </View>

            <AddTaskModal
                visible={showAddTaskModal}
                onClose={() => setShowAddTaskModal(false)}
                onTaskAdded={refreshTasksForCurrentWeek}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    headerPlaceholder: {
        height: 130,
    },
    scrollView: {},
    scrollViewContentContainer: {
        paddingBottom: 108,
    },
    floatingButtonContainer: {
        position: "absolute",
        right: 10,
        bottom: 0,
        zIndex: 20,
    },
    statusContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 5,
    },
    statusText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginVertical: 10,
        fontSize: 16,
    },
    noTasksText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginTop: 40,
        marginBottom: 20,
    },
});

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Header, Tasks, AddButton, AddTaskModal } from "@/components/home";
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

const formatDateToCompare = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export default function HomeScreen() {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [allTasksByWeek, setAllTasksByWeek] = useState<{
        [weekKey: string]: UserTask[];
    }>({});
    const [displayedTasks, setDisplayedTasks] = useState<UserTask[]>([]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forceRefreshKey, setForceRefreshKey] = useState(0); // Para o refresh

    const userTaskService = useMemo(() => new UserTaskService(), []);

    const handleDateSelectedFromHeader = useCallback(
        (newDate: Date) => {
            if (selectedDate.toDateString() !== newDate.toDateString()) {
                setSelectedDate(newDate);
            }
        },
        [selectedDate]
    );

    useEffect(() => {
        const weekKey = getWeekIdentifier(selectedDate);
        const cachedTasksForWeek = allTasksByWeek[weekKey];

        if (cachedTasksForWeek && Array.isArray(cachedTasksForWeek)) {
            console.log(
                `Cache hit for week ${weekKey}. Filtering for date: ${selectedDate.toDateString()}`
            );
            if (isLoading) setIsLoading(false);
            if (error) setError(null);

            const selectedDateStringForComparison =
                formatDateToCompare(selectedDate);
            const dailyTasks = cachedTasksForWeek.filter((task) => {
                if (!task.date) {
                    return false;
                }
                return task.date === selectedDateStringForComparison;
            });
            setDisplayedTasks(dailyTasks);
            return;
        }

        const fetchAndFilterTasks = async () => {
            console.log(
                `Cache miss for week ${weekKey} (or refresh). Fetching for date: ${selectedDate.toDateString()}`
            );
            setIsLoading(true);
            setError(null);
            let newWeeklyTasks: UserTask[] = [];

            try {
                const day = selectedDate.getDate();
                const month = selectedDate.getMonth() + 1;
                const year = selectedDate.getFullYear();
                const formattedMonth = String(month).padStart(2, "0");
                const formattedDay = String(day).padStart(2, "0");
                const formattedDateForAPI = `${formattedMonth}/${formattedDay}/${year}`;

                const requestData = await userTaskService.getTasksForWeek({
                    date: formattedDateForAPI,
                });
                const fetchedData = requestData.data;

                if (fetchedData) {
                    newWeeklyTasks = fetchedData;
                } else {
                    console.error(
                        "Fetched tasks are not an array:",
                        fetchedData
                    );
                    setError("Dados de tarefas inválidos recebidos.");
                }
            } catch (err) {
                console.error("Failed to fetch tasks:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Algo deu errado ao buscar tarefas"
                );
            } finally {
                setAllTasksByWeek((prev) => ({
                    ...prev,
                    [weekKey]: newWeeklyTasks,
                }));

                const selectedDateStringForComparison =
                    formatDateToCompare(selectedDate);
                const dailyTasks = newWeeklyTasks.filter((task) => {
                    if (!task.date) return false;
                    return task.date === selectedDateStringForComparison;
                });
                setDisplayedTasks(dailyTasks);
                setIsLoading(false);
            }
        };

        fetchAndFilterTasks();
    }, [selectedDate, userTaskService, forceRefreshKey]);

    const handleAddButtonPress = () => {
        setShowAddTaskModal(true);
    };

    const refreshTasksForCurrentWeek = useCallback(() => {
        const weekKey = getWeekIdentifier(selectedDate);
        setAllTasksByWeek((prev) => {
            const updatedCache = { ...prev };
            delete updatedCache[weekKey];
            return updatedCache;
        });

        setForceRefreshKey((prevKey) => prevKey + 1);
        console.log(
            `Refresh triggered for week ${weekKey}. New refresh key: ${
                forceRefreshKey + 1
            }`
        );
    }, [selectedDate, forceRefreshKey]);

    return (
        <PageContainer>
            <Header onDateSelected={handleDateSelectedFromHeader} />

            {isLoading && (
                <View
                    style={[
                        styles.statusContainer,
                        { marginTop: styles.headerPlaceholder.height + 10 },
                    ]}
                >
                    <ActivityIndicator size="large" color="#4A90E2" />
                    <Text style={styles.statusText}>Carregando tarefas...</Text>
                </View>
            )}
            {error && !isLoading && (
                <View
                    style={[
                        styles.statusContainer,
                        { marginTop: styles.headerPlaceholder.height + 10 },
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
                {!isLoading && !error && (
                    <View>
                        <Tasks
                            title={`Tarefas para esse dia`}
                            tasks={displayedTasks}
                        />
                        {displayedTasks.length === 0 && (
                            <Text style={styles.noTasksText}>
                                Nenhuma tarefa para este dia.
                            </Text>
                        )}
                    </View>
                )}
            </ScrollView>

            <View style={styles.floatingButtonContainer}>
                <AddButton onPress={handleAddButtonPress} />
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
    scrollView: {
        paddingBottom: 260,
    },
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
        paddingHorizontal: 20,
    },
    noTasksText: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
        marginTop: 40,
        marginBottom: 20,
    },
});

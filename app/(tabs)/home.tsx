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
import { Colors } from "@/constants/Colors";

const formatDateToCompare = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const hasSpecificTime = (dateString: string | undefined): boolean => {
    if (!dateString || typeof dateString !== "string") {
        return false;
    }
    try {
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) {
            return false;
        }
        return dateObj.getUTCHours() !== 0 && dateObj.getUTCMinutes() !== 0;
    } catch (e) {
        return false;
    }
};

const getStartDateOfWeek = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const dayOfWeek = d.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    d.setDate(d.getDate() + diffToMonday);
    return d;
};

export default function HomeScreen() {
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [allTasksByWeek, setAllTasksByWeek] = useState<{
        [weekKey: string]: UserTask[];
    }>({});
    const [tasksWithTime, setTasksWithTime] = useState<UserTask[]>([]);
    const [tasksAnyTime, setTasksAnyTime] = useState<UserTask[]>([]);

    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [forceRefreshKey, setForceRefreshKey] = useState(0);

    const userTaskService = useMemo(() => new UserTaskService(), []);

    const handleDateSelectedFromHeader = useCallback(
        (newDate: Date) => {
            const currentSelectedDateNormalized = new Date(selectedDate);
            currentSelectedDateNormalized.setHours(0, 0, 0, 0);

            const newDateNormalized = new Date(newDate);
            newDateNormalized.setHours(0, 0, 0, 0);

            if (
                currentSelectedDateNormalized.getTime() !==
                newDateNormalized.getTime()
            ) {
                setSelectedDate(newDateNormalized);
            }
        },
        [selectedDate]
    );

    useEffect(() => {
        const weekKey = getWeekIdentifier(selectedDate);
        const cachedTasksForWeek = allTasksByWeek[weekKey];
        const selectedDateStringForComparison =
            formatDateToCompare(selectedDate);

        const processAndSetDailyTasks = (dailyTasks: UserTask[]) => {
            const newTasksWithTime: UserTask[] = [];
            const newTasksAnyTime: UserTask[] = [];
            dailyTasks.forEach((task) => {
                if (hasSpecificTime(task.date)) {
                    newTasksWithTime.push(task);
                } else {
                    newTasksAnyTime.push(task);
                }
            });
            setTasksWithTime(newTasksWithTime);
            setTasksAnyTime(newTasksAnyTime);
        };

        if (cachedTasksForWeek && Array.isArray(cachedTasksForWeek)) {
            setIsLoading(false);
            setError(null);

            const dailyTasks = cachedTasksForWeek.filter((task) => {
                if (!task.date || typeof task.date !== "string") {
                    return false;
                }
                const taskDatePart = task.date.substring(0, 10);
                return taskDatePart === selectedDateStringForComparison;
            });
            processAndSetDailyTasks(dailyTasks);
            return;
        }

        const fetchAndFilterTasks = async () => {
            setIsLoading(true);
            setError(null);
            let newWeeklyTasks: UserTask[] = [];

            try {
                const weekStartDate = getStartDateOfWeek(selectedDate);
                const day = weekStartDate.getDate();
                const month = weekStartDate.getMonth() + 1;
                const year = weekStartDate.getFullYear();
                const formattedMonth = String(month).padStart(2, "0");
                const formattedDay = String(day).padStart(2, "0");
                const formattedDateForAPI = `${formattedMonth}/${formattedDay}/${year}`;

                const requestData = await userTaskService.getTasksForWeek({
                    date: formattedDateForAPI,
                });
                const fetchedData = requestData.data;

                if (Array.isArray(fetchedData)) {
                    newWeeklyTasks = fetchedData;
                } else {
                    setError("Dados de tarefas inválidos recebidos.");
                    newWeeklyTasks = [];
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Algo deu errado ao buscar tarefas"
                );
                newWeeklyTasks = [];
            } finally {
                setAllTasksByWeek((prev) => ({
                    ...prev,
                    [weekKey]: newWeeklyTasks,
                }));

                const dailyTasks = newWeeklyTasks.filter((task) => {
                    if (!task.date || typeof task.date !== "string") {
                        return false;
                    }
                    const taskDatePart = task.date.substring(0, 10);
                    return taskDatePart === selectedDateStringForComparison;
                });
                processAndSetDailyTasks(dailyTasks);
                setIsLoading(false);
            }
        };

        fetchAndFilterTasks();
    }, [selectedDate, userTaskService, forceRefreshKey, allTasksByWeek]);

    const handleAddButtonPress = () => {
        setShowAddTaskModal(true);
    };

    const onTaskAdded = async (task: UserTask) => {
        await save(task);
        refreshTasksForCurrentWeek();
    };

    const save = async (task: UserTask) => {
        try {
            await userTaskService.createTask(task);
            alert("Tarefa criada com sucesso!");
        } catch (error) {
            console.log("Error saving task:", error);
        }
    };

    const refreshTasksForCurrentWeek = useCallback(() => {
        const weekKey = getWeekIdentifier(selectedDate);
        setAllTasksByWeek((prev) => {
            const updatedCache = { ...prev };
            delete updatedCache[weekKey];
            return updatedCache;
        });
        setForceRefreshKey((prevKey) => prevKey + 1);
    }, [selectedDate]);

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
                    <ActivityIndicator size="large" color={Colors.primary} />
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
                        color={Colors.primary}
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
                        {tasksWithTime.length === 0 &&
                        tasksAnyTime.length === 0 ? (
                            <Text style={styles.noTasksText}>
                                Nenhuma tarefa para este dia.
                            </Text>
                        ) : (
                            <>
                                <Tasks
                                    title="Com horário"
                                    tasks={tasksWithTime}
                                />
                                {tasksWithTime.length === 0 &&
                                    (tasksAnyTime.length > 0 ||
                                        (tasksAnyTime.length === 0 &&
                                            !isLoading)) && (
                                        <Text
                                            style={styles.noTasksInCategoryText}
                                        >
                                            Nenhuma tarefa com horário definido.
                                        </Text>
                                    )}

                                {tasksWithTime.length > 0 &&
                                    tasksAnyTime.length > 0 && (
                                        <View style={styles.listSeparator} />
                                    )}

                                <Tasks
                                    title="A qualquer momento do dia"
                                    tasks={tasksAnyTime}
                                />
                                {tasksAnyTime.length === 0 &&
                                    (tasksWithTime.length > 0 ||
                                        (tasksWithTime.length === 0 &&
                                            !isLoading)) && (
                                        <Text
                                            style={styles.noTasksInCategoryText}
                                        >
                                            Nenhuma tarefa para visualizar.
                                        </Text>
                                    )}
                            </>
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
                onTaskAdded={onTaskAdded}
            />
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    headerPlaceholder: {
        height: 130,
    },
    scrollView: { height: "81%" },
    scrollViewContentContainer: {
        paddingBottom: 148,
    },
    floatingButtonContainer: {
        position: "absolute",
        right: 0,
        bottom: 0,
        zIndex: 20,
    },
    statusContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        flex: 1,
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
        paddingHorizontal: 20,
    },
    noTasksInCategoryText: {
        textAlign: "center",
        fontSize: 14,
        color: "#888",
        marginTop: 0,
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    listSeparator: {
        height: 20,
    },
});

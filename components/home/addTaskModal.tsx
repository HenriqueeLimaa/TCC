import React, { useRef, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Animated,
    PanResponder,
    TextInput,
    ScrollView,
    Keyboard,
    KeyboardEvent,
    Platform,
    useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Text } from "../shared";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { UserTask } from "@/api/userTasksService";

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onTaskAdded: (task: UserTask) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
    visible,
    onClose,
    onTaskAdded,
}) => {
    const { height: screenHeight } = useWindowDimensions();

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const translateY = useRef(new Animated.Value(screenHeight)).current;
    const defaultModalHeightPercentage = 0.9;

    const defaultModalHeight = screenHeight * defaultModalHeightPercentage;

    const modalHeight = isKeyboardVisible
        ? defaultModalHeight
        : defaultModalHeight;

    const modalTopPosition = screenHeight - modalHeight;
    const keyboardAwareTranslateY = isKeyboardVisible
        ? Platform.OS === "ios"
            ? modalTopPosition - keyboardHeight * 0.5
            : modalTopPosition
        : modalTopPosition;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [time, setTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [hasSetTime, setHasSetTime] = useState(false);
    const [difficultyLevel, setDifficultyLevel] = useState<string>("");

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newTranslateY = Math.max(0, gestureState.dy);
                translateY.setValue(newTranslateY);
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    Animated.timing(translateY, {
                        toValue: screenHeight,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        onClose();
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: screenHeight,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, screenHeight, translateY]);

    const onDateChange = (_event: any, selectedDateParam: Date | undefined) => {
        if (Platform.OS === "android") {
            setShowDatePicker(false);
        }
        if (selectedDateParam) {
            setDate(selectedDateParam);
        }
    };

    const onTimeChange = (_event: any, selectedTimeParam: Date | undefined) => {
        if (Platform.OS === "android") {
            setShowTimePicker(false);
        }
        if (selectedTimeParam) {
            setTime(selectedTimeParam);
            setHasSetTime(true);
        }
    };

    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
            (event: KeyboardEvent) => {
                setKeyboardHeight(event.endCoordinates.height);
                setIsKeyboardVisible(true);
            }
        );
        const keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            () => {
                setKeyboardHeight(0);
                setIsKeyboardVisible(false);
            }
        );

        return () => {
            keyboardWillHideListener.remove();
            keyboardWillShowListener.remove();
        };
    }, []);

    const handleSaveTask = () => {
        const numericDifficulty = parseInt(difficultyLevel, 10);
        if (title.trim() === "") {
            alert("O título da tarefa é obrigatório.");
            return;
        }
        if (
            difficultyLevel.trim() === "" ||
            isNaN(numericDifficulty) ||
            numericDifficulty < 1 ||
            numericDifficulty > 5
        ) {
            alert("Por favor, insira um nível de dificuldade válido (1-5).");
            return;
        }

        const combinedDateTime = new Date(date);
        if (hasSetTime) {
            combinedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);
        } else {
            combinedDateTime.setHours(0, 0, 0, 0);
        }

        const pad = (num: number) => num.toString().padStart(2, "0");
        const formattedDateTimeString = `${pad(
            combinedDateTime.getMonth() + 1
        )}/${pad(
            combinedDateTime.getDate()
        )}/${combinedDateTime.getFullYear()} ${pad(
            combinedDateTime.getHours()
        )}:${pad(combinedDateTime.getMinutes())}`;

        const newTask: UserTask = {
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim() || undefined,
            date: formattedDateTimeString,
            isCompleted: false,
            difficultLevel: numericDifficulty,
        };

        console.log("Salvar tarefa:", newTask);
        onTaskAdded(newTask);
        onClose();
        setTitle("");
        setDescription("");
        setDate(new Date());
        setTime(new Date());
        setHasSetTime(false);
        setDifficultyLevel("");
    };

    if (!visible) {
        return null;
    }

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <BlurView
                intensity={Platform.OS === "ios" ? 30 : 80}
                tint="light"
                style={StyleSheet.absoluteFillObject}
            >
                <TouchableOpacity
                    style={styles.overlay}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <Animated.View
                    style={[
                        styles.modalPositionWrapper,
                        {
                            height: modalHeight,
                            transform: [
                                {
                                    translateY: translateY.interpolate({
                                        inputRange: [0, screenHeight],
                                        outputRange: [
                                            keyboardAwareTranslateY,
                                            screenHeight,
                                        ],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={styles.modalTouchableContent}
                    >
                        <View
                            style={styles.grabberContainer}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.grabber} />
                        </View>

                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.headerButton}
                            >
                                <Text style={styles.cancelButton}>
                                    Cancelar
                                </Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>
                                Criar nova tarefa
                            </Text>
                            <TouchableOpacity
                                style={styles.headerButton}
                                onPress={handleSaveTask}
                            >
                                <Text style={styles.saveButton}>Salvar</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollViewContent}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.taskField}>
                                <View style={styles.titleField}>
                                    <View
                                        style={[
                                            styles.inputContainer,
                                            { flex: 1 },
                                        ]}
                                    >
                                        <Text style={styles.inputLabel}>
                                            Título da tarefa
                                        </Text>
                                        <TextInput
                                            placeholder="Ex: Estudar para a prova"
                                            style={styles.textInput}
                                            placeholderTextColor="#999999"
                                            value={title}
                                            onChangeText={setTitle}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.taskField,
                                    styles.inputContainer,
                                ]}
                            >
                                <Text style={styles.inputLabel}>Descrição</Text>
                                <TextInput
                                    placeholder="Ex: Prova de inglês na sexta-feira"
                                    style={[
                                        styles.textInput,
                                        styles.multilineInput,
                                    ]}
                                    placeholderTextColor="#999999"
                                    multiline
                                    numberOfLines={3}
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            <View
                                style={[
                                    styles.taskField,
                                    styles.inputContainer,
                                ]}
                            >
                                <Text style={styles.inputLabel}>
                                    Nível de Dificuldade (1-5)
                                </Text>
                                <TextInput
                                    placeholder="Ex: 3"
                                    style={styles.textInput}
                                    placeholderTextColor="#999999"
                                    keyboardType="numeric"
                                    value={difficultyLevel}
                                    onChangeText={(text) => {
                                        const numericValue = text.replace(
                                            /[^1-5]/g,
                                            ""
                                        );
                                        setDifficultyLevel(
                                            numericValue.length <= 1
                                                ? numericValue
                                                : ""
                                        );
                                    }}
                                    maxLength={1}
                                />
                            </View>

                            <View
                                style={[
                                    styles.taskField,
                                    styles.inputContainer,
                                ]}
                            >
                                <Text style={styles.inputLabel}>Data</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowDatePicker((prev) => !prev);
                                    }}
                                    style={styles.datePickerButton}
                                >
                                    <Text style={styles.datePickerText}>
                                        {date.toLocaleDateString("pt-BR")}
                                    </Text>
                                    <Ionicons
                                        name="calendar-outline"
                                        size={24}
                                        color={Colors.primary}
                                    />
                                </TouchableOpacity>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={date}
                                        mode="date"
                                        display={
                                            Platform.OS === "ios"
                                                ? "spinner"
                                                : "default"
                                        }
                                        onChange={onDateChange}
                                        textColor={
                                            Platform.OS === "ios"
                                                ? "#333"
                                                : undefined
                                        }
                                    />
                                )}
                            </View>

                            <View
                                style={[
                                    styles.taskField,
                                    styles.inputContainer,
                                ]}
                            >
                                <Text style={styles.inputLabel}>
                                    Horário{" "}
                                    <Text style={styles.optionalField}>
                                        (opcional)
                                    </Text>
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowTimePicker((prev) => !prev);
                                    }}
                                    style={styles.datePickerButton}
                                >
                                    <Text style={styles.datePickerText}>
                                        {hasSetTime
                                            ? time.toLocaleTimeString("pt-BR", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "Definir horário"}
                                    </Text>
                                    <Ionicons
                                        name="time-outline"
                                        size={24}
                                        color={Colors.primary}
                                    />
                                </TouchableOpacity>
                                {showTimePicker && (
                                    <DateTimePicker
                                        value={time}
                                        mode="time"
                                        is24Hour={true}
                                        textColor={
                                            Platform.OS === "ios"
                                                ? "#333"
                                                : undefined
                                        }
                                        display={
                                            Platform.OS === "ios"
                                                ? "spinner"
                                                : "default"
                                        }
                                        onChange={onTimeChange}
                                    />
                                )}
                            </View>
                            {Platform.OS === "android" && isKeyboardVisible && (
                                <View
                                    style={{ height: keyboardHeight * 0.7 }}
                                />
                            )}
                        </ScrollView>
                    </TouchableOpacity>
                </Animated.View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
    },
    modalPositionWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#F4F4F5",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
    },
    modalTouchableContent: {
        flex: 1,
        alignItems: "center",
    },
    grabberContainer: {
        width: "100%",
        paddingVertical: 10,
        alignItems: "center",
    },
    grabber: {
        width: 48,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#C0C0C0",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        color: "#333333",
    },
    headerButton: {
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    cancelButton: {
        fontSize: 16,
        color: "#666666",
    },
    saveButton: {
        fontSize: 16,
        fontWeight: "600",
        color: Colors.primary,
    },
    scrollView: {
        width: "100%",
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 150 : 120,
        alignItems: "center",
    },
    taskField: {
        width: "100%",
        borderRadius: 10,
        padding: 12,
        backgroundColor: Colors.card,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    titleField: {
        flexDirection: "row",
        alignItems: "center",
    },
    inputContainer: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 14,
        color: "#555555",
        marginBottom: 6,
        fontWeight: "500",
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#D0D0D0",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === "ios" ? 12 : 8,
        height: 48,
        fontSize: 16,
        color: "#333333",
        backgroundColor: "#FCFCFC",
    },
    multilineInput: {
        height: 80,
        textAlignVertical: "top",
        paddingTop: 12,
    },
    datePickerButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#D0D0D0",
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 48,
        backgroundColor: "#FCFCFC",
    },
    datePickerText: {
        fontSize: 16,
    },
    optionalField: {
        fontSize: 12,
        color: "#777777",
        fontWeight: "400",
    },
});

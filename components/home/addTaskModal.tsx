import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  TextInput,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { Text } from "../shared";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddTaskModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  visible,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const modalHeight = Dimensions.get("window").height * 0.7;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);

  const goals = [
    "Concluir curso de inglês",
    "Melhorar condicionamento físico",
    "Desenvolver app de produtividade",
  ];

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 150) {
          Animated.timing(translateY, {
            toValue: modalHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            friction: 8,
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
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalWrapper}
            onPress={(e) => e.stopPropagation()}
          >
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  transform: [{ translateY }],
                  height: modalHeight,
                },
              ]}
              {...panResponder.panHandlers}
            >
              <View style={styles.grabberContainer}>
                <View style={styles.grabber} />
              </View>

              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                  <Text style={styles.cancelButton}>Cancelar</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>Criar nova tarefa</Text>

                <TouchableOpacity style={styles.headerButton}>
                  <Text style={styles.saveButton}>Salvar</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.scrollView}
              >
                <View style={styles.taskField}>
                  <View style={styles.titleField}>
                    <TouchableOpacity style={styles.addButton}>
                      <Text style={styles.addButtonText}>+</Text>
                    </TouchableOpacity>

                    <View style={[styles.inputContainer, { flex: 1 }]}>
                      <Text style={styles.inputLabel}>Título da tarefa</Text>
                      <TextInput
                        placeholder="Ex: Estudar para a prova"
                        style={styles.textInput}
                      />
                    </View>
                  </View>
                </View>

                <View style={[styles.taskField, styles.inputContainer]}>
                  <Text style={styles.inputLabel}>Descrição</Text>
                  <TextInput
                    placeholder="Ex: Prova de inglês na sexta-feira"
                    style={styles.textInput}
                  />
                </View>

                <View style={[styles.taskField, styles.inputContainer]}>
                  <Text style={styles.inputLabel}>Data</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={styles.datePickerButton}
                  >
                    <Text style={styles.datePickerText}>
                      {date.toLocaleDateString()}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={24}
                      color="#999999"
                      style={styles.calendarIcon}
                    />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      style={styles.dateTimePicker}
                    />
                  )}
                </View>

                <View style={[styles.taskField, styles.inputContainer]}>
                  <Text style={styles.inputLabel}>Horário</Text>
                  <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={styles.datePickerButton}
                  >
                    <Text style={styles.datePickerText}>
                      {time.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    <Ionicons
                      name="time-outline"
                      size={24}
                      color="#999999"
                      style={styles.calendarIcon}
                    />
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={time}
                      mode="time"
                      is24Hour={true}
                      display="default"
                      onChange={onTimeChange}
                      style={styles.dateTimePicker}
                    />
                  )}
                </View>

                <View style={[styles.taskField, styles.inputContainer]}>
                  <Text style={styles.inputLabel}>
                    Incluir em meta{" "}
                    <Text style={styles.optionalField}>(opcional)</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsGoalDropdownOpen(!isGoalDropdownOpen)}
                    style={styles.goalSelectorButton}
                  >
                    <Text style={styles.goalSelectorText}>
                      {selectedGoal
                        ? selectedGoal
                        : "Selecione uma meta (opcional)"}
                    </Text>
                    <Ionicons
                      name={isGoalDropdownOpen ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="#999999"
                      style={styles.chevronIcon}
                    />
                  </TouchableOpacity>
                  {isGoalDropdownOpen && (
                    <View style={styles.goalDropdown}>
                      {goals.map((goal, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            setSelectedGoal(goal);
                            setIsGoalDropdownOpen(false);
                          }}
                          style={styles.goalOption}
                        >
                          <Text style={styles.goalOptionText}>{goal}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.30)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    alignItems: "center",
    backgroundColor: "#F4F4F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  grabberContainer: {
    width: "100%",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  grabber: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#DDDDDD",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    width: "100%",
  },
  modalTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  headerButton: {
    padding: 5,
  },
  cancelButton: {
    fontSize: 16,
    lineHeight: 24,
    color: "#999999",
  },
  saveButton: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: "#00CC66",
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  taskField: {
    width: "95%",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  addButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F4F4F5",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
  },
  titleField: {
    flexDirection: "row",
    gap: 12,
  },
  inputContainer: {
    justifyContent: "center",
  },
  inputLabel: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333333",
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
    padding: 10,
    height: 44,
    fontSize: 16,
    lineHeight: 20,
    color: "#999999",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
    padding: 10,
    height: 44,
    backgroundColor: "#FFFFFF",
  },
  datePickerText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333333",
  },
  calendarIcon: {
    marginLeft: 8,
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
  },
  optionalField: {
    fontSize: 14,
    lineHeight: 20,
    color: "#999999",
  },
  goalSelectorButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#999999",
    borderRadius: 8,
    padding: 10,
    height: 44,
    backgroundColor: "#FFFFFF",
  },
  goalSelectorText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333333",
  },
  chevronIcon: {
    marginLeft: 8,
  },
  goalDropdown: {
    position: "absolute",
    top: 54,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#999999",
    zIndex: 1000,
    maxHeight: 150,
    overflow: "hidden",
  },
  goalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  goalOptionText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#333333",
  },
  scrollViewContent: {
    paddingBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  scrollView: {
    width: "100%",
  },
  keyboardAvoid: {
    flex: 1,
    width: "100%",
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
  },
});

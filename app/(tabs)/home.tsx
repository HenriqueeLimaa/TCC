import React, { useState } from "react";
import {
  Header,
  Tasks,
  SunflowerButton,
  AddTaskModal,
} from "@/components/home";
import { PageContainer } from "@/components/shared";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function HomeScreen() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const tasks1Mock = [
    { id: 1, title: "Regar flores", time: "09:30" },
    { id: 2, title: "Lavar roupa", time: "13:30" },
    { id: 3, title: "Estudar inglês", time: "21:00" },
  ];

  const tasks2Mock = [
    { id: 4, title: "Fazer compras" },
    { id: 5, title: "Organizar a estante" },
    { id: 6, title: "Responder emails" },
    { id: 7, title: "Planejar a semana" },
  ];

  const handleSunflowerPress = () => {
    setShowAddTaskModal(true);
  };

  return (
    <PageContainer>
      <Header />
      <ScrollView style={styles.contentContainer}>
        <View style={{ marginBottom: 108 }}>
          <Tasks title="Com horário" tasks={tasks1Mock} />
          <Tasks title="Em algum momento do dia" tasks={tasks2Mock} />
        </View>
      </ScrollView>
      <View style={styles.floatingButtonContainer}>
        <SunflowerButton onPress={handleSunflowerPress} />
      </View>

      <AddTaskModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 130,
  },
  floatingButtonContainer: {
    position: "absolute",
    right: 10,
    bottom: -24,
  },
});

import React from "react";
import { Header, Tasks, SunflowerButton } from "@/components/home";
import { PageContainer } from "@/components/shared";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  // Maybe we could first ask for the user goals, that are the things that they
  //  want to achieve in their routine. Then we ask for a text with a limited number
  // of characters to know more about the person routine and improve the prompt to gpt.
  
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
    console.log('Sunflower button pressed');
  };
  
  return (
    <PageContainer>
      <Header />
      <View style={styles.contentContainer}>
        <Tasks title="Com horário" tasks={tasks1Mock} />
        <Tasks title="Em algum momento do dia" tasks={tasks2Mock} />
      </View>
      <View style={styles.floatingButtonContainer}>
        <SunflowerButton onPress={handleSunflowerPress} />
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    width: '100%',
    marginTop: 130, // spacement for the header
  },
  floatingButtonContainer: {
    position: 'absolute',
    right: 10,
    bottom: 70, // Para ficar 10px acima da TabBar (TabBar geralmente tem 60px de altura)
  },
});

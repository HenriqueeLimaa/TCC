import { AddGoalButton, GoalForm } from "@/components/home";
import { PageContainer, Subtitle, Title } from "@/components/shared";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  // Maybe we could first ask for the user goals, that are the things that they
  //  want to achieve in their routine. Then we ask for a text with a limited number
  // of characters to know more about the person routine and improve the prompt to gpt.
  return (
    <PageContainer>
      <Title>Home</Title>
      <View style={styles.contentContainer}>
        <Subtitle>Add your goals</Subtitle>
        <AddGoalButton />
        <GoalForm />
        <ScrollView></ScrollView>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
  },
});

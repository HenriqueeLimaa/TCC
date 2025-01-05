import { PageContainer, Subtitle, Title } from "@/components/shared";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <PageContainer>
      <Title>Home</Title>
      <View style={styles.contentContainer}>
        <Subtitle>Add your goals</Subtitle>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    marginTop: 20,
  },
});

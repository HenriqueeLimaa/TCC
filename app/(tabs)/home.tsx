import { PageContainer, Subtitle, Title } from "@/components/shared";
import { useLoginState } from "@/hooks";
import { Button, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { setUsername, setName, setEmail, setPassword, setAccessToken } =
    useLoginState();

  const handleLogout = () => {
    setUsername("");
    setName("");
    setEmail("");
    setPassword("");
    setAccessToken("");
  };
  return (
    <PageContainer>
      <Title>Home</Title>
      <Button title="Logout" onPress={handleLogout} />
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

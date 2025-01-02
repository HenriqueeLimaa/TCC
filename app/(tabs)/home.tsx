import { PageContainer, Title } from "@/components/shared";
import { useLoginState } from "@/hooks";
import { Button, StyleSheet } from "react-native";

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
    </PageContainer>
  );
}

const styles = StyleSheet.create({});

import { PageContainer, Title } from "@/components/shared";
import { useLoginState } from "@/hooks";
import { Button, StyleSheet } from "react-native";

export default function HomeScreen() {
  const { setAccessToken } = useLoginState();

  const handleLogout = () => {
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

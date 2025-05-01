import { Button, StyleSheet } from "react-native";
import { PageContainer, Title } from "@/components/shared";
import { useRouter } from "expo-router";
import { useLoginState } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";

export default function Profile() {
  const router = useRouter();
  const { setUsername, setName, setEmail, setPassword, setAccessToken } =
    useLoginState();

  const handleLogout = () => {
    setUsername("");
    setName("");
    setEmail("");
    setPassword("");
    setAccessToken("");
    AsyncStorage.removeItem("accessToken");

    router.replace("/signIn");
  };
  return (
    <PageContainer>
      <Title>Profile</Title>
      <Button title="Logout" onPress={handleLogout} />
    </PageContainer>
  );
}

const styles = StyleSheet.create({});

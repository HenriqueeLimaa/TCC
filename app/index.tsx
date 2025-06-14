import { useRouter, Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { BodyText, PageContainer, Title } from "@/components/shared";
import { AuthPageButton } from "@/components/signInAndSignUp";
import React from "react";
import { useLoginState } from "@/hooks";

export default function AuthPage() {
  const router = useRouter();
  const { accessToken } = useLoginState();
  const { t } = useTranslation();

  if (accessToken) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <PageContainer>
      <Title>{t("welcomePage.title")}</Title>
      <BodyText style={styles.instructionsText}>
        {t("welcomePage.subtitle")}
      </BodyText>
      <View style={styles.imagePlaceholder}>
        <BodyText>Image placeholder</BodyText>
      </View>
      <View style={styles.buttonsContainer}>
        <AuthPageButton onPress={() => router.push("/signIn")}>
          {t("welcomePage.signIn")}
        </AuthPageButton>
        <AuthPageButton onPress={() => router.push("/signUp")}>
          {t("welcomePage.signUp")}
        </AuthPageButton>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  instructionsText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },
  imagePlaceholder: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    height: 300,
    width: "100%",
    borderRadius: 10,
    marginTop: 40,
  },
});

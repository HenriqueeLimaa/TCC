import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { BodyText, PageContainer, Title } from "@/components/shared";
import { AuthPageButton } from "@/components/signInAndSignUp";

export default function AuthPage() {
  const router = useRouter();
  // idea: use some symbols of neurodivergencies, such as sunflower for autism or infinity for
  // general neurodivergencies
  return (
    <PageContainer>
      <Title>Welcome</Title>
      <BodyText style={styles.instructionsText}>
        Sign in or sign up to start to improve your productivity
      </BodyText>
      {/* Only a placeholder, must delete this later */}
      <View style={styles.imagePlaceholder}>
        <BodyText>Image placeholder</BodyText>
      </View>
      <View style={styles.buttonsContainer}>
        <AuthPageButton onPress={() => router.push("/signIn")}>
          Sign In
        </AuthPageButton>
        <AuthPageButton onPress={() => router.push("/signUp")}>
          Sign Up
        </AuthPageButton>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  instructionsText: {
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: "80%",
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },
  imagePlaceholder: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "gray",
    height: 300,
    width: '100%',
    borderRadius: 10,
    marginTop: 20,
  },
});

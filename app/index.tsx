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
      <View style={styles.imagePlaceholder} />
      <View style={styles.buttonsContainer}>
        <AuthPageButton onPress={() => router.push('/signIn')}>
          Sign In
        </AuthPageButton>
        <AuthPageButton onPress={() => console.log("Sign Up Clicked!")}>
          Sign Up
        </AuthPageButton>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  instructionsText: {
    fontWeight: 'bold',
    textAlign: "center",
    maxWidth: "80%",
  },
  buttonsContainer: {
    marginTop: 20,
    gap: 10,
  },
  imagePlaceholder: {
    backgroundColor: 'gray',
    height: 300,
    width: 300,
    borderRadius: 10,
    margin: 10,
  },
});

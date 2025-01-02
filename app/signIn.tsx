import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PageContainer, Title } from "@/components/shared";
import {
  AuthPageButton,
  FormContainer,
  InputField,
} from "@/components/signInAndSignUp";
import { useLoginState } from "@/hooks";
import { useRouter } from "expo-router";

export default function SignInPage() {
  const { email, setEmail, password, setPassword, setAccessToken } =
    useLoginState();
  const router = useRouter();

  const disableSignInButton = !email.includes("@") || +password.length < 8;

  const handleSignInButton = async () => {
    // Here we have the accessToken field on the loginState context
    // and then navigate to the home page. While we arent really calling
    // the API, we can just set a random token here and use this
    // @react-native-async-storage/async-storage lib
    try {
      const accessTokenMock = "4815162342";
      setAccessToken(accessTokenMock);

      await AsyncStorage.setItem("accessToken", accessTokenMock);
      setPassword("");
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <PageContainer>
      <Title>Sign In</Title>
      <FormContainer>
        <InputField
          placeholder="E-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <InputField
          placeholder="Password"
          value={password}
          onChangeText={(p) => setPassword(p)}
          isPasswordField
        />
      </FormContainer>
      <AuthPageButton
        style={styles.signInButton}
        onPress={handleSignInButton}
        disabled={disableSignInButton}
      >
        Sign In
      </AuthPageButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  signInButton: {
    marginTop: 20,
  },
});

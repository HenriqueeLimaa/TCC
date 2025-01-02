import { useState } from "react";
import { StyleSheet } from "react-native";
import { PageContainer, Title } from "@/components/shared";
import {
  AuthPageButton,
  FormContainer,
  InputField,
} from "@/components/signInAndSignUp";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const disableSignInButton = !email.includes("@") ||  password.length < 8;

  const handleSignInButton = () => {
    // Here we have to change the state of the isLoggedIn variable on the loginState context
    // and then navigate to the home page
  }
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
        onPress={() => console.log("Sign In Clicked!")}
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

import { useState } from "react";
import { StyleSheet } from "react-native";
import { PageContainer, Title } from "@/components/shared";
import {
  AuthPageButton,
  FormContainer,
  InputField,
} from "@/components/signInAndSignUp";

export default function SignUpPage() {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  // Here we also need to check if the Username is valid
  const disableSignUpButton =
    !email.includes("@") ||
    password.length < 8 ||
    password !== passwordConfirmation;

  // Here we'll implement a logic to show a message to confirm if everything goes
  // well and then redirect to the sign in page
  const handleSignUpButton = () => {};
  return (
    <PageContainer>
      <Title>Sign Up</Title>
      <FormContainer>
        <InputField
          placeholder="Username"
          value={userName}
          onChangeText={(e) => setUserName(e)}
        />
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
        <InputField
          placeholder="Confirm your password"
          value={passwordConfirmation}
          onChangeText={(p) => setPasswordConfirmation(p)}
          isPasswordField
        />
      </FormContainer>
      <AuthPageButton
        style={styles.signInButton}
        onPress={handleSignUpButton}
        disabled={disableSignUpButton}
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

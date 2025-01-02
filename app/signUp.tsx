import { useState } from "react";
import { StyleSheet } from "react-native";
import { PageContainer, Title } from "@/components/shared";
import {
  AuthPageButton,
  FormContainer,
  InputField,
} from "@/components/signInAndSignUp";
import { useLoginState } from "@/hooks";

export default function SignUpPage() {
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const { username, setUsername, email, setEmail, password, setPassword } =
    useLoginState();

  // Here we also need to check if the Username is valid
  const disableSignUpButton =
    !email.includes("@") ||
    password.length < 8 ||
    password !== passwordConfirmation;

  // Here we'll implement a logic to call the signUp api and show a message
  // to confirm if everything went well and then redirect to the sign in page
  const handleSignUpButton = () => {
    // Here we'll call the signUp api, clean the password fields and then
    // redirect to the sign in page
    setPassword("");
    setPasswordConfirmation("");
  };
  return (
    <PageContainer>
      <Title>Sign Up</Title>
      <FormContainer>
        <InputField
          placeholder="Username"
          value={username}
          onChangeText={(e) => setUsername(e)}
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

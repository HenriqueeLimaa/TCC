import { useState } from "react";
import { StyleSheet } from "react-native";
import { PageContainer, Title } from "@/components/shared";
import {
  AuthPageButton,
  FormContainer,
  InputField,
} from "@/components/signInAndSignUp";
import { useLoginState } from "@/hooks";
import { useTranslation } from "react-i18next";
import { registerUser } from "@/api/userService";
import React from "react";

export default function SignUpPage() {
  const { t } = useTranslation();
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
    // example:
    // registerUser(name, username, email, password, birthDate);
    const userInfo = {
      name: 'joaozinho da silva',
      nickname: username,
      email: email,
      password: password,
      birthDate: '10/08/1995',
    }
    registerUser(userInfo);
    setPassword("");
    setPasswordConfirmation("");
  };
  return (
    <PageContainer>
      <Title>{t('signUpPage.title')}</Title>
      <FormContainer>
        <InputField
          placeholder={t('signUpPage.username')}
          value={username}
          onChangeText={(e) => setUsername(e)}
        />
        <InputField
          placeholder={t('signUpPage.email')}
          keyboardType="email-address"
          value={email}
          onChangeText={(e) => setEmail(e)}
        />
        <InputField
          placeholder={t('signUpPage.password')}
          value={password}
          onChangeText={(p) => setPassword(p)}
          isPasswordField
        />
        <InputField
          placeholder={t('signUpPage.passwordConfirmation')}
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
        {t('signUpPage.confirmButton')}
      </AuthPageButton>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  signInButton: {
    marginTop: 20,
  },
});

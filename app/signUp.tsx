import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import { Notification } from "@/components/shared";
import { NotificationType } from "@/types/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLoginState } from "@/hooks";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { UserService } from "@/api/userService";
import { Colors } from "@/constants/Colors";

export default function SignUpPage() {
  const userService = new UserService();
  const router = useRouter();
  const { t } = useTranslation();
  const { email, setEmail, password, setPassword, setAccessToken } =
    useLoginState();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );

  const disableButton =
    name.trim().length === 0 ||
    nickname.trim().length === 0 ||
    !email.includes("@") ||
    password.length < 8 ||
    birthDate.length < 10;

  const formatBirthDate = (input: string) => {
    const [d, m, y] = input.split("/");
    return `${m}/${d}/${y}`;
  };

  const formatDateInput = (text: string) => {
    // Remove tudo que não é número
    const numbersOnly = text.replace(/[^0-9]/g, '');
    
    // Aplica a formatação DD/MM/YYYY
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    } else {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    }
  };

  const handleBirthDateChange = (text: string) => {
    const formattedText = formatDateInput(text);
    setBirthDate(formattedText);
  };

  const checkMissingFields = () => {
    if (!name || !nickname || !email || !password || !birthDate) {
      setNotification({
        message: "Por favor, preencha todos os campos.",
        type: "error",
      });
      return true;
    }
  };

  const handleSignUp = async () => {
    if (checkMissingFields()) {
      return;
    }

    try {
      await userService.registerUser({
        name,
        nickname,
        email,
        password,
        birthDate: formatBirthDate(birthDate),
      });

      setNotification({
        message:
          "Cadastro realizado com sucesso! \nRedirecionando para a aplicação...",
        type: "success",
      });

      setTimeout(async () => {
        const loginResult = await userService.userLogin({
          email,
          password,
        });

        const accessToken = loginResult.data["access_token"];
        setAccessToken(accessToken);
        await AsyncStorage.setItem("accessToken", accessToken);
        setPassword("");
        router.replace("/(tabs)/home");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Image
        style={styles.sunflowerIcon}
        source={require("../assets/images/sunflower.png")}
      />

      <ScrollView style={styles.formContainer}>
        <Text style={styles.title}>{t("signUpPage.title", "Cadastro")}</Text>

        <Text style={styles.label}>{t("signUpPage.name", "Nome")}</Text>
        <TextInput
          style={styles.input}
          placeholder="Seu Nome"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>{t("signUpPage.nickname", "Apelido")}</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Jorginho"
          placeholderTextColor="#aaa"
          value={nickname}
          onChangeText={setNickname}
        />

        <Text style={styles.label}>
          {t("signUpPage.birthDate", "Data de Nascimento (dd/mm/aaa)")}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="01/01/2000"
          placeholderTextColor="#aaa"
          keyboardType="default"
          value={birthDate}
          onChangeText={handleBirthDateChange}
          maxLength={10}
        />

        <Text style={styles.label}>{t("signUpPage.email", "E-mail")}</Text>
        <TextInput
          style={styles.input}
          placeholder="exemplo@email.com"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>{t("signUpPage.password", "Senha")}</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="********"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#888"
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            disableButton && { backgroundColor: "#a5d6a7" },
          ]}
          onPress={handleSignUp}
          //   disabled={disableButton}
        >
          <Text style={styles.buttonText}>
            {t("signUpPage.signUp", "Cadastrar")}
          </Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.loginText}>
            {t("signUpPage.hasAccount", "Já possui uma conta?")}{" "}
          </Text>
          <Pressable onPress={() => router.push("/signIn")}>
            <Text style={styles.loginLink}>
              {t("signUpPage.signIn", "Entrar")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: 60,
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#000",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    textAlign: "center",
    color: "#555",
  },
  loginLink: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  sunflowerIcon: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});

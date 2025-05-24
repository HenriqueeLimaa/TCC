import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLoginState } from "@/hooks";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { UserService } from "@/api/userService";

export default function SignInPage() {
    const userService = new UserService();
    const router = useRouter();
    const { t } = useTranslation();
    const { email, setEmail, password, setPassword, setAccessToken } =
        useLoginState();
    const [showPassword, setShowPassword] = useState(false);

    const disableButton = !email.includes("@") || password.length < 8;

    const handleSignIn = async () => {
        try {
            const loginResult = await userService.userLogin({
                email,
                password,
            });

            const accessToken = loginResult.data["access_token"];
            setAccessToken(accessToken);
            await AsyncStorage.setItem("accessToken", accessToken);
            setPassword("");
            router.replace("/(tabs)/home");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>
                    {t("signInPage.title", "Entrar")}
                </Text>
                <Text style={styles.label}>
                    {t("signInPage.email", "E-mail")}
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="exemplo@email.com"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.label}>
                    {t("signInPage.password", "Senha")}
                </Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1, marginBottom: 0 }]}
                        placeholder="********"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                    >
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
                    onPress={handleSignIn}
                    disabled={disableButton}
                >
                    <Text style={styles.buttonText}>
                        {t("signInPage.signIn", "Entrar")}
                    </Text>
                </TouchableOpacity>

                <View style={styles.linkContainer}>
                    <Text style={styles.loginText}>
                        {t("signInPage.noAccount", "Não possui uma conta?")}{" "}
                    </Text>
                    <Pressable onPress={() => router.push("/signUp")}>
                        <Text style={styles.loginLink}>
                            {t("signInPage.signUp", "Cadastre-se")}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#7FB87F",
        paddingTop: 100,
    },
    formContainer: {
        flex: 1,
        backgroundColor: "#fff",
        marginTop: 100,
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
        backgroundColor: "#7FB87F",
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
});

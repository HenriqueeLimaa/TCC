import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LoginStateProvider } from "@/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import '../i18n';
import React from "react";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // just to make sure the token is loaded before the app tries to use it
  const [initialAccessToken, setInitialAccessToken] = useState<string | null>(
    ""
  );
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({});
  // place the path of the font
  // eg: useFonts({
  // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });

  useEffect(() => {
    const loadAccessToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setInitialAccessToken(token);
    };

    loadAccessToken();
  }, []);

  useEffect(() => {
    // if (initialAccessToken !== null) {
    if (true) {
      router.replace("/(tabs)/home");
    }
  }, [initialAccessToken]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LoginStateProvider initialAccessToken={initialAccessToken}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signIn" />
          <Stack.Screen name="signUp" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="pageNotFound" />
        </Stack>
      </ThemeProvider>
    </LoginStateProvider>
  );
}

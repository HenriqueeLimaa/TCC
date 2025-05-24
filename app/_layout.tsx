import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { useFonts } from "expo-font";
import {
  Stack,
  useRouter,
  useSegments,
  SplashScreen as RouterSplashScreen,
} from "expo-router";
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
import "../i18n";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialAccessToken, setInitialAccessToken] = useState<string | null>(
    null
  );
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf"),
    "Roboto-Italic": require("../assets/fonts/Roboto/Roboto-Italic-VariableFont_wdth,wght.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto/static/Roboto_SemiCondensed-Medium.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto/static/Roboto_SemiCondensed-Bold.ttf"),
  });

  useEffect(() => {
    const loadAccessToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      setInitialAccessToken(token);
      setIsNavigationReady(true);
    };

    loadAccessToken();
  }, []);

  useEffect(() => {
    if (isNavigationReady && fontsLoaded) {
      didLoadContent();
    }
  }, [isNavigationReady, fontsLoaded, initialAccessToken, router]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const didLoadContent = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    router.replace(accessToken === null ? "/signIn" : "/(tabs)/home");
  };

  return (
    <GestureHandlerRootView>
      <LoginStateProvider initialAccessToken={initialAccessToken}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style="dark" backgroundColor="#FFFFFF" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="signIn" />
            <Stack.Screen name="signUp" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="pageNotFound" />
          </Stack>
        </ThemeProvider>
      </LoginStateProvider>
    </GestureHandlerRootView>
  );
}

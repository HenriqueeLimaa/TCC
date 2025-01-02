import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { LoginStateProvider } from "@/store";
import { useLoginState } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setAccessToken } = useLoginState();
  const colorScheme = useColorScheme();
  // place the path of the font
  // eg: useFonts({
  // SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  // });
  const [loaded] = useFonts({});

  useEffect(() => {
    const loadTokenOpeningApp = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
      }
    };

    loadTokenOpeningApp();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <LoginStateProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signIn" />
          <Stack.Screen name="signUp" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="pageNotFound" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </LoginStateProvider>
  );
}

import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from 'react-i18next';
import { useColorScheme, useLoginState } from "@/hooks";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol, IconSymbolName } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { accessToken } = useLoginState();
  const { t } = useTranslation();

  // Only try to navigate when the component is mounted and accessToken is actually checked
  useEffect(() => {
    // Only navigate if we're certain the token is missing (not just loading)
    if (accessToken === null) {
      router.replace("/signIn");
    }
  }, [accessToken, router]);

  // Instead of returning null which can cause navigation issues,
  // render the Tabs component even when not authenticated
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('tabBar.home'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          title: t('tabBar.partner'),
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabBar.profile'),
          tabBarIcon: ({ color }) => (
            // need to fix this later to show the correct icon, which could be the commented one
            // <IconSymbol size={28} name={"accountCircle.fill" as IconSymbolName} color={color} />
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme, useLoginState } from "@/hooks";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/shared";

export default function TabLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { accessToken } = useLoginState();
  const { t } = useTranslation();

  useEffect(() => {
    if (accessToken === null) {
      router.replace("/signIn");
    }
  }, [accessToken, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 16,
        },
        tabBarStyle: {
          paddingTop: 12,
          height: 80,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Tarefas",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon="tasks" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="partner"
        options={{
          title: "Dopamigo",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon="pet" active={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon="profile" active={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

import React, { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { useLoginState } from "@/hooks";
import { HapticTab } from "@/components/HapticTab";
import { Colors } from "@/constants/Colors";
import { TabBarIcon } from "@/components/shared";

export default function TabLayout() {
    const router = useRouter();
    const { accessToken } = useLoginState();

    useEffect(() => {
        if (accessToken === null) {
            router.replace("/signIn");
        }
    }, [accessToken, router]);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.light.text,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarLabelStyle: {
                    fontSize: 12,
                    lineHeight: 16,
                },
                tabBarStyle: {
                    paddingTop: 12,
                    height: 80,
                    backgroundColor: "#FFFFFF",
                },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Tarefas",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon icon="tasks" active={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="partner"
                options={{
                    title: "Dopamigo",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon icon="pet" active={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon icon="profile" active={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

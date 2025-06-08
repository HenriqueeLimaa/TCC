import React, { useEffect, useMemo, useState } from "react";
import { PageContainer, Text } from "@/components/shared";
import { Colors } from "@/constants/Colors";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    Achievement,
    AchievementGroup,
} from "@/components/achievements/AchievementGroup";
import { AchievementsService } from "@/api/achievementsService";
import { formatIsoDate } from "@/utils/dateUtils";
import { useRouter } from "expo-router";

export default function UserAchievements() {
    const router = useRouter();

    const [unlockedAchievements, setUnlockedAchievements] = useState<
        Achievement[]
    >([]);
    const [blockedAchievements, setBlockedAchievements] = useState<
        Achievement[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const achievementService = useMemo(() => new AchievementsService(), []);

    useEffect(() => {
        const loadAchievements = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await achievementService.fetchAchievements();
                const { unlocked, blocked } = response.data;

                const formattedUnlocked = unlocked.map((ach) => ({
                    id: ach.id,
                    name: ach.name,
                    unlockedDate: formatIsoDate(ach.unlockedAt),
                }));

                const formattedBlocked = blocked.map((ach) => ({
                    id: ach.id,
                    name: ach.name,
                }));

                setUnlockedAchievements(formattedUnlocked);
                setBlockedAchievements(formattedBlocked);
            } catch (err) {
                console.error("Failed to load achievements:", err);
                setError("Não foi possível carregar as conquistas.");
            } finally {
                setIsLoading(false);
            }
        };

        loadAchievements();
    }, [achievementService]);

    if (isLoading) {
        return (
            <PageContainer customStyle={{ backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Carregando conquistas...</Text>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer customStyle={{ backgroundColor: Colors.background }}>
                <Ionicons
                    name="warning-outline"
                    size={40}
                    color={Colors.secondaryText}
                />
                <Text style={styles.errorText}>{error}</Text>
            </PageContainer>
        );
    }

    const hasAnyAchievement =
        unlockedAchievements.length > 0 || blockedAchievements.length > 0;

    return (
        <PageContainer
            customStyle={{
                backgroundColor: Colors.background,
            }}
        >
            <ScrollView
                contentContainerStyle={styles.scrollViewContainer}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity onPress={router.back}>
                    <View style={styles.topNavigationContainer}>
                        <Ionicons
                            name="chevron-back-outline"
                            size={28}
                            color="#CCCCCC"
                        />
                        <Text style={styles.backButtonText}>Perfil</Text>
                    </View>
                </TouchableOpacity>
                {!hasAnyAchievement && !isLoading && !error && (
                    <View style={styles.centeredMessageContainer}>
                        <Ionicons
                            name="trophy-outline"
                            size={48}
                            color={Colors.secondaryText}
                        />
                        <Text style={styles.noAchievementsText}>
                            Nenhuma conquista disponível ainda.
                        </Text>
                    </View>
                )}
                <AchievementGroup
                    title="Conquistas desbloqueadas"
                    achievements={unlockedAchievements}
                    isUnlockedSection={true}
                />

                {blockedAchievements.length > 0 && (
                    <AchievementGroup
                        title="Conquistas pendentes"
                        achievements={blockedAchievements}
                        isUnlockedSection={false}
                    />
                )}
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        paddingBottom: 100,
        height: "100%",
    },
    topNavigationContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
    },
    backButtonText: {
        color: Colors.secondaryText,
        fontWeight: "bold",
        fontSize: 14,
    },
    centeredMessageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.secondaryText,
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    noAchievementsText: {
        marginTop: 16,
        fontSize: 16,
        color: Colors.secondaryText,
        textAlign: "center",
    },
});

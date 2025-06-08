import React, { useState, useEffect } from "react";
import { PageContainer, Title, Text } from "@/components/shared";
import {
    UserPatternsDto,
    UserPatternsService,
} from "@/api/userPatternsService";
import {
    ScrollView,
    StyleSheet,
    View,
    TouchableOpacity,
    LayoutAnimation,
    UIManager,
    Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SuggestionsView, UserPatternView } from "@/components/pattern";
import { Colors } from "@/constants/Colors";
if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsOpen(!isOpen);
    };

    return (
        <View style={styles.collapsibleContainer}>
            <TouchableOpacity onPress={toggleOpen} style={styles.header}>
                <Title style={styles.headerTitle}>{title}</Title>
                <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={24}
                    color={Colors.primary}
                />
            </TouchableOpacity>
            {isOpen && <View style={styles.content}>{children}</View>}
        </View>
    );
};

export default function UserPatterns() {
    const router = useRouter();
    const userPatternsService = new UserPatternsService();

    const [patterns, setPatterns] = useState<UserPatternsDto | null>(null);
    const [suggestions, setSuggestions] = useState<string | null>(null);
    const [improvements, setImprovements] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [patternsData, suggestionsData, improvementsData] =
                    await Promise.all([
                        userPatternsService.getPatterns(),
                        userPatternsService.getSuggestions(),
                        userPatternsService.getImprovements(),
                    ]);

                setPatterns(patternsData.data);
                setSuggestions(suggestionsData.data);
                setImprovements(improvementsData.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    return (
        <PageContainer>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="chevron-back" size={24} color={"black"} />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <Title>IA: Padrões e Sugestões</Title>
                <Text style={styles.subtitle}>
                    Descubra os padrões de sua rotina e receba dicas para
                    melhorar!
                </Text>

                {isLoading ? (
                    <Text style={styles.loadingText}>
                        Carregando insights...
                    </Text>
                ) : (
                    <>
                        <CollapsibleSection title="Seus Padrões">
                            {patterns ? (
                                <UserPatternView {...patterns} />
                            ) : (
                                <Text>Nenhum padrão encontrado...</Text>
                            )}
                        </CollapsibleSection>

                        <CollapsibleSection title="Sugestões da IA">
                            {suggestions ? (
                                <SuggestionsView suggestionText={suggestions} />
                            ) : (
                                <Text>Nenhuma sugestão encontrada...</Text>
                            )}
                        </CollapsibleSection>

                        <CollapsibleSection title="Análise de Progresso">
                            {improvements ? (
                                <SuggestionsView
                                    suggestionText={improvements}
                                />
                            ) : (
                                <Text>Nenhum progresso ainda...</Text>
                            )}
                        </CollapsibleSection>
                    </>
                )}
            </ScrollView>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    backButton: {
        marginBottom: 16,
    },
    scrollViewContent: {
        paddingTop: 16,
        paddingBottom: 40,
    },
    subtitle: {
        marginBottom: 24,
        fontSize: 16,
        color: Colors.secondaryText,
    },
    loadingText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: Colors.secondaryText,
    },
    collapsibleContainer: {
        backgroundColor: Colors.background,
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: Colors.secondaryText,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
    },
    headerTitle: {
        fontSize: 18,
        flex: 1,
        paddingTop: 16,
    },
    content: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
});

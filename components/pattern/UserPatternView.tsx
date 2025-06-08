import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";
import { Text } from "../shared";
import { Colors } from "@/constants/Colors";
import { UserPatternsDto } from "@/api/userPatternsService";
import { formatAverageTime } from "@/utils/dateUtils";

export const UserPatternView: React.FC<UserPatternsDto> = ({
    averageCompletionTime,
    commonTaskTitles,
    completionPercentage,
    mostFrequentCompletionHour,
    mostProductiveDays,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.mainTitle}>Seus Padrões de Produtividade</Text>
            <View style={styles.card}>
                <View style={styles.metricsContainer}>
                    <View style={styles.metricItem}>
                        <Ionicons
                            name="pie-chart-outline"
                            size={32}
                            color={Colors.primary}
                        />
                        <Text style={styles.metricValue}>
                            {completionPercentage}%
                        </Text>
                        <Text style={styles.metricLabel}>
                            Taxa de Conclusão
                        </Text>
                    </View>

                    <View style={styles.metricItem}>
                        <Ionicons
                            name="timer-outline"
                            size={32}
                            color={Colors.primary}
                        />
                        <Text style={styles.metricValue}>
                            {formatAverageTime(averageCompletionTime)}
                        </Text>
                        <Text style={styles.metricLabel}>Tempo Médio</Text>
                    </View>

                    <View style={styles.metricItem}>
                        <Ionicons
                            name="hourglass-outline"
                            size={32}
                            color={Colors.primary}
                        />
                        <Text style={styles.metricValue}>
                            {mostFrequentCompletionHour ?? "N/A"}
                        </Text>
                        <Text style={styles.metricLabel}>Horário de Pico</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name="calendar-outline"
                        size={22}
                        color={Colors.primaryText}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>
                        Dias Mais Produtivos
                    </Text>
                </View>
                <View style={styles.pillsContainer}>
                    {mostProductiveDays?.length > 0 ? (
                        mostProductiveDays.map((day) => (
                            <View key={day} style={styles.pill}>
                                <Text style={styles.pillText}>{day}</Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>Nenhum dado ainda.</Text>
                    )}
                </View>
            </View>
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons
                        name="list-outline"
                        size={22}
                        color={Colors.primaryText}
                        style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>
                        Tópicos de Tarefas Comuns
                    </Text>
                </View>
                <View style={styles.listContainer}>
                    {commonTaskTitles?.length > 0 ? (
                        commonTaskTitles.slice(0, 3).map((title, index) => (
                            <Text key={index} style={styles.listItem}>
                                • {title}
                            </Text>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>
                            Nenhuma tarefa comum encontrada.
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colors.background,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.primaryText,
        marginBottom: 16,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    metricsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    metricItem: {
        alignItems: "center",
        flex: 1,
    },
    metricValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: Colors.primary,
        marginTop: 8,
    },
    metricLabel: {
        fontSize: 12,
        color: Colors.secondaryText,
        marginTop: 4,
    },
    section: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: Colors.primaryText,
    },
    pillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    pill: {
        backgroundColor: Colors.background,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    pillText: {
        color: Colors.placeholder,
        fontWeight: "500",
        fontSize: 14,
    },
    listContainer: {
        paddingLeft: 8,
    },
    listItem: {
        fontSize: 16,
        color: Colors.primaryText,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: Colors.secondaryText,
        fontStyle: "italic",
    },
});

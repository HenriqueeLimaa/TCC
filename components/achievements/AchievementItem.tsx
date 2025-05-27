import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Platform, View, StyleSheet } from "react-native";
import { Text } from "../shared";
import { Colors } from "@/constants/Colors";

interface AchievementItemProps {
    name: string;
    unlockedDate?: string;
    isUnlocked: boolean;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({
    name,
    unlockedDate,
    isUnlocked,
}) => {
    return (
        <View
            style={[
                itemStyles.container,
                { backgroundColor: isUnlocked ? Colors.card : "#CCCCCC" },
            ]}
        >
            <Text style={itemStyles.name}>{name}</Text>
            {isUnlocked && (
                <View style={itemStyles.detailsContainer}>
                    <Text style={itemStyles.date}>{unlockedDate}</Text>
                    <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={Colors.primary}
                    />
                </View>
            )}
        </View>
    );
};

const itemStyles = StyleSheet.create({
    container: {
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        shadowColor: Platform.OS === "ios" ? "#000000" : Colors.primaryText,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.2,
        shadowRadius: Platform.OS === "ios" ? 3 : 1.5,
        elevation: 2,
    },
    name: {
        fontSize: 14,
        color: Colors.primaryText,
        flex: 1,
        marginRight: 10,
    },
    detailsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    date: {
        fontSize: 14,
        color: Colors.secondaryText,
        marginRight: 8,
    },
});

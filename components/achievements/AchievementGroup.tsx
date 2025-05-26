import React, { useEffect, useRef, useState } from "react";
import { Text } from "../shared";
import { Colors } from "@/constants/Colors";
import { View, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AchievementItem } from "./AchievementItem";

export interface Achievement {
    id: string;
    name: string;
    unlockedDate?: string;
}
interface AchievementSectionProps {
    title: string;
    achievements: Achievement[];
    isUnlockedSection: boolean;
    initiallyExpanded?: boolean;
}

export const AchievementGroup: React.FC<AchievementSectionProps> = ({
    title,
    achievements,
    isUnlockedSection,
    initiallyExpanded = true,
}) => {
    const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
    const spinValue = useRef(
        new Animated.Value(initiallyExpanded ? 1 : 0)
    ).current;

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        Animated.timing(spinValue, {
            toValue: isExpanded ? 1 : 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [isExpanded, spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    if (achievements.length === 0) {
        return null;
    }

    return (
        <View style={sectionStyles.container}>
            <TouchableOpacity
                onPress={toggleExpansion}
                style={sectionStyles.header}
            >
                <Text style={sectionStyles.title}>{title}</Text>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="chevron-down" size={24} color="#999999" />
                </Animated.View>
            </TouchableOpacity>
            {isExpanded && (
                <View style={sectionStyles.listContainer}>
                    {achievements.map((ach) => (
                        <AchievementItem
                            key={ach.id}
                            name={ach.name}
                            unlockedDate={ach.unlockedDate}
                            isUnlocked={isUnlockedSection}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const sectionStyles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.primaryText,
    },
    listContainer: {},
});

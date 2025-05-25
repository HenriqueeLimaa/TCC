import { Colors } from "@/constants/Colors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export const AddButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.plusCircle}>
                <Text style={styles.plusText}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 24,
        marginBottom: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    plusCircle: {
        width: 64,
        height: 64,
        backgroundColor: Colors.primary,
        borderRadius: 32,
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    plusText: {
        color: "white",
        fontSize: 44,
        paddingBottom: 80,
    },
});

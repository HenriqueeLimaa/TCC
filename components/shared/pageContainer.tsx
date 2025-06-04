import { Colors } from "@/constants/Colors";
import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const PageContainer = ({
    children,
    customStyle,
}: {
    children: ReactNode;
    customStyle?: any;
}) => {
    const insets = useSafeAreaInsets();
    return (
        <View
            style={[
                customStyle || {
                    backgroundColor: Colors.card,
                },
                { flex: 1, paddingTop: insets.top },
            ]}
        >
            <View style={[styles.pageContent]}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    pageContent: {
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
        paddingTop: 32,
        flex: 1,
    },
});

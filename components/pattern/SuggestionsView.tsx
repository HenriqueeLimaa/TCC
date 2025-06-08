import React from "react";
import { View, Text, StyleSheet, TextStyle } from "react-native";
import { Colors } from "@/constants/Colors";

interface SuggestionsViewProps {
    suggestionText: string;
}
const renderTextWithBold = (text: string, baseStyle: TextStyle) => {
    if (!text.includes("**")) {
        return <Text style={baseStyle}>{text}</Text>;
    }

    const parts = text.split("**");

    return (
        <Text style={baseStyle}>
            {parts.map((part, index) =>
                index % 2 === 1 ? (
                    <Text key={index} style={{ fontWeight: "bold" }}>
                        {part}
                    </Text>
                ) : (
                    part
                )
            )}
        </Text>
    );
};

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
    suggestionText,
}) => {
    const lines = suggestionText.split("\n");
    return (
        <View style={styles.containerView}>
            <View style={styles.container}>
                {lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith("###")) {
                        const cleanLine = trimmedLine.replace(/^###\s*/, "");
                        return (
                            <View key={index} style={styles.h3Container}>
                                {renderTextWithBold(cleanLine, styles.h3)}
                            </View>
                        );
                    }

                    if (trimmedLine.match(/^\d+\.\s/)) {
                        const cleanLine = trimmedLine.replace(/^\d+\.\s*/, "");
                        return (
                            <View key={index} style={styles.listItemContainer}>
                                <Text style={styles.listItemBullet}>
                                    {trimmedLine.match(/^\d+\./)?.[0]}
                                </Text>
                                {renderTextWithBold(
                                    cleanLine,
                                    styles.listItemText
                                )}
                            </View>
                        );
                    }

                    if (trimmedLine.startsWith("-")) {
                        const cleanLine = trimmedLine.replace(/^-\s*/, "");
                        return (
                            <View
                                key={index}
                                style={styles.subListItemContainer}
                            >
                                <Text style={styles.subListItemBullet}>•</Text>
                                {renderTextWithBold(
                                    cleanLine,
                                    styles.subListItemText
                                )}
                            </View>
                        );
                    }
                    if (trimmedLine.length > 0) {
                        return (
                            <View key={index} style={styles.paragraphContainer}>
                                {renderTextWithBold(
                                    trimmedLine,
                                    styles.paragraph
                                )}
                            </View>
                        );
                    }
                    return <View key={index} style={{ height: 10 }} />;
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    h3Container: {
        marginTop: 20,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.placeholder,
        paddingBottom: 8,
    },
    h3: {
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.primary,
    },
    paragraphContainer: {
        marginBottom: 16,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.primaryText,
    },
    listItemContainer: {
        flexDirection: "row",
        marginBottom: 12,
        alignItems: "flex-start",
    },
    listItemBullet: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.primaryText,
        fontWeight: "bold",
        marginRight: 8,
    },
    listItemText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        color: Colors.primaryText,
    },
    subListItemContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 8,
        marginLeft: 25,
    },
    subListItemBullet: {
        fontSize: 16,
        lineHeight: 24,
        color: Colors.secondaryText,
        marginRight: 8,
    },
    subListItemText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: Colors.placeholder,
    },
});

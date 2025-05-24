import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "./Text";

type HourType = "morning" | "afternoon" | "night" | null;

interface HourIconProps {
  taskHour: string;
  hourType: HourType;
  size?: number;
}

export const HourIcon: React.FC<HourIconProps> = ({
  taskHour,
  hourType,
  size = 28,
}) => {
  const getIconSource = () => {
    switch (hourType) {
      case "morning":
        return require("../../assets/images/morningTaskIcon.png");
      case "afternoon":
        return require("../../assets/images/afternoonTaskIcon.png");
      case "night":
        return require("../../assets/images/nightTaskIcon.png");
      default:
        return require("../../assets/images/taskIconMock.png");
    }
  };

  const getBackgroundColor = () => {
    switch (hourType) {
      case "morning":
        return "rgba(255, 195, 0, 0.25)";
      case "afternoon":
        return "rgba(25, 157, 227, 0.20)";
      case "night":
        return "rgba(100, 100, 255, 0.25)";
      default:
        return "rgba(205, 121, 171, 0.25)";
    }
  };

  const getTextColor = () => {
    switch (hourType) {
      case "morning":
        return "#EE8B00";
      case "afternoon":
        return "#0A70B9";
      case "night":
        return "#000CB8";
      default:
        return "#CD79AB";
    }
  };

  return (
    <View
      style={[
        styles.iconBackground,
        {
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      <Image
        source={getIconSource()}
        style={{ width: size * 0.7, height: size * 0.7 }}
      />
      <Text style={[styles.taskHour, { color: getTextColor() }]}>
        {taskHour}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBackground: {
    flexDirection: "row",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  taskHour: {
    fontSize: 12,
    marginLeft: 4,
  },
});

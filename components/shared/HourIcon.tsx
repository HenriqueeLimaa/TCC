import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "./Text";

type HourType = "morning" | "afternoon" | "night" | null;

interface HourIconProps {
  taskHour: string;
  hourType: HourType;
  size?: number;
}

export const HourIcon: React.FC<HourIconProps> = ({ taskHour, hourType, size = 28 }) => {
  // Selecionar o ícone correto com base no horário
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

  // Cores de fundo para cada período do dia
  const getBackgroundColor = () => {
    switch (hourType) {
      case "morning":
        return "rgba(255, 195, 0, 0.25)"; // Amarelo claro para manhã
      case "afternoon":
        return "rgba(25, 157, 227, 0.20)"; // Laranja claro para tarde
      case "night":
        return "rgba(100, 100, 255, 0.25)"; // Azul claro para noite
      default:
        return "rgba(205, 121, 171, 0.25)"; // Cor padrão (mesma do taskIconMock)
    }
  };

  // Cores do texto para cada período do dia
  const getTextColor = () => {
    switch (hourType) {
      case "morning":
        return "#EE8B00"; // Cor para manhã
      case "afternoon":
        return "#0A70B9"; // Cor para tarde
      case "night":
        return "#000CB8"; // Cor para noite
      default:
        return "#CD79AB"; // Cor padrão
    }
  };

  return (
    <View 
      style={[
        styles.iconBackground, 
        {
          backgroundColor: getBackgroundColor() 
        }
      ]}
    >
      <Image 
        source={getIconSource()} 
        style={{ width: size * 0.7, height: size * 0.7 }} 
      />
      <Text style={[styles.taskHour, { color: getTextColor() }]}>{taskHour}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  iconBackground: {
    flexDirection: "row",
    width: 70,
    height: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  taskHour: {
    fontSize: 14,
    marginLeft: 4
  }
});
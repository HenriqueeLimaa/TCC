import { StyleSheet, View, ImageBackground, Text, Image } from "react-native";
import { PageContainer, Title } from "@/components/shared";
import tinycolor from "tinycolor2";
import React from "react";

const BG_IMAGES = {
  "1": require("../../assets/images/petBackgrounds/bg1.png"),
  "2": require("../../assets/images/petBackgrounds/bg2.png"),
  "3": require("../../assets/images/petBackgrounds/bg3.png"),
  "4": require("../../assets/images/petBackgrounds/bg4.png"),
  "5": require("../../assets/images/petBackgrounds/bg5.png"),
  "6": require("../../assets/images/petBackgrounds/bg6.png"),
  "7": require("../../assets/images/petBackgrounds/bg7.png"),
};

const PET_IMAGES = {
  "1": require("../../assets/images/petStates/pet1.png"),
  "2": require("../../assets/images/petStates/pet2.png"),
  "3": require("../../assets/images/petStates/pet3.png"),
  "4": require("../../assets/images/petStates/pet4.png"),
  "5": require("../../assets/images/petStates/pet5.png"),
  "6": require("../../assets/images/petStates/pet6.png"),
  "7": require("../../assets/images/petStates/pet7.png"),
};

export default function TabTwoScreen() {
  const health = 30;

  const getPetStateIndex = () => {
    if (health > 80) return "1";
    else if (health > 60) return "2";
    else if (health > 40) return "3";
    else if (health > 20) return "4";
    else if (health > 10) return "5";
    else if (health > 0) return "6";

    return "7";
  };

  const getInterpolatedColor = () => {
    const ratio = 1 - health / 100; // 0 quando health = 100, 1 quando health = 0
    return tinycolor.mix("#1DB718", "#B71818", ratio * 100).toHexString();
  };

  const getShadowColor = () => {
    const baseColor = getInterpolatedColor();
    return tinycolor(baseColor).darken(10).toHexString();
  };

  const bgImage = BG_IMAGES[getPetStateIndex()];

  return (
    <PageContainer customStyle={styles.container}>
      <Title>Dopamigo</Title>
      <ImageBackground source={bgImage} style={styles.petContainer}>
        <Image
          source={PET_IMAGES[getPetStateIndex()]}
          style={styles.petImage}
        />
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${health}%`,
                backgroundColor: getInterpolatedColor(),
              },
            ]}
          />
          <View
            style={[
              styles.barShadow,
              {
                width: `${health}%`,
                backgroundColor: getShadowColor(),
              },
            ]}
          />
        </View>
      </ImageBackground>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {},
  petContainer: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  petImage: {
    width: 240,
    height: 340,
    resizeMode: "contain",
  },
  barBackground: {
    width: 260,
    height: 40,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 9,
    borderColor: "#514B44",
    alignSelf: "center",
    marginTop: 20,
  },
  barFill: {
    height: "100%",
  },
  barShadow: {
    position: "absolute",
    bottom: 0,
    height: "40%",
  },
});

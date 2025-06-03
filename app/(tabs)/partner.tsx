import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TextInput,
  Button,
} from "react-native";
import { PageContainer, Title, Text } from "@/components/shared";
import tinycolor from "tinycolor2";
import { VirtualPetService } from "@/api/virtualPetService";

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
  const [userHasPet, setUserHasPet] = useState(false);
  const [petName, setPetName] = useState("");

  const [hapinessLevel, setHapinessLevel] = useState(0);
  const [id, setId] = useState("");
  const [lastInteraction, setLastInteraction] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [name, setName] = useState("");

  console.log("==> petName:", petName);
  const virtualPetService = new VirtualPetService();

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const petData = await virtualPetService.getPet();
        console.log("==> Dados do pet:", petData);

        if (petData.data) {
          setUserHasPet(true);
          setId(petData.data.id);
          setHapinessLevel(petData.data.hapinessLevel);
          
          const formattedDate = petData.data.lastInteraction 
            ? new Date(petData.data.lastInteraction).toLocaleDateString('pt-BR')
            : null;
          setLastInteraction(formattedDate);
          
          setLevel(petData.data.level);
          setName(petData.data.name);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do pet:", error);
        setUserHasPet(false);
        return;
      }
    };

    fetchPetData();
  }, []);

  console.log("==> PET DATAAAAA!!!: ", {
    userHasPet,
    id,
    hapinessLevel,
    lastInteraction,
    level,
    name,
  });

  const handleCreatePet = async () => {
    try {
      const newPet = await virtualPetService.createPet({ name: petName });
      console.log("Pet criado com sucesso:", newPet);
      setUserHasPet(true);
    } catch (error) {
      console.error("Erro ao criar pet:", error);
    }
  };

  const getPetStateIndex = () => {
    if (hapinessLevel > 80) return "1";
    else if (hapinessLevel > 60) return "2";
    else if (hapinessLevel > 40) return "3";
    else if (hapinessLevel > 20) return "4";
    else if (hapinessLevel > 10) return "5";
    else if (hapinessLevel > 0) return "6";

    return "7";
  };

  const getInterpolatedColor = () => {
    const ratio = 1 - hapinessLevel / 100;
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
        {!userHasPet && (
          <View style={{ backgroundColor: "#FFFFFF" }}>
            <Text>Parece que você ainda não criou seu pet...</Text>
            <TextInput
              placeholder="Escolha o nome do seu pet!"
              value={petName}
              onChangeText={setPetName}
            />
            <Button title="Confirmar" onPress={handleCreatePet} />
          </View>
        )}

        {userHasPet && (
          <View style={{ backgroundColor: "#FFFFFF" }}>
            <Text>Olá, {name}!</Text>
            <Text>Felicidade: {hapinessLevel}%</Text>
            <Text>Nível: {level}</Text>
            <Text>Última interação: {lastInteraction}</Text>
          </View>
        )}

        <Image
          source={PET_IMAGES[getPetStateIndex()]}
          style={styles.petImage}
        />
        <View style={styles.barBackground}>
          <View
            style={[
              styles.barFill,
              {
                width: `${hapinessLevel}%`,
                backgroundColor: getInterpolatedColor(),
              },
            ]}
          />
          <View
            style={[
              styles.barShadow,
              {
                width: `${hapinessLevel}%`,
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

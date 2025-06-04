import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
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
            ? new Date(petData.data.lastInteraction).toLocaleDateString("pt-BR")
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
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1 }}
        >
          <Title>Dopamigo</Title>
          <ImageBackground 
            source={bgImage} 
            style={[
              styles.petContainer,
              !userHasPet && { justifyContent: "flex-end" }
            ]}
          >
            {userHasPet && (
              <View style={styles.petInfoContainer}>
                <Text style={styles.petInfoText}>{name}</Text>
                <Text style={styles.petInfoText}>
                  LV.
                  <Text style={{ color: "#5B4133", fontSize: 24 }}>
                    {level}
                  </Text>
                </Text>
              </View>
            )}

            <Image
              source={PET_IMAGES[getPetStateIndex()]}
              style={styles.petImage}
            />
            {userHasPet && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 40,
                }}
              >
                <Text style={{ color: "#514B44" }}>
                  Última interação: {lastInteraction}
                </Text>
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
              </View>
            )}

            {!userHasPet && (
              <View>
                <View style={styles.createPetContainer}>
                  <Text>Meu dopamigo se chama...</Text>
                  <TextInput
                    placeholder="Escreva um nome..."
                    value={petName}
                    onChangeText={setPetName}
                    style={styles.createPetInput}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.createPetButton,
                    !petName.trim() && styles.createPetButtonDisabled,
                  ]}
                  onPress={handleCreatePet}
                  disabled={!petName.trim()}
                >
                  <Text
                    style={[
                      styles.createPetButtonText,
                      !petName.trim() ? styles.createPetButtonTextDisabled : {},
                    ]}
                  >
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  petContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 600,
    paddingVertical: 12,
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
    marginTop: 8,
  },
  barFill: {
    height: "100%",
  },
  barShadow: {
    position: "absolute",
    bottom: 0,
    height: "40%",
  },
  petInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  petInfoText: {
    fontSize: 24,
    lineHeight: 24,
    textAlignVertical: "center",
    color: "#514B44",
  },
  createPetContainer: {
    backgroundColor: "#FFFFFF",
    opacity: 0.7,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  createPetInput: {
    minWidth: 300,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#333333",
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
  },
  createPetButton: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 300,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#00A954",
    marginTop: 12,
  },
  createPetButtonDisabled: {
    backgroundColor: "#A8A8A8",
  },
  createPetButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  createPetButtonTextDisabled: {
    color: "#6B6B6B",
  },
});

import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { PageContainer, Notification } from "@/components/shared";
import { NotificationType } from "@/types/notification";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/components/shared";
import { Colors } from "@/constants/Colors";
import { UserService } from "@/api/userService";
import { formatIsoDate } from "@/utils/dateUtils";

export default function Profile() {
  const userService = new UserService();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [dob, setDob] = useState("");

  const [originalName, setOriginalName] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalDob, setOriginalDob] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [notification, setNotification] = useState<NotificationType | null>(
    null
  );

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const user = await userService.fetchLoggedUser();
        const data = user.data;
        if (!data) {
          Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
          return;
        }

        setEmail(data.email);

        const currentName = data.name || "";
        const currentNickname = data.nickname || "";
        const currentDob = data.birthDate ? formatIsoDate(data.birthDate) : "";

        setName(currentName);
        setNickname(currentNickname);
        setDob(currentDob);

        setOriginalName(currentName);
        setOriginalNickname(currentNickname);
        setOriginalDob(currentDob);
      } catch (error) {
        setNotification({
          message: "Erro ao carregar os dados do usuário.",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    setName("");
    setNickname("");
    setDob("");
    setEmail("");
    setOriginalName("");
    setOriginalNickname("");
    setOriginalDob("");
    AsyncStorage.removeItem("accessToken");
    router.replace("/signIn");
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      setOriginalName(name);
      setOriginalNickname(nickname);
      setOriginalDob(dob);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setName(originalName);
    setNickname(originalNickname);
    setDob(originalDob);
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!name.trim()) {
      setNotification({
        message: "Nome é obrigatório.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!dob) {
        setNotification({
          message:
            "Data inválida\nPor favor, insira a data de nascimento no formato MM/DD/AAAA.",
          type: "error",
        });
        setIsLoading(false);
        return;
      }

      const updatedProfile = {
        name: name.trim(),
        nickname: nickname.trim(),
        birthDate: dob,
      };

      await userService.update(updatedProfile);

      setOriginalName(name.trim());
      setOriginalNickname(nickname.trim());
      setOriginalDob(dob);

      setNotification({
        message: "Perfil atualizado com sucesso!",
        type: "success",
      });

      setIsEditing(false);

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      setNotification({
        message: "Erro ao atualizar perfil. Tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToTrophy = () => {
    router.push("../userAchievements");
  };

  return (
    <PageContainer
      customStyle={{
        backgroundColor: Colors.background,
      }}
    >
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <View>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileHeaderCard}>
            <Ionicons
              name="person-circle-outline"
              size={32}
              color={Colors.primary}
              style={styles.profileIcon}
            />
            <View style={styles.profileHeaderTextContainer}>
              <Text style={styles.profileTitle}>Seu perfil</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>

            <TouchableOpacity onPress={navigateToTrophy}>
              <Ionicons
                name="trophy-outline"
                size={28}
                style={styles.profileIcon}
                color={Colors.secondaryText}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="words"
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Apelido</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Seu apelido"
                placeholderTextColor={Colors.placeholder}
                editable={isEditing}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Data de Nascimento</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={dob}
                onChangeText={setDob}
                placeholder="MM/DD/AAAA"
                placeholderTextColor={Colors.placeholder}
                keyboardType="numeric"
                editable={isEditing}
                maxLength={10}
              />
            </View>
          </View>

          {isEditing ? (
            <View style={styles.editingButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancelEdit}
                disabled={isLoading}
              >
                <Text
                  style={[styles.actionButtonText, styles.cancelButtonText]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.saveButton,
                  isLoading && styles.actionButtonDisabled,
                ]}
                onPress={handleSaveChanges}
                disabled={isLoading}
              >
                <Text style={styles.actionButtonText}>
                  {isLoading ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                isLoading && styles.actionButtonDisabled,
              ]}
              onPress={handleToggleEdit}
              disabled={isLoading}
            >
              <Text style={styles.actionButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
          <Text style={styles.signOutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  profileHeaderCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 24,
    elevation: 3,
  },
  profileIcon: {
    marginRight: 15,
  },
  profileHeaderTextContainer: {
    flex: 1,
  },
  profileTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryText,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  formContainer: {},
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.primaryText,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    height: 44,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.primaryText,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputDisabled: {
    color: Colors.secondaryText,
  },
  editingButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
    flex: 1,
  },
  saveButton: {
    marginRight: 5,
  },
  cancelButton: {
    marginLeft: 5,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: Colors.secondaryText,
  },
  signOutButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 16,
  },
  signOutButtonText: {
    fontSize: 14,
    color: Colors.textOnPrimary,
    fontWeight: "500",
  },
});

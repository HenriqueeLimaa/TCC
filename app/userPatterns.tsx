import React, { useState, useEffect } from "react";
import { PageContainer, Title, Text } from "@/components/shared";
import { UserPatternsService } from "@/api/userPatternsService";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function UserPatterns() {
  const router = useRouter();
  const userPatternsService = new UserPatternsService();

  const [patterns, setPatterns] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [improvements, setImprovements] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const patternsData = await userPatternsService.getPatterns();
        setPatterns(patternsData.data);
      } catch (error) {
        console.error("Error fetching patterns:", error);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const suggestionsData = await userPatternsService.getSuggestions();
        setSuggestions(suggestionsData.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const fetchImprovements = async () => {
      try {
        const improvementsData = await userPatternsService.getImprovements();
        setImprovements(improvementsData.data);
      } catch (error) {
        console.error("Error fetching improvements:", error);
      }
    };

    fetchPatterns();
    fetchSuggestions();
    fetchImprovements();
  }, []);

  return (
    <PageContainer>
      <TouchableOpacity
        style={{ marginBottom: 20 }}
        onPress={() => router.back()}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={'black'}
        />
      </TouchableOpacity>
      <Title>IA: Padrões, sugestões e melhorias</Title>
      <Text style={{ marginTop: 0 }}>
        Receba sugestões e descubra os padrões de sua rotina!
      </Text>

      <ScrollView style={{ marginTop: 20 }}>
        <View style={styles.section}>
          <Title style={styles.title}>Padrões</Title>
          {patterns.length > 0 ? (
            patterns.map((pattern, index) => (
              <Text key={index} style={{ marginBottom: 10 }}>
                {pattern.name}
              </Text>
            ))
          ) : (
            <Text>Nenhum padrão encontrado...</Text>
          )}
        </View>

        <View style={styles.section}>
          <Title style={styles.title}>Sugestões</Title>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <Text key={index} style={{ marginBottom: 10 }}>
                {suggestion.name}
              </Text>
            ))
          ) : (
            <Text>Nenhuma sugestão encontrada...</Text>
          )}
        </View>

        <View style={styles.section}>
          <Title style={styles.title}>Progresso</Title>
          {improvements.length > 0 ? (
            improvements.map((improvement, index) => (
              <Text key={index} style={{ marginBottom: 10 }}>
                {improvement.name}
              </Text>
            ))
          ) : (
            <Text>Nenhum progresso ainda...</Text>
          )}
        </View>
      </ScrollView>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
  },
});

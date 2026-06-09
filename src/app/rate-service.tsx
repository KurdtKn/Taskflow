import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/rateService";
import { useTheme } from "@/app/context/ThemeContext";

const ratingTags = [
  "Pontual",
  "Boa comunicação",
  "Profissional",
  "Serviço bem feito",
  "Recomendo",
  "Atencioso",
];

export default function RateServiceScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Pontual",
    "Boa comunicação",
  ]);
  const [comment, setComment] = useState("");

  const { isDark, theme } = useTheme();

  function toggleTag(tag: string) {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((item) => item !== tag);
      }

      return [...currentTags, tag];
    });
  }

  function handleSubmitReview() {
    console.log({
      jobTitle,
      candidateName,
      rating,
      selectedTags,
      comment,
    });

    router.replace("/company-dashboard");
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Avaliar serviço
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={[
              styles.introCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>⭐</Text>
            </View>

            <Text style={[styles.introTitle, { color: theme.text }]}>
              Como foi a experiência?
            </Text>

            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              Avalie o freelancer para ajudar outras empresas a contratarem com
              mais segurança.
            </Text>
          </View>

          <View
            style={[
              styles.serviceCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.cardLabel, { color: theme.primary }]}>
              Serviço concluído
            </Text>

            <Text style={[styles.serviceTitle, { color: theme.text }]}>
              {jobTitle}
            </Text>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Freelancer
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {candidateName}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Sua nota
            </Text>

            <View style={styles.starsArea}>
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;

                return (
                  <Pressable
                    key={starValue}
                    style={styles.starButton}
                    onPress={() => setRating(starValue)}
                  >
                    <Text
                      style={[
                        styles.star,
                        isActive ? styles.starActive : styles.starInactive,
                      ]}
                    >
                      ★
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.ratingText, { color: theme.text }]}>
              {rating === 5
                ? "Excelente"
                : rating === 4
                ? "Muito bom"
                : rating === 3
                ? "Regular"
                : rating === 2
                ? "Ruim"
                : "Muito ruim"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              O que se destacou?
            </Text>

            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Selecione pontos positivos sobre o atendimento.
            </Text>

            <View style={styles.tagsArea}>
              {ratingTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <Pressable
                    key={tag}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      isSelected && styles.tagActive,
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: theme.textSecondary },
                        isSelected && styles.tagTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Comentário
            </Text>

            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Escreva um comentário sobre sua experiência..."
              placeholderTextColor={theme.textSecondary}
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Avaliação mútua
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              No TaskFlow, empresas e freelancers podem avaliar uns aos outros
              após a conclusão do serviço.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>Enviar avaliação</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
import { useState } from "react";
import {
  Alert,
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/rateCompany";
import { useTheme } from "@/app/context/ThemeContext";

const API_URL = "http://192.168.1.111:5275";

const ratingTags = [
  "Boa comunicação",
  "Empresa organizada",
  "Pagamento correto",
  "Informações claras",
  "Respeitosa",
  "Recomendo",
];

const COMMENT_MIN_LENGTH = 50;
const COMMENT_MAX_LENGTH = 500;
const REVIEWS_STORAGE_KEY = "@taskflow:reviews";
const REQUESTS_ROUTE = "/requests";

type ReviewPayload = {
  id: string;
  jobId: string;
  requestId: string;
  jobTitle: string;
  ratedUserName: string;
  ratedUserType: string;
  rating: number;
  tags: string[];
  comment: string;
  createdAt: string;
};

function normalizeComment(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function getParamNumber(value?: string | string[], fallback = 0) {
  const paramValue = getParamValue(value, "");
  const numberValue = Number(paramValue);

  return Number.isFinite(numberValue) && numberValue > 0
    ? numberValue
    : fallback;
}

export default function RateCompanyScreen() {
  const params = useLocalSearchParams<{
    requestId?: string | string[];
    candidaturaId?: string | string[];
    jobId?: string | string[];
    jobTitle?: string | string[];
    companyName?: string | string[];
    contratoId?: string | string[];
    avaliadorId?: string | string[];
    avaliadoId?: string | string[];
  }>();

  const requestId = getParamValue(
    params.requestId ?? params.candidaturaId,
    ""
  );

  const jobId = getParamValue(params.jobId);
  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const companyName = getParamValue(params.companyName, "Empresa TaskFlow");

  // IDs temporários para teste prático direto no app.
  // Nesta tela, o freelancer avalia a empresa.
  const contratoId = getParamNumber(params.contratoId, 1);
  const avaliadorId = getParamNumber(params.avaliadorId, 3);
  const avaliadoId = getParamNumber(params.avaliadoId, 1);

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Boa comunicação",
    "Pagamento correto",
  ]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isDark, theme } = useTheme();

  const cleanTextAreaStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  function handleChangeComment(value: string) {
    setComment(value.slice(0, COMMENT_MAX_LENGTH));
  }

  function toggleTag(tag: string) {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((item) => item !== tag);
      }

      return [...currentTags, tag];
    });
  }

  function getValidationError() {
    const normalizedComment = normalizeComment(comment);

    if (rating <= 0) {
      return "Selecione uma nota para a empresa.";
    }

    if (!normalizedComment) {
      return "Escreva um comentário sobre sua experiência.";
    }

    if (normalizedComment.length < COMMENT_MIN_LENGTH) {
      return `O comentário precisa ter pelo menos ${COMMENT_MIN_LENGTH} caracteres.`;
    }

    if (normalizedComment.length > COMMENT_MAX_LENGTH) {
      return `O comentário pode ter no máximo ${COMMENT_MAX_LENGTH} caracteres.`;
    }

    return "";
  }

  async function saveReview(review: ReviewPayload) {
    const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
    const currentReviews = storedReviews ? JSON.parse(storedReviews) : [];

    const updatedReviews = [...currentReviews, review];

    await AsyncStorage.setItem(
      REVIEWS_STORAGE_KEY,
      JSON.stringify(updatedReviews)
    );
  }

  async function handleSubmitReview() {
    const validationError = getValidationError();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const normalizedComment = normalizeComment(comment);

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/api/Avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contratoId,
          avaliadorId,
          avaliadoId,
          nota: rating,
          comentario: normalizedComment,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        Alert.alert(
          "Erro",
          data?.mensagem || "Não foi possível enviar a avaliação para a API."
        );
        return;
      }

      const review: ReviewPayload = {
        id: `${Date.now()}-${jobId || "company-review"}`,
        jobId,
        requestId,
        jobTitle,
        ratedUserName: companyName,
        ratedUserType: "company",
        rating,
        tags: selectedTags,
        comment: normalizedComment,
        createdAt: new Date().toISOString(),
      };

      await saveReview(review);

      console.log("Avaliação enviada para API:", data);
      console.log("Avaliação da empresa salva localmente:", review);

      Alert.alert("Sucesso", "Avaliação enviada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace(REQUESTS_ROUTE),
        },
      ]);
    } catch (error) {
      console.log("Erro ao enviar avaliação da empresa:", error);

      Alert.alert(
        "Erro",
        "Não foi possível conectar com a API. Verifique se a API está ligada e se o IP está correto."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoBackToRequests() {
    router.replace(REQUESTS_ROUTE);
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
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Pressable style={styles.backButton} onPress={handleGoBackToRequests}>
            <ArrowBack
              width={28}
              height={28}
              color={theme.text}
              fill={theme.text}
            />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Avaliar empresa
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          style={{ backgroundColor: theme.background }}
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
              Como foi trabalhar com a empresa?
            </Text>

            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              Sua avaliação ajuda outros freelancers a entenderem se a empresa é
              confiável e organizada.
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
                Empresa
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {companyName}
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
                ? "Muito boa"
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

            <Text
              style={[
                styles.sectionSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              Selecione pontos sobre a experiência com a empresa.
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Comentário
              </Text>

              <Text
                style={{
                  color:
                    comment.length >= COMMENT_MAX_LENGTH
                      ? "#DC2626"
                      : theme.textSecondary,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {comment.length}/{COMMENT_MAX_LENGTH}
              </Text>
            </View>

            <TextInput
              style={[
                styles.textArea,
                cleanTextAreaStyle,
              ]}
              placeholder="Escreva um comentário sobre sua experiência..."
              placeholderTextColor={theme.textSecondary}
              value={comment}
              onChangeText={handleChangeComment}
              multiline
              textAlignVertical="top"
              maxLength={COMMENT_MAX_LENGTH}
            />

            <Text
              style={{
                color:
                  normalizeComment(comment).length >= COMMENT_MIN_LENGTH
                    ? theme.textSecondary
                    : "#DC2626",
                fontSize: 12,
                fontWeight: "700",
                marginTop: 8,
              }}
            >
              Mínimo de {COMMENT_MIN_LENGTH} caracteres.
            </Text>
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
              Essa etapa complementa a avaliação feita pela empresa. Assim, os
              dois lados constroem reputação dentro do TaskFlow.
            </Text>
          </View>

          <Pressable
            disabled={isSubmitting}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && !isSubmitting && styles.submitButtonPressed,
              isSubmitting && { opacity: 0.55 },
            ]}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={handleGoBackToRequests}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
              Voltar para solicitações
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
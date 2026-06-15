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
import { styles } from "@/app/styles/rateService";
import { useTheme } from "@/app/context/ThemeContext";
import { getLoggedUser } from "@/services/storage";

const API_URL = "http://192.168.1.111:5275";

const ratingTags = [
  "Pontual",
  "Boa comunicação",
  "Profissional",
  "Serviço bem feito",
  "Recomendo",
  "Atencioso",
];

const COMMENT_MIN_LENGTH = 20;
const COMMENT_MAX_LENGTH = 500;
const REVIEWS_STORAGE_KEY = "@taskflow:reviews";

type ReviewPayload = {
  id: string;
  jobId: string;
  candidaturaId: string;
  freelancerId: string;
  contratoId: string;
  jobTitle: string;
  companyName: string;
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

function resolveLoggedUserId(loggedUserData: any) {
  const value = Number(
    loggedUserData?.id ??
      loggedUserData?.usuarioId ??
      loggedUserData?.usuario_id ??
      loggedUserData?.userId ??
      loggedUserData?.user_id
  );

  if (Number.isNaN(value) || value <= 0) {
    return null;
  }

  return value;
}

export default function RateServiceScreen() {
  const params = useLocalSearchParams<{
    jobId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];
    jobTitle?: string | string[];
    candidateName?: string | string[];
    companyName?: string | string[];
    ratedUserName?: string | string[];
    ratedUserType?: string | string[];
    contratoId?: string | string[];
    contrato_id?: string | string[];
    avaliadorId?: string | string[];
    avaliador_id?: string | string[];
    avaliadoId?: string | string[];
    avaliado_id?: string | string[];
  }>();

  const jobId = getParamValue(params.jobId);
  const candidaturaId = getParamValue(params.candidaturaId);
  const freelancerId = getParamValue(params.freelancerId);
  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const candidateName = getParamValue(params.candidateName, "Usuário TaskFlow");
  const companyName = getParamValue(params.companyName, "Empresa");

  const ratedUserName = getParamValue(params.ratedUserName, candidateName);
  const ratedUserType = getParamValue(params.ratedUserType, "freelancer");

  const contratoIdFromParams = getParamNumber(
    params.contratoId ?? params.contrato_id,
    0
  );

  const avaliadorIdFromParams = getParamNumber(
    params.avaliadorId ?? params.avaliador_id,
    0
  );

  const avaliadoIdFromParams = getParamNumber(
    params.avaliadoId ?? params.avaliado_id,
    Number(freelancerId) > 0 ? Number(freelancerId) : 0
  );

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Pontual",
    "Boa comunicação",
  ]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isDark, theme } = useTheme();

  const isRatingFreelancer = ratedUserType === "freelancer";
  const normalizedComment = normalizeComment(comment);
  const isCommentValid = normalizedComment.length >= COMMENT_MIN_LENGTH;
  const canSubmit = rating > 0 && isCommentValid && !isSubmitting;

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
    if (rating <= 0) {
      return "Selecione uma nota para o serviço.";
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
    const currentReviews: ReviewPayload[] = storedReviews
      ? JSON.parse(storedReviews)
      : [];

    const alreadySaved = currentReviews.some((item) => {
      if (review.contratoId && item.contratoId === review.contratoId) {
        return true;
      }

      if (review.jobId && item.jobId === review.jobId) {
        return true;
      }

      if (review.candidaturaId && item.candidaturaId === review.candidaturaId) {
        return true;
      }

      return false;
    });

    const updatedReviews = alreadySaved
      ? currentReviews.map((item) => {
          const sameContrato =
            review.contratoId && item.contratoId === review.contratoId;

          const sameJob = review.jobId && item.jobId === review.jobId;

          const sameCandidatura =
            review.candidaturaId && item.candidaturaId === review.candidaturaId;

          if (sameContrato || sameJob || sameCandidatura) {
            return review;
          }

          return item;
        })
      : [...currentReviews, review];

    await AsyncStorage.setItem(
      REVIEWS_STORAGE_KEY,
      JSON.stringify(updatedReviews)
    );
  }

  async function resolveAvaliadorId() {
    if (avaliadorIdFromParams > 0) {
      return avaliadorIdFromParams;
    }

    const loggedUser = await getLoggedUser();

    if (!loggedUser) {
      return null;
    }

    return resolveLoggedUserId(loggedUser as any);
  }

  function handleGoBack() {
    if (isSubmitting) {
      return;
    }

    if (!normalizedComment && rating === 5) {
      router.back();
      return;
    }

    Alert.alert(
      "Sair sem enviar?",
      "A avaliação ainda não foi enviada. Se você voltar agora, ela não será salva.",
      [
        {
          text: "Continuar avaliando",
          style: "cancel",
        },
        {
          text: "Sair sem enviar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  }

  async function handleSubmitReview() {
    const validationError = getValidationError();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const contratoId = contratoIdFromParams;
      const avaliadorId = await resolveAvaliadorId();
      const avaliadoId = avaliadoIdFromParams;

      if (!contratoId) {
        Alert.alert(
          "Contrato não encontrado",
          "Não foi possível identificar o contrato desse serviço. Volte para o chat ou para o chamado e tente abrir a avaliação novamente."
        );
        return;
      }

      if (!avaliadorId) {
        Alert.alert(
          "Usuário não encontrado",
          "Não foi possível identificar seu usuário logado. Faça login novamente."
        );
        return;
      }

      if (!avaliadoId) {
        Alert.alert(
          "Freelancer não encontrado",
          "Não foi possível identificar quem será avaliado. A tela anterior precisa enviar o avaliadoId ou freelancerId."
        );
        return;
      }

      const payload = {
        contratoId: Number(contratoId),
        avaliadorId: Number(avaliadorId),
        avaliadoId: Number(avaliadoId),
        nota: Number(rating),
        comentario: normalizedComment,
      };

      console.log("ENVIANDO AVALIAÇÃO:", payload);
      console.log("URL:", `${API_URL}/api/Avaliacoes`);

      const response = await fetch(`${API_URL}/api/Avaliacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();

      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      console.log("STATUS:", response.status);
      console.log("RESPOSTA:", data || text);

      if (!response.ok) {
        Alert.alert(
          "Erro ao salvar avaliação",
          data?.mensagem || text || "Erro ao salvar avaliação."
        );
        return;
      }

      const review: ReviewPayload = {
        id: `${Date.now()}-${jobId || "review"}`,
        jobId,
        candidaturaId,
        freelancerId,
        contratoId: String(contratoId),
        jobTitle,
        companyName,
        ratedUserName,
        ratedUserType,
        rating,
        tags: selectedTags,
        comment: normalizedComment,
        createdAt: new Date().toISOString(),
      };

      await saveReview(review);

      console.log("Avaliação salva localmente:", review);

      Alert.alert("Sucesso", "Avaliação enviada com sucesso!", [
        {
          text: "OK",
          onPress: () => router.replace("/company-dashboard"),
        },
      ]);
    } catch (error) {
      console.log("ERRO AO ENVIAR AVALIAÇÃO:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erro de conexão com a API.";

      Alert.alert("Erro ao enviar avaliação", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <ArrowBack
              width={28}
              height={28}
              color={theme.text}
              fill={theme.text}
            />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Avaliar serviço
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
              Como foi a experiência?
            </Text>

            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              {isRatingFreelancer
                ? "Avalie o freelancer para ajudar outras empresas a contratarem com mais segurança."
                : "Avalie a empresa para ajudar outros freelancers a escolherem boas oportunidades."}
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
                {isRatingFreelancer ? "Freelancer" : "Empresa"}
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {ratedUserName}
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

            <Text
              style={[
                styles.sectionSubtitle,
                { color: theme.textSecondary },
              ]}
            >
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
                color: isCommentValid ? theme.textSecondary : "#DC2626",
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
              No TaskFlow, empresas e freelancers podem avaliar uns aos outros
              após a conclusão do serviço.
            </Text>
          </View>

          <Pressable
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && canSubmit && styles.submitButtonPressed,
              !canSubmit && { opacity: 0.55 },
            ]}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Enviando..." : "Enviar avaliação"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
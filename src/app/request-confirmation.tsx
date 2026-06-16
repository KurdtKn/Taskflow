import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import CheckIcon from "../../assets/icons/check.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/requestConfirmation";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiPost } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
import { addTaskFlowNotification } from "@/services/local-notifications";

export default function RequestConfirmationScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
    description?: string | string[];
    company?: string | string[];
    category?: string | string[];
    price?: string | string[];
    location?: string | string[];
    time?: string | string[];
    imageUrl?: string | string[];
    companyId?: string | string[];
    empresaId?: string | string[];
    companyUserId?: string | string[];
  }>();

  const [isSending, setIsSending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isDark, theme } = useTheme();

  const infoIconColor = isDark ? colors.white : colors.black;

  function getParamValue(value?: string | string[], fallback = "") {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }

    return value ?? fallback;
  }

  const chamadoId = getParamValue(params.id);
  const title = getParamValue(params.title, "Chamado disponível");
  const price = getParamValue(params.price, "A combinar");
  const location = getParamValue(params.location, "Local não informado");
  const time = getParamValue(params.time, "Data a combinar");
  const category = getParamValue(params.category, "Categoria");
  const companyId =
    getParamValue(params.companyUserId) ||
    getParamValue(params.companyId) ||
    getParamValue(params.empresaId);
  const companyName = getParamValue(params.company, "Empresa");

  function getUserDisplayName(user: any) {
    return (
      user?.nome ??
      user?.name ??
      user?.nomeCompleto ??
      user?.fullName ??
      user?.email ??
      "Um freelancer"
    );
  }

  function getCreatedCandidaturaId(response: any) {
    const possibleId =
      response?.id ??
      response?.candidaturaId ??
      response?.candidatura_id ??
      response?.candidatura?.id;

    if (possibleId === null || possibleId === undefined || possibleId === "") {
      return "";
    }

    return String(possibleId);
  }

  async function notifyCompanyAboutCandidate(values: {
    freelancerId: string | number;
    freelancerName: string;
    candidaturaId?: string | number;
  }) {
    try {
      await addTaskFlowNotification({
        audience: "company",
        targetUserId: companyId || undefined,
        type: "candidate",
        title: "Novo candidato no chamado",
        description: `${values.freelancerName} se candidatou ao chamado ${title}.`,
        jobId: String(chamadoId),
        chamadoId: String(chamadoId),
        jobTitle: title,
        companyId: companyId || undefined,
        companyName,
        freelancerId: String(values.freelancerId),
        candidateId: String(values.freelancerId),
        candidaturaId: values.candidaturaId ? String(values.candidaturaId) : undefined,
        eventKey: `candidate:${chamadoId}:${values.freelancerId}`,
        params: {
          id: String(chamadoId),
          chamadoId: String(chamadoId),
          jobId: String(chamadoId),
          title,
          category,
          price,
          location,
          time,
          company: companyName,
          companyName,
          candidateId: String(values.freelancerId),
          candidaturaId: values.candidaturaId ? String(values.candidaturaId) : "",
          freelancerId: String(values.freelancerId),
        },
      });
    } catch (notificationError) {
      console.log(
        "Candidatura enviada, mas não foi possível gerar a notificação:",
        notificationError
      );
    }
  }

  async function handleConfirmRequest() {
    if (!chamadoId) {
      Alert.alert(
        "Chamado inválido",
        "Não foi possível identificar o chamado selecionado."
      );
      return;
    }

    try {
      setIsSending(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      if (loggedUser.tipoUsuario !== "freelancer") {
        Alert.alert(
          "Acesso negado",
          "Apenas freelancers podem se candidatar aos chamados."
        );
        return;
      }

      const freelancerId = loggedUser.perfilId ?? loggedUser.id;

      if (!freelancerId) {
        Alert.alert(
          "Perfil não encontrado",
          "Não foi possível identificar seu perfil de freelancer."
        );
        return;
      }

      const response = await apiPost("/api/Candidaturas", {
        chamadoId: Number(chamadoId),
        freelancerId: Number(freelancerId),
      });

      console.log("Candidatura enviada:", response);

      await notifyCompanyAboutCandidate({
        freelancerId,
        freelancerName: String(getUserDisplayName(loggedUser)),
        candidaturaId: getCreatedCandidaturaId(response),
      });

      setIsSubmitted(true);

      Alert.alert(
        "Solicitação enviada",
        "Sua candidatura foi enviada para a empresa."
      );
    } catch (error) {
      console.log("Erro ao enviar candidatura:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível enviar sua candidatura agora.";

      Alert.alert("Erro ao enviar", errorMessage);
    } finally {
      setIsSending(false);
    }
  }

  function handleGoHome() {
    router.replace("/home");
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={isSending}
      >
        <ArrowBack width={28} height={28} color={theme.text} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <CheckIcon
            width={34}
            height={34}
            color={colors.white}
            fill={colors.white}
          />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          {isSubmitted ? "Solicitação enviada!" : "Confirmar candidatura"}
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isSubmitted
            ? "Sua candidatura foi enviada para a empresa. Agora é só aguardar a análise do seu perfil."
            : "Confira os dados do chamado antes de enviar sua candidatura para a empresa."}
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.primary }]}>
            Chamado selecionado
          </Text>

          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {title}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <WalletIcon
                width={18}
                height={18}
                color={infoIconColor}
                fill={infoIconColor}
              />
            </View>

            <Text style={[styles.infoText, { color: theme.text }]}>
              {price}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LocationIcon
                width={18}
                height={18}
                color={infoIconColor}
                fill={infoIconColor}
              />
            </View>

            <Text style={[styles.infoText, { color: theme.text }]}>
              {location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <TimeIcon
                width={18}
                height={18}
                color={infoIconColor}
                fill={infoIconColor}
              />
            </View>

            <Text style={[styles.infoText, { color: theme.text }]}>
              {time}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            O chat será liberado somente após a empresa aceitar sua solicitação
            e confirmar o fluxo do chamado.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { backgroundColor: theme.background },
        ]}
      >
        {!isSubmitted ? (
          <Pressable
            disabled={isSending}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
              isSending && { opacity: 0.7 },
            ]}
            onPress={handleConfirmRequest}
          >
            <Text style={styles.primaryButtonText}>
              {isSending ? "Enviando..." : "Confirmar candidatura"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleGoHome}
          >
            <Text style={styles.primaryButtonText}>Voltar para início</Text>
          </Pressable>
        )}

        <Pressable
          disabled={isSending}
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.buttonPressed,
            isSending && { opacity: 0.7 },
          ]}
          onPress={() => router.push("/notifications")}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Ver notificações
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
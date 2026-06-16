import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import CheckIcon from "../../assets/icons/check.svg";

import { styles } from "@/app/styles/serviceCompletion";
import { useTheme } from "@/app/context/ThemeContext";
import { apiPost } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
import { addTaskFlowNotification } from "@/services/local-notifications";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
};

const checklistItems: ChecklistItem[] = [
  {
    id: "1",
    title: "Serviço realizado",
    description: "O freelancer compareceu e executou o serviço combinado.",
  },
  {
    id: "2",
    title: "Detalhes alinhados",
    description: "As informações finais foram combinadas pelo chat.",
  },
  {
    id: "3",
    title: "Tudo certo com a entrega",
    description: "A empresa confirma que o serviço foi concluído.",
  },
];


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

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}


function normalizePaymentMethodLabel(value?: string) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  const normalized = rawValue
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalized.includes("pix")) {
    return "PIX";
  }

  if (
    normalized.includes("credito") ||
    normalized === "card" ||
    normalized === "credit_card" ||
    normalized === "creditcard" ||
    normalized === "cartao_credito"
  ) {
    return "Cartão de crédito";
  }

  if (
    normalized.includes("debito") ||
    normalized === "debit_card" ||
    normalized === "debitcard" ||
    normalized === "cartao_debito"
  ) {
    return "Cartão de débito";
  }

  if (
    normalized.includes("saldo") ||
    normalized.includes("carteira") ||
    normalized === "wallet" ||
    normalized === "balance"
  ) {
    return "Saldo na conta";
  }

  return rawValue;
}

async function saveLocalPaymentMethod(ids: {
  contratoId?: string;
  jobId?: string;
  candidaturaId?: string;
  paymentMethod?: string;
}) {
  const methodLabel = normalizePaymentMethodLabel(ids.paymentMethod);

  if (!methodLabel) {
    return;
  }

  const rawIds = [ids.contratoId, ids.jobId, ids.candidaturaId].filter(
    (value): value is string => Boolean(value && String(value).trim())
  );

  const entries = rawIds.flatMap((id) => [
    [`taskflow_payment_method_${id}`, methodLabel] as [string, string],
    [`payment_method_${id}`, methodLabel] as [string, string],
  ]);

  if (entries.length === 0) {
    return;
  }

  await AsyncStorage.multiSet(entries);
}

export default function ServiceCompletionScreen() {
  const params = useLocalSearchParams<{
    contratoId?: string | string[];

    jobId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];
    candidateUserId?: string | string[];
    freelancerUserId?: string | string[];
    usuarioId?: string | string[];

    jobTitle?: string | string[];
    jobCategory?: string | string[];
    jobPrice?: string | string[];
    jobLocation?: string | string[];
    jobTime?: string | string[];
    status?: string | string[];

    candidateName?: string | string[];
    candidateEmail?: string | string[];
    candidateRating?: string | string[];

    companyName?: string | string[];

    serviceValue?: string | string[];
    candidatePrice?: string | string[];
    platformFee?: string | string[];
    totalValue?: string | string[];
    paymentMethod?: string | string[];
  }>();

  const contratoId = getParamValue(params.contratoId);

  const jobId = getParamValue(params.jobId);
  const candidaturaId = getParamValue(params.candidaturaId);
  const freelancerId = getParamValue(params.freelancerId);
  const candidateUserId =
    getParamValue(params.candidateUserId) ||
    getParamValue(params.freelancerUserId) ||
    getParamValue(params.usuarioId) ||
    freelancerId;

  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const jobCategory = getParamValue(params.jobCategory);
  const jobPrice = getParamValue(params.jobPrice);
  const jobLocation = getParamValue(params.jobLocation);
  const jobTime = getParamValue(params.jobTime);
  const status = getParamValue(params.status);

  const candidateName = getParamValue(
    params.candidateName,
    "Usuário TaskFlow"
  );
  const candidateEmail = getParamValue(params.candidateEmail);
  const candidateRating = getParamValue(params.candidateRating);

  const companyName = getParamValue(params.companyName, "Empresa");

  const serviceValue = getParamValue(params.serviceValue);
  const candidatePrice = getParamValue(params.candidatePrice);
  const platformFee = getParamValue(params.platformFee);
  const totalValue = getParamValue(params.totalValue);
  const paymentMethod = getParamValue(params.paymentMethod);

  const [checkedItems, setCheckedItems] = useState<string[]>(["1", "2", "3"]);
  const [isFinishing, setIsFinishing] = useState(false);

  const { isDark, theme } = useTheme();

  const allItemsChecked = checkedItems.length === checklistItems.length;

  function toggleChecklistItem(itemId: string) {
    setCheckedItems((currentItems) => {
      if (currentItems.includes(itemId)) {
        return currentItems.filter((id) => id !== itemId);
      }

      return [...currentItems, itemId];
    });
  }

  async function handleConfirmCompletion() {
    if (!allItemsChecked) {
      Alert.alert(
        "Checklist incompleto",
        "Confirme todos os itens antes de avançar."
      );
      return;
    }

    if (!contratoId) {
      Alert.alert(
        "Contrato não encontrado",
        "A tela de conclusão não recebeu o contratoId. Volte para o chat e tente finalizar novamente."
      );
      return;
    }

    if (!freelancerId) {
      Alert.alert(
        "Freelancer não encontrado",
        "Não foi possível identificar o freelancer para avaliação."
      );
      return;
    }

    try {
      setIsFinishing(true);

      const loggedUser = await getLoggedUser();
      const avaliadorId = resolveLoggedUserId(loggedUser as any);

      if (!avaliadorId) {
        Alert.alert(
          "Usuário não encontrado",
          "Não foi possível identificar a empresa logada para enviar a avaliação. Faça login novamente."
        );
        return;
      }

      console.log("Finalizando contrato antes da avaliação:", {
        contratoId,
        jobId,
        candidaturaId,
        freelancerId,
        avaliadorId,
      });

      await saveLocalPaymentMethod({
        contratoId,
        jobId,
        candidaturaId,
        paymentMethod,
      });

      try {
        await apiPost(`/api/Contratos/${contratoId}/finalizar`, {});
      } catch (error) {
        console.log(
          "Não foi possível finalizar contrato pela API. Seguindo para avaliação:",
          error
        );
      }

      await addTaskFlowNotification({
        audience: "freelancer",
        targetUserId: candidateUserId,
        type: "service",
        title: "Serviço concluído",
        description: `A empresa marcou ${jobTitle} como concluído. Faça sua avaliação.`,
        jobId,
        chamadoId: jobId,
        candidaturaId,
        freelancerId,
        contratoId,
        contractId: contratoId,
        jobTitle,
        companyName,
        params: {
          contratoId,
          jobId,
          candidaturaId,
          freelancerId,
          candidateUserId,
          jobTitle,
          companyName,
        },
        eventKey: `service-completed:${contratoId}`,
      });

      router.push({
        pathname: "/rate-service",
        params: {
          contratoId,

          avaliadorId: String(avaliadorId),
          avaliadoId: freelancerId,

          jobId,
          candidaturaId,
          freelancerId,
          candidateUserId,
          freelancerUserId: candidateUserId,
          usuarioId: candidateUserId,

          jobTitle,
          jobCategory,
          jobPrice,
          jobLocation,
          jobTime,
          status,

          candidateName,
          candidateEmail,
          candidateRating,

          companyName,

          serviceValue,
          candidatePrice,
          platformFee,
          totalValue,
          paymentMethod,

          ratedUserName: candidateName,
          ratedUserType: "freelancer",
        },
      });
    } catch (error) {
      console.log("Erro ao confirmar conclusão:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível avançar para a avaliação agora.";

      Alert.alert("Erro", errorMessage);
    } finally {
      setIsFinishing(false);
    }
  }

  function handleBackToDashboard() {
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

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBackToDashboard}>
          <ArrowBack
            width={28}
            height={28}
            color={theme.text}
            fill={theme.text}
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Conclusão do serviço
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
            <CheckIcon width={34} height={34} />
          </View>

          <Text style={[styles.introTitle, { color: theme.text }]}>
            Serviço finalizado!
          </Text>

          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            O chamado foi encerrado com sucesso. Confirme os itens abaixo para
            avançar para a etapa final.
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
            Chamado finalizado
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

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Empresa
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {companyName}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Status
            </Text>

            <Text style={styles.statusValue}>Concluído</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Checklist de finalização
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Confirme os itens para registrar que está tudo certo.
          </Text>

          <View style={styles.checklistArea}>
            {checklistItems.map((item) => {
              const isChecked = checkedItems.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.checkItem,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    isChecked && styles.checkItemActive,
                  ]}
                  onPress={() => toggleChecklistItem(item.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: theme.border },
                      isChecked && styles.checkboxActive,
                    ]}
                  >
                    {isChecked && <CheckIcon width={16} height={16} />}
                  </View>

                  <View style={styles.checkTextArea}>
                    <Text style={[styles.checkTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.checkDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
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
          <Text style={[styles.warningTitle, { color: theme.text }]}>
            Próxima etapa
          </Text>

          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            Após confirmar a conclusão, você poderá registrar a avaliação do
            freelancer.
          </Text>
        </View>

        <Pressable
          disabled={!allItemsChecked || isFinishing}
          style={({ pressed }) => [
            styles.confirmButton,
            (!allItemsChecked || isFinishing) && styles.confirmButtonDisabled,
            pressed &&
              allItemsChecked &&
              !isFinishing &&
              styles.confirmButtonPressed,
          ]}
          onPress={handleConfirmCompletion}
        >
          <Text style={styles.confirmButtonText}>
            {isFinishing ? "Finalizando..." : "Finalizar e continuar"}
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
          onPress={handleBackToDashboard}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar ao dashboard
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
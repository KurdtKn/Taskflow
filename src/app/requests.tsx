import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/requests";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

type RequestStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "refused"
  | "completed";

type FilterStatus = "all" | RequestStatus;

type RequestItem = {
  id: string;
  jobId: string;
  chatId?: string;
  contratoId?: string;
  companyUserId?: string;
  title: string;
  company: string;
  category: string;
  price: string;
  location: string;
  time: string;
  status: RequestStatus;
  createdAt: string;
};

type ReviewPayload = {
  id?: string;
  jobId?: string;
  requestId?: string;
  ratedUserType?: string;
};

type CandidaturaApi = {
  id: number;

  chamadoId?: number | string | null;
  chamado_id?: number | string | null;
  jobId?: number | string | null;

  contratoId?: number | string | null;
  contrato_id?: number | string | null;
  contrato?: {
    id?: number | string | null;
  } | null;

  empresaUsuarioId?: number | string | null;
  empresa_usuario_id?: number | string | null;
  companyUserId?: number | string | null;
  usuarioEmpresaId?: number | string | null;
  usuario_empresa_id?: number | string | null;

  chamado?: string | null;
  titulo?: string | null;
  title?: string | null;

  empresa?: string | null;
  company?: string | null;

  categoria?: string | null;
  category?: string | null;

  cidade?: string | null;
  estado?: string | null;
  localServico?: string | null;
  local_servico?: string | null;

  valorEstimado?: number | string | null;
  valor_estimado?: number | string | null;
  valorProposto?: number | string | null;
  valor_proposto?: number | string | null;

  dataServico?: string | null;
  data_servico?: string | null;
  horaServico?: string | null;
  hora_servico?: string | null;

  status?: string | null;
  chamadoStatus?: string | null;
  chamado_status?: string | null;

  dataCandidatura?: string | null;
  data_candidatura?: string | null;
};

type CandidaturasResponse =
  | CandidaturaApi[]
  | {
      data?: CandidaturaApi[];
      dados?: CandidaturaApi[];
      candidaturas?: CandidaturaApi[];
    };

const REVIEWS_STORAGE_KEY = "@taskflow:reviews";

const statusConfig = {
  pending: {
    label: "Aguardando resposta",
    backgroundColor: "rgba(245,158,11,0.12)",
    textColor: colors.warning,
  },
  accepted: {
    label: "Aceita",
    backgroundColor: "rgba(0,176,80,0.12)",
    textColor: colors.success,
  },
  in_progress: {
    label: "Em andamento",
    backgroundColor: "rgba(11,87,208,0.1)",
    textColor: colors.primary,
  },
  refused: {
    label: "Recusada",
    backgroundColor: "rgba(220,38,38,0.1)",
    textColor: colors.danger,
  },
  completed: {
    label: "Concluída",
    backgroundColor: "rgba(11,87,208,0.1)",
    textColor: colors.primary,
  },
};

function getCandidaturasFromResponse(response: CandidaturasResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.candidaturas ?? [];
}

function resolveLoggedUserId(loggedUserData: any) {
  const value = Number(
    loggedUserData?.id ??
      loggedUserData?.usuario?.id ??
      loggedUserData?.user?.id ??
      loggedUserData?.usuarioId ??
      loggedUserData?.usuario_id ??
      loggedUserData?.userId ??
      loggedUserData?.user_id
  );

  if (Number.isNaN(value) || value <= 0) {
    return "";
  }

  return String(value);
}

function parseNumberValue(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? fallback : value;
  }

  const text = String(value)
    .replace("R$", "")
    .replace(/\s/g, "")
    .trim();

  if (!text) {
    return fallback;
  }

  let normalized = text;

  if (text.includes(",") && text.includes(".")) {
    normalized = text.replace(/\./g, "").replace(",", ".");
  } else if (text.includes(",")) {
    normalized = text.replace(",", ".");
  }

  const parsedValue = Number(normalized);

  if (Number.isNaN(parsedValue) || !Number.isFinite(parsedValue)) {
    return fallback;
  }

  return parsedValue;
}

function normalizeStatus(value?: string | null) {
  return value?.toLowerCase().trim() ?? "";
}

function getRequestStatus(
  candidaturaStatus?: string | null,
  chamadoStatus?: string | null
): RequestStatus {
  const normalizedCandidaturaStatus = normalizeStatus(candidaturaStatus);
  const normalizedChamadoStatus = normalizeStatus(chamadoStatus);

  if (
    normalizedChamadoStatus === "finalizado" ||
    normalizedChamadoStatus === "finished" ||
    normalizedChamadoStatus === "concluido" ||
    normalizedChamadoStatus === "concluído"
  ) {
    return "completed";
  }

  if (
    normalizedCandidaturaStatus === "recusada" ||
    normalizedCandidaturaStatus === "recusado" ||
    normalizedCandidaturaStatus === "rejected"
  ) {
    return "refused";
  }

  if (
    normalizedCandidaturaStatus === "aceita" ||
    normalizedCandidaturaStatus === "aceito" ||
    normalizedCandidaturaStatus === "accepted"
  ) {
    if (
      normalizedChamadoStatus === "em_andamento" ||
      normalizedChamadoStatus === "em andamento" ||
      normalizedChamadoStatus === "andamento" ||
      normalizedChamadoStatus === "in_progress"
    ) {
      return "in_progress";
    }

    return "accepted";
  }

  return "pending";
}

function formatCurrency(value?: number | string | null) {
  const parsedValue = parseNumberValue(value, 0);

  if (!parsedValue || parsedValue <= 0) {
    return "";
  }

  return parsedValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getRequestPrice(
  valorProposto?: number | string | null,
  valorEstimado?: number | string | null
) {
  const proposedValue = parseNumberValue(valorProposto, 0);

  if (proposedValue > 0) {
    return formatCurrency(proposedValue);
  }

  const estimatedValue = parseNumberValue(valorEstimado, 0);

  if (estimatedValue > 0) {
    return formatCurrency(estimatedValue);
  }

  return "Valor não informado";
}

function formatDate(value?: string | null) {
  if (!value) {
    return "";
  }

  const dateOnly = value.split("T")[0].split(" ")[0];
  const [year, month, day] = dateOnly.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function formatHour(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 5);
}

function formatDateTime(date?: string | null, hour?: string | null) {
  const formattedDate = formatDate(date);
  const formattedHour = formatHour(hour);

  if (formattedDate && formattedHour) {
    return `${formattedDate}, ${formattedHour}`;
  }

  if (formattedDate) {
    return formattedDate;
  }

  if (formattedHour) {
    return formattedHour;
  }

  return "Data a combinar";
}

function formatCreatedAt(value?: string | null) {
  const formattedDate = formatDate(value);

  if (!formattedDate) {
    return "Solicitação enviada";
  }

  return `Solicitado em ${formattedDate}`;
}

function formatLocation(candidatura: CandidaturaApi) {
  const local = candidatura.localServico ?? candidatura.local_servico;
  const city = candidatura.cidade;
  const state = candidatura.estado;

  if (local) {
    return local;
  }

  if (city && state) {
    return `${city} - ${state}`;
  }

  if (city) {
    return city;
  }

  return "Local não informado";
}

function mapCandidaturaToRequest(candidatura: CandidaturaApi): RequestItem {
  const jobId =
    candidatura.chamadoId ??
    candidatura.chamado_id ??
    candidatura.jobId ??
    "";

  const contratoId =
    candidatura.contratoId ??
    candidatura.contrato_id ??
    candidatura.contrato?.id ??
    "";

  const companyUserId =
    candidatura.empresaUsuarioId ??
    candidatura.empresa_usuario_id ??
    candidatura.companyUserId ??
    candidatura.usuarioEmpresaId ??
    candidatura.usuario_empresa_id ??
    "";

  const chamadoStatus =
    candidatura.chamadoStatus ?? candidatura.chamado_status ?? "";

  const valorProposto =
    candidatura.valorProposto ?? candidatura.valor_proposto;

  const valorEstimado =
    candidatura.valorEstimado ?? candidatura.valor_estimado;

  const dataServico =
    candidatura.dataServico ?? candidatura.data_servico;

  const horaServico =
    candidatura.horaServico ?? candidatura.hora_servico;

  const dataCandidatura =
    candidatura.dataCandidatura ?? candidatura.data_candidatura;

  return {
    id: String(candidatura.id),
    jobId: String(jobId),
    chatId: String(jobId),
    contratoId: contratoId ? String(contratoId) : "",
    companyUserId: companyUserId ? String(companyUserId) : "",
    title:
      candidatura.chamado ??
      candidatura.titulo ??
      candidatura.title ??
      "Chamado não informado",
    company:
      candidatura.empresa ??
      candidatura.company ??
      "Empresa não informada",
    category:
      candidatura.categoria ??
      candidatura.category ??
      "Categoria",
    price: getRequestPrice(valorProposto, valorEstimado),
    location: formatLocation(candidatura),
    time: formatDateTime(dataServico, horaServico),
    status: getRequestStatus(candidatura.status, chamadoStatus),
    createdAt: formatCreatedAt(dataCandidatura),
  };
}

export default function RequestsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [reviewedCompanyKeys, setReviewedCompanyKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();
  const emptyIconColor = isDark ? colors.white : colors.black;
  const iconColor = isDark ? colors.white : colors.black;

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  async function loadReviewedCompanyKeys() {
    try {
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews: ReviewPayload[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      const keys: string[] = [];

      reviews.forEach((review) => {
        if (review.ratedUserType !== "company") {
          return;
        }

        if (review.jobId) {
          keys.push(`job:${review.jobId}`);
        }

        if (review.requestId) {
          keys.push(`request:${review.requestId}`);
        }
      });

      setReviewedCompanyKeys([...new Set(keys)]);
    } catch (error) {
      console.log("Erro ao carregar avaliações salvas:", error);
      setReviewedCompanyKeys([]);
    }
  }

  async function loadRequests() {
    try {
      setIsLoading(true);

      await loadReviewedCompanyKeys();

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      const freelancerId = Number(loggedUser.perfilId || loggedUser.id);

      if (!freelancerId) {
        setRequests([]);
        return;
      }

      const response = await apiGet<CandidaturasResponse>(
        `/api/Candidaturas/freelancer/${freelancerId}`
      );

      const candidaturas = getCandidaturasFromResponse(response);

      console.log("Candidaturas do freelancer:", candidaturas);

      const mappedRequests = candidaturas.map(mapCandidaturaToRequest);

      console.log("Solicitações mapeadas:", mappedRequests);

      setRequests(mappedRequests);
    } catch (error) {
      console.log("Erro ao carregar solicitações:", error);
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredRequests = useMemo(() => {
    if (selectedFilter === "all") {
      return requests;
    }

    return requests.filter((request) => request.status === selectedFilter);
  }, [requests, selectedFilter]);

  function hasCompanyReview(request: RequestItem) {
    return (
      reviewedCompanyKeys.includes(`job:${request.jobId}`) ||
      reviewedCompanyKeys.includes(`request:${request.id}`)
    );
  }

  function canOpenChat(status: RequestStatus) {
    return status === "accepted" || status === "in_progress";
  }

  function handleOpenChat(request: RequestItem) {
    router.push({
      pathname: "/freelancer-chat",
      params: {
        requestId: request.id,
        jobId: request.jobId,
        chatId: request.chatId ?? request.jobId,
        contratoId: request.contratoId ?? "",
        jobTitle: request.title,
        companyName: request.company,
        userType: "freelancer",
      },
    });
  }

  function handleDetails(request: RequestItem) {
    router.push({
      pathname: "/job-details",
      params: {
        id: request.jobId,
        title: request.title,
        category: request.category,
        price: request.price,
        distance: "Próximo",
        location: request.location,
        time: request.time,
      },
    });
  }

  function handleOpenRequest(request: RequestItem) {
    if (canOpenChat(request.status)) {
      handleOpenChat(request);
      return;
    }

    handleDetails(request);
  }

  async function handleRateCompany(request: RequestItem) {
    const loggedUser = await getLoggedUser();
    const avaliadorId = resolveLoggedUserId(loggedUser as any);

    console.log("Abrindo avaliação da empresa:", {
      request,
      avaliadorId,
      companyUserId: request.companyUserId,
      contratoId: request.contratoId,
    });

    router.push({
      pathname: "/rate-company",
      params: {
        requestId: request.id,
        candidaturaId: request.id,
        jobId: request.jobId,
        jobTitle: request.title,
        companyName: request.company,

        contratoId: request.contratoId ?? "",
        avaliadorId,

        avaliadoId: request.companyUserId ?? "",
        companyUserId: request.companyUserId ?? "",
        empresaUsuarioId: request.companyUserId ?? "",
      },
    });
  }

  function getActionText(status: RequestStatus) {
    if (status === "accepted" || status === "in_progress") {
      return "Abrir chat ›";
    }

    return "Ver detalhes ›";
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack
            width={28}
            height={28}
            color={theme.text}
            fill={theme.text}
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Minhas solicitações
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            Acompanhe seus chamados
          </Text>

          <Text style={[styles.summarySubtitle, { color: theme.textSecondary }]}>
            Veja o status das suas candidaturas.
          </Text>
        </View>

        <View style={styles.summaryNumberBox}>
          <Text style={styles.summaryNumber}>{requests.length}</Text>
        </View>
      </View>

      <View style={styles.filtersArea}>
        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            selectedFilter === "all" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            selectedFilter === "pending" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "pending" && styles.filterTextActive,
            ]}
          >
            Aguardando
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            selectedFilter === "accepted" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("accepted")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "accepted" && styles.filterTextActive,
            ]}
          >
            Aceitas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            selectedFilter === "in_progress" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("in_progress")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "in_progress" && styles.filterTextActive,
            ]}
          >
            Em andamento
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            selectedFilter === "refused" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("refused")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "refused" && styles.filterTextActive,
            ]}
          >
            Recusadas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            selectedFilter === "completed" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "completed" && styles.filterTextActive,
            ]}
          >
            Concluídas
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View
            style={[
              styles.emptyArea,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <AssignmentIcon
              width={34}
              height={34}
              color={emptyIconColor}
              fill={emptyIconColor}
            />

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Carregando solicitações...
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Buscando suas candidaturas.
            </Text>
          </View>
        ) : filteredRequests.length === 0 ? (
          <View
            style={[
              styles.emptyArea,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <AssignmentIcon
              width={34}
              height={34}
              color={emptyIconColor}
              fill={emptyIconColor}
            />

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nenhuma solicitação
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Quando você se candidatar a um chamado, ele aparecerá aqui.
            </Text>
          </View>
        ) : (
          filteredRequests.map((request) => {
            const currentStatus = statusConfig[request.status];
            const companyAlreadyReviewed = hasCompanyReview(request);

            return (
              <Pressable
                key={request.id}
                style={({ pressed }) => [
                  styles.requestCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  pressed && styles.requestCardPressed,
                ]}
                onPress={() => handleOpenRequest(request)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleArea}>
                    <Text style={[styles.requestTitle, { color: theme.text }]}>
                      {request.title}
                    </Text>

                    <Text
                      style={[
                        styles.companyName,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {request.company}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: currentStatus.backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: currentStatus.textColor },
                      ]}
                    >
                      {currentStatus.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoArea}>
                  <View style={styles.infoRow}>
                    <WalletIcon
                      width={16}
                      height={16}
                      color={iconColor}
                      fill={iconColor}
                    />

                    <Text style={[styles.infoText, { color: theme.text }]}>
                      {request.price}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <LocationIcon
                      width={16}
                      height={16}
                      color={iconColor}
                      fill={iconColor}
                    />

                    <Text style={[styles.infoText, { color: theme.text }]}>
                      {request.location}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <TimeIcon
                      width={16}
                      height={16}
                      color={iconColor}
                      fill={iconColor}
                    />

                    <Text style={[styles.infoText, { color: theme.text }]}>
                      {request.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text
                    style={[
                      styles.createdAt,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {request.createdAt}
                  </Text>

                  <Text style={styles.detailsText}>
                    {getActionText(request.status)}
                  </Text>
                </View>

                {request.status === "completed" && (
                  <Pressable
                    disabled={companyAlreadyReviewed}
                    style={({ pressed }) => [
                      styles.rateCompanyButton,
                      companyAlreadyReviewed && { opacity: 0.55 },
                      pressed &&
                        !companyAlreadyReviewed &&
                        styles.rateCompanyButtonPressed,
                    ]}
                    onPress={() => handleRateCompany(request)}
                  >
                    <Text style={styles.rateCompanyButtonText}>
                      {companyAlreadyReviewed
                        ? "Avaliação enviada"
                        : "Avaliar empresa"}
                    </Text>
                  </Pressable>
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
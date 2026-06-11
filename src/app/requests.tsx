import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/requests";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

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
  title: string;
  company: string;
  category: string;
  price: string;
  location: string;
  time: string;
  status: RequestStatus;
  createdAt: string;
};

const statusConfig = {
  pending: {
    label: "Pendente",
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

export default function RequestsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("all");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();
  const emptyIconColor = isDark ? colors.white : colors.black;

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a busca na API.

        Exemplo:
        const response = await requestsService.getMyRequests();
        setRequests(response);

        A API deve retornar somente as solicitações do freelancer logado.
        O usuário será identificado pelo token salvo depois do login.

        Formato esperado:
        [
          {
            id: "1",
            jobId: "10",
            chatId: "5",
            title: "Garçom para Evento",
            company: "TaskFlow Eventos",
            category: "Eventos",
            price: "R$200,00",
            location: "Centro",
            time: "Hoje, 18:00",
            status: "accepted",
            createdAt: "Solicitado hoje"
          }
        ]

        Status que a tela aceita:
        pending      -> abre detalhes
        accepted     -> abre chat
        in_progress  -> abre chat
        refused      -> abre detalhes
        completed    -> abre detalhes e mostra botão "Avaliar empresa"
      */

      setRequests([]);
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

  function canOpenChat(status: RequestStatus) {
    return status === "accepted" || status === "in_progress";
  }

  function handleOpenChat(request: RequestItem) {
    router.push({
      pathname: "/freelancer-chat",
      params: {
        requestId: request.id,
        jobId: request.jobId,
        chatId: request.chatId ?? "",
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

  function handleRateCompany(request: RequestItem) {
    router.push({
      pathname: "/rate-company",
      params: {
        requestId: request.id,
        jobId: request.jobId,
        jobTitle: request.title,
        companyName: request.company,
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
          <ArrowBack width={28} height={28} />
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
            Pendentes
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
              width={38}
              height={38}
              color={emptyIconColor}
              fill={emptyIconColor}
              stroke={emptyIconColor}
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
              width={38}
              height={38}
              color={emptyIconColor}
              fill={emptyIconColor}
              stroke={emptyIconColor}
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
                    <WalletIcon width={16} height={16} />

                    <Text style={[styles.infoText, { color: theme.text }]}>
                      {request.price}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <LocationIcon
                      width={16}
                      height={16}
                      color={colors.location}
                    />

                    <Text style={[styles.infoText, { color: theme.text }]}>
                      {request.location}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <TimeIcon width={16} height={16} />

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
                    style={({ pressed }) => [
                      styles.rateCompanyButton,
                      pressed && styles.rateCompanyButtonPressed,
                    ]}
                    onPress={() => handleRateCompany(request)}
                  >
                    <Text style={styles.rateCompanyButtonText}>
                      Avaliar empresa
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
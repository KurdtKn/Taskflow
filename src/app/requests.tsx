import { useMemo, useState } from "react";
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

type RequestStatus = "pending" | "accepted" | "refused" | "completed";

type FilterStatus = "all" | RequestStatus;

type RequestItem = {
  id: string;
  title: string;
  company: string;
  category: string;
  price: string;
  location: string;
  time: string;
  status: RequestStatus;
  createdAt: string;
};

const requestsData: RequestItem[] = [
  {
    id: "1",
    title: "Garçom para Evento",
    company: "TaskFlow Eventos",
    category: "Eventos",
    price: "R$200,00",
    location: "Centro",
    time: "Hoje, 18:00",
    status: "pending",
    createdAt: "Enviada há 10 min",
  },
  {
    id: "2",
    title: "Fotógrafo Profissional",
    company: "Studio Prime",
    category: "Fotografia",
    price: "R$300,00",
    location: "Moema",
    time: "Sábado, 14:00",
    status: "accepted",
    createdAt: "Aceita há 35 min",
  },
  {
    id: "3",
    title: "Reparo Hidráulico",
    company: "Residencial Jardim",
    category: "Manutenção",
    price: "R$150,00",
    location: "Jardim Paulista",
    time: "Amanhã, 09:00",
    status: "refused",
    createdAt: "Recusada ontem",
  },
  {
    id: "4",
    title: "Apoio em Limpeza",
    company: "Empresa Alpha",
    category: "Serviços gerais",
    price: "R$120,00",
    location: "Vila Olímpia",
    time: "Concluído",
    status: "completed",
    createdAt: "Concluída há 2 dias",
  },
];

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

  const filteredRequests = useMemo(() => {
    if (selectedFilter === "all") {
      return requestsData;
    }

    return requestsData.filter((request) => request.status === selectedFilter);
  }, [selectedFilter]);

  function handleDetails(request: RequestItem) {
    router.push({
      pathname: "/job-details",
      params: {
        title: request.title,
        category: request.category,
        price: request.price,
        distance: "Próximo",
        location: request.location,
        time: request.time,
      },
    });
  }

  function handleRateCompany(request: RequestItem) {
    router.push({
      pathname: "/rate-company",
      params: {
        jobTitle: request.title,
        companyName: request.company,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Minhas solicitações</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryTitle}>Acompanhe seus chamados</Text>
          <Text style={styles.summarySubtitle}>
            Veja o status das suas candidaturas.
          </Text>
        </View>

        <View style={styles.summaryNumberBox}>
          <Text style={styles.summaryNumber}>{requestsData.length}</Text>
        </View>
      </View>

      <View style={styles.filtersArea}>
        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === "all" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "all" && styles.filterTextActive,
            ]}
          >
            Todas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === "pending" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "pending" && styles.filterTextActive,
            ]}
          >
            Pendentes
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === "accepted" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("accepted")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "accepted" && styles.filterTextActive,
            ]}
          >
            Aceitas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === "completed" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
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
        {filteredRequests.length === 0 ? (
          <View style={styles.emptyArea}>
            <AssignmentIcon width={38} height={38} />

            <Text style={styles.emptyTitle}>Nenhuma solicitação</Text>

            <Text style={styles.emptyText}>
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
                  pressed && styles.requestCardPressed,
                ]}
                onPress={() => handleDetails(request)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleArea}>
                    <Text style={styles.requestTitle}>{request.title}</Text>
                    <Text style={styles.companyName}>{request.company}</Text>
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
                    <Text style={styles.infoText}>{request.price}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <LocationIcon width={16} height={16} />
                    <Text style={styles.infoText}>{request.location}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <TimeIcon width={16} height={16} />
                    <Text style={styles.infoText}>{request.time}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.createdAt}>{request.createdAt}</Text>

                  <Text style={styles.detailsText}>Ver detalhes ›</Text>
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
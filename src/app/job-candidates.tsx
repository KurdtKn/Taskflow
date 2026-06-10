import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/jobCandidates";
import { useTheme } from "@/app/context/ThemeContext";
import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

type Candidate = {
  id: string;
  freelancerId?: string;
  name: string;
  email?: string;
  role: string;
  rating: number | null;
  reviews: number;
  distance: string;
  completedJobs: number;
  price: string;
  description: string;
  skills: string[];
  status: string;
};

type CandidaturaApi = {
  id: number;
  freelancerId?: number | null;
  freelancer_id?: number | null;
  freelancer?: string | null;
  nome?: string | null;
  email?: string | null;
  mensagem?: string | null;
  valorProposto?: number | null;
  valor_proposto?: number | null;
  status?: string | null;
  dataCandidatura?: string | null;
};

type CandidaturasResponse =
  | CandidaturaApi[]
  | {
      data?: CandidaturaApi[];
      dados?: CandidaturaApi[];
      candidaturas?: CandidaturaApi[];
    };

function getCandidaturasFromResponse(response: CandidaturasResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.candidaturas ?? [];
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined || value === 0) {
    return "Valor a combinar";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function getCandidateStatusLabel(status?: string | null) {
  const normalizedStatus = status?.toLowerCase().trim();

  if (normalizedStatus === "aceita") {
    return "Aceita";
  }

  if (normalizedStatus === "recusada") {
    return "Recusada";
  }

  if (normalizedStatus === "cancelada") {
    return "Cancelada";
  }

  return "Pendente";
}

function formatCandidate(
  apiCandidate: CandidaturaApi,
  jobCategory: string
): Candidate {
  const valorProposto =
    apiCandidate.valorProposto ?? apiCandidate.valor_proposto ?? null;

  const freelancerId =
    apiCandidate.freelancerId ?? apiCandidate.freelancer_id ?? null;

  const candidateName =
    apiCandidate.freelancer ||
    apiCandidate.nome ||
    "Freelancer não informado";

  const statusLabel = getCandidateStatusLabel(apiCandidate.status);

  return {
    id: String(apiCandidate.id),
    freelancerId: freelancerId ? String(freelancerId) : undefined,
    name: candidateName,
    email: apiCandidate.email ?? undefined,
    role: apiCandidate.email ? apiCandidate.email : "Freelancer",
    rating: null,
    reviews: 0,
    distance: "Não informado",
    completedJobs: 0,
    price: formatCurrency(valorProposto),
    description:
      apiCandidate.mensagem ||
      "O freelancer ainda não enviou uma mensagem para essa candidatura.",
    skills: [jobCategory, `Status: ${statusLabel}`],
    status: statusLabel,
  };
}

export default function JobCandidatesScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    chamadoId?: string;
    title?: string;
    category?: string;
    price?: string;
    location?: string;
    time?: string;
    candidates?: string;
  }>();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  const jobId = params.id ?? params.chamadoId ?? "";
  const jobTitle = params.title ?? "Chamado";
  const jobCategory = params.category ?? "Categoria";
  const jobPrice = params.price ?? "Valor a combinar";
  const jobLocation = params.location ?? "Local não informado";
  const jobTime = params.time ?? "Data não informada";

  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === selectedCandidateId
  );

  useFocusEffect(
    useCallback(() => {
      loadCandidates();
    }, [jobId])
  );

  async function loadCandidates() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      if (!jobId) {
        setCandidates([]);
        setSelectedCandidateId("");

        Alert.alert(
          "Chamado não encontrado",
          "Não foi possível identificar o chamado selecionado."
        );

        return;
      }

      const response = await apiGet<CandidaturasResponse>(
        `/api/Candidaturas/chamado/${jobId}`
      );

      const candidaturas = getCandidaturasFromResponse(response);

      console.log("Candidaturas retornadas pela API:", candidaturas);

      const formattedCandidates = candidaturas.map((candidatura) =>
        formatCandidate(candidatura, jobCategory)
      );

      setCandidates(formattedCandidates);
      setSelectedCandidateId(formattedCandidates[0]?.id ?? "");
    } catch (error) {
      console.log("Erro ao carregar candidatos:", error);

      setCandidates([]);
      setSelectedCandidateId("");

      Alert.alert(
        "Erro",
        "Não foi possível carregar os candidatos desse chamado agora."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleAcceptCandidate(candidate: Candidate) {
    router.push({
      pathname: "/payment",
      params: {
        jobId,
        candidaturaId: candidate.id,
        freelancerId: candidate.freelancerId ?? "",

        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,

        candidateName: candidate.name,
        candidateEmail: candidate.email ?? "",
        candidateRating: candidate.rating ? String(candidate.rating) : "",

        serviceValue: candidate.price,
        candidatePrice: candidate.price,
      },
    });
  }

  function handleViewFreelancerProfile(candidate: Candidate) {
    router.push({
      pathname: "/freelancer-profile",
      params: {
        jobId,
        candidaturaId: candidate.id,
        freelancerId: candidate.freelancerId ?? "",

        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,

        candidateName: candidate.name,
        candidateEmail: candidate.email ?? "",
        candidateRating: candidate.rating ? String(candidate.rating) : "",
        candidatePrice: candidate.price,
      },
    });
  }

  function handleRejectCandidate(candidate: Candidate) {
    Alert.alert(
      "Recusar candidato",
      `Deseja recusar a candidatura de ${candidate.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Recusar",
          style: "destructive",
          onPress: () => {
            console.log("Candidatura recusada localmente:", candidate);

            setCandidates((currentCandidates) => {
              const updatedCandidates = currentCandidates.filter(
                (item) => item.id !== candidate.id
              );

              if (selectedCandidateId === candidate.id) {
                setSelectedCandidateId(updatedCandidates[0]?.id ?? "");
              }

              return updatedCandidates;
            });

            /*
              Quando a API tiver rota para recusar candidatura,
              a chamada entra aqui.

              Exemplo futuro:
              await apiPut(`/api/Candidaturas/${candidate.id}/status`, {
                status: "recusada",
              });
            */
          },
        },
      ]
    );
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
          Candidatos
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <View
          style={[
            styles.jobCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.jobLabel, { color: theme.primary }]}>
            Chamado
          </Text>

          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          <View style={styles.jobInfoArea}>
            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <WalletIcon width={18} height={18} />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobPrice}
              </Text>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <LocationIcon width={18} height={18} />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobLocation}
              </Text>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <TimeIcon width={18} height={18} />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobTime}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Freelancers interessados
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                { color: theme.textSecondary },
              ]}
            >
              {isLoading
                ? "Carregando candidatos..."
                : `${candidates.length} candidatos encontrados`}
            </Text>
          </View>
        </View>

        <View style={styles.candidatesList}>
          {isLoading ? (
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
                Carregando candidatos...
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Buscando as candidaturas desse chamado na API.
              </Text>
            </View>
          ) : candidates.length === 0 ? (
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
                Nenhum candidato disponível
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Ainda não há candidaturas para esse chamado.
              </Text>
            </View>
          ) : (
            candidates.map((candidate) => {
              const isSelected = selectedCandidateId === candidate.id;

              return (
                <Pressable
                  key={candidate.id}
                  style={({ pressed }) => [
                    styles.candidateCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    isSelected && styles.candidateCardSelected,
                    pressed && styles.candidateCardPressed,
                  ]}
                  onPress={() => setSelectedCandidateId(candidate.id)}
                >
                  <View style={styles.candidateHeader}>
                    <Image
                      source={require("../../assets/images/icon.png")}
                      style={styles.avatar}
                      resizeMode="contain"
                    />

                    <View style={styles.candidateInfo}>
                      <Text
                        style={[
                          styles.candidateName,
                          { color: theme.text },
                        ]}
                      >
                        {candidate.name}
                      </Text>

                      <Text
                        style={[
                          styles.candidateRole,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {candidate.role}
                      </Text>

                      <View style={styles.ratingArea}>
                        <Text style={styles.ratingIcon}>⭐</Text>

                        <Text
                          style={[
                            styles.ratingText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {candidate.rating
                            ? `${candidate.rating} • ${candidate.reviews} avaliações`
                            : "Sem avaliações"}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.candidatePrice}>
                      {candidate.price}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.description,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {candidate.description}
                  </Text>

                  <View style={styles.skillsArea}>
                    {candidate.skills.map((skill) => (
                      <View
                        key={skill}
                        style={[
                          styles.skillChip,
                          {
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.skillText,
                            { color: theme.text },
                          ]}
                        >
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.statsArea}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.text }]}>
                        {candidate.completedJobs}
                      </Text>

                      <Text
                        style={[
                          styles.statLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
                        serviços
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statDivider,
                        { backgroundColor: theme.border },
                      ]}
                    />

                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.text }]}>
                        {candidate.distance}
                      </Text>

                      <Text
                        style={[
                          styles.statLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
                        distância
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statDivider,
                        { backgroundColor: theme.border },
                      ]}
                    />

                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.text }]}>
                        {candidate.rating ?? "-"}
                      </Text>

                      <Text
                        style={[
                          styles.statLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
                        nota
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.profileButton,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                      pressed && styles.profileButtonPressed,
                    ]}
                    onPress={() => handleViewFreelancerProfile(candidate)}
                  >
                    <Text
                      style={[
                        styles.profileButtonText,
                        { color: theme.text },
                      ]}
                    >
                      Ver perfil completo
                    </Text>
                  </Pressable>

                  <View style={styles.actionButtonsRow}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.rejectButton,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                        pressed && styles.rejectButtonPressed,
                      ]}
                      onPress={() => handleRejectCandidate(candidate)}
                    >
                      <Text style={styles.rejectButtonText}>Recusar</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.acceptButton,
                        pressed && styles.acceptButtonPressed,
                      ]}
                      onPress={() => handleAcceptCandidate(candidate)}
                    >
                      <Text style={styles.acceptButtonText}>Aceitar</Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })
          )}
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
            Antes de aceitar
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Analise a mensagem enviada pelo freelancer e o valor proposto. Após o
            aceite, o próximo passo será revisar o pagamento da taxa da
            plataforma para liberar o chat.
          </Text>
        </View>

        {selectedCandidate && (
          <Text style={[styles.selectedText, { color: theme.textSecondary }]}>
            Selecionado: {selectedCandidate.name}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
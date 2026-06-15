import { useCallback, useMemo, useState } from "react";
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
import { router, useFocusEffect } from "expo-router";

import PlusIcon from "../../../assets/icons/Plus-icon.svg";
import WalletIcon from "../../../assets/icons/wallet.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import TimeIcon from "../../../assets/icons/access_time.svg";
import AssignmentIcon from "../../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/companyDashboard";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiDelete, apiGet } from "@/services/api";
import { getCompanyData, getLoggedUser } from "@/services/storage";

type JobStatus = "open" | "inProgress" | "finished";

type CompanyJob = {
  id: string;
  title: string;
  category: string;
  price: string;
  location: string;
  time: string;
  candidates: number;
  totalProfessionals: number;
  acceptedProfessionals: number;
  availableSpots: number;
  status: JobStatus;
};

type CandidaturaApi = {
  id?: number;
  freelancerId?: number;
  status?: string | null;
  situacao?: string | null;
  statusCandidatura?: string | null;
};

type ChamadoApi = {
  id: number;
  empresaId: number;
  categoriaId: number;
  titulo: string;
  descricao: string;
  categoria?: string | null;
  empresa?: string | null;
  localServico?: string | null;
  cidade?: string | null;
  estado?: string | null;
  dataServico?: string | null;
  horaServico?: string | null;
  valorEstimado?: number | null;
  status?: string | null;

  quantidadeProfissionais?: number | string | null;
  quantidade_profissionais?: number | string | null;
  totalProfissionais?: number | string | null;
  totalVagas?: number | string | null;
  vagasTotais?: number | string | null;
  professionals?: number | string | null;

  totalAceitos?: number | string | null;
  total_aceitos?: number | string | null;
  quantidadeAceitos?: number | string | null;
  profissionaisAceitos?: number | string | null;
  vagasPreenchidas?: number | string | null;

  vagasDisponiveis?: number | string | null;
  vagas_disponiveis?: number | string | null;

  totalCandidaturas?: number | string | null;
  quantidadeCandidatos?: number | string | null;
  totalCandidatos?: number | string | null;
  candidates?: number | string | null;
  candidaturas?: CandidaturaApi[];
};

type ChamadosResponse =
  | ChamadoApi[]
  | {
      data?: ChamadoApi[];
      dados?: ChamadoApi[];
      chamados?: ChamadoApi[];
    };

const statusConfig = {
  open: {
    label: "Aberto",
    badgeStyle: "activeBadge",
    textStyle: "activeText",
  },
  inProgress: {
    label: "Em andamento",
    badgeStyle: "pendingBadge",
    textStyle: "pendingText",
  },
  finished: {
    label: "Finalizado",
    badgeStyle: "finishedBadge",
    textStyle: "finishedText",
  },
} as const;

const categoryNameMap: Record<number, string> = {
  1: "Eventos",
  2: "Fotografia",
  3: "Design",
  4: "Marketing",
  5: "Manutenção",
  6: "Limpeza",
};

function getChamadosFromResponse(response: ChamadosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.chamados ?? [];
}

function parseNumberValue(value: unknown, fallback = 0) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return parsedValue;
}

function getCategoryName(categoryId: number) {
  return categoryNameMap[categoryId] ?? `Categoria ${categoryId}`;
}

function formatCurrency(value?: number | null) {
  if (value === null || value === undefined) {
    return "Valor a combinar";
  }

  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}


function getProfilePhotoUrl(profileData: any, fallback = "") {
  return String(
    profileData?.photoUrl ??
      profileData?.photo_url ??
      profileData?.fotoUrl ??
      profileData?.foto_url ??
      profileData?.logoUrl ??
      profileData?.logo_url ??
      profileData?.imageUrl ??
      profileData?.image_url ??
      profileData?.avatarUrl ??
      profileData?.avatar_url ??
      fallback ??
      ""
  ).trim();
}

function getInitial(value: string) {
  const text = value.trim();

  if (!text) {
    return "E";
  }

  return text.charAt(0).toUpperCase();
}

function formatJobDate(date?: string | null, hour?: string | null) {
  if (!date && !hour) {
    return "Data não informada";
  }

  if (!date) {
    return hour ?? "Data não informada";
  }

  const dateOnly = date.split("T")[0];
  const dateParts = dateOnly.split("-");

  if (dateParts.length === 3) {
    const [year, month, day] = dateParts;
    const formattedDate = `${day}/${month}/${year}`;

    return hour ? `${formattedDate}, ${hour}` : formattedDate;
  }

  return hour ? `${date}, ${hour}` : date;
}

function getJobStatus(status?: string | null): JobStatus {
  const normalizedStatus = status?.toLowerCase().trim();

  if (
    normalizedStatus === "finalizado" ||
    normalizedStatus === "finished" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluído"
  ) {
    return "finished";
  }

  if (
    normalizedStatus === "em_andamento" ||
    normalizedStatus === "em andamento" ||
    normalizedStatus === "andamento" ||
    normalizedStatus === "in_progress"
  ) {
    return "inProgress";
  }

  return "open";
}

function getCandidatesCount(chamado: ChamadoApi) {
  const rawCandidates =
    chamado.totalCandidaturas ??
    chamado.quantidadeCandidatos ??
    chamado.totalCandidatos ??
    chamado.candidates;

  if (rawCandidates !== undefined && rawCandidates !== null) {
    const candidates = parseNumberValue(rawCandidates, 0);

    if (candidates <= 0) {
      return 0;
    }

    return candidates;
  }

  if (Array.isArray(chamado.candidaturas)) {
    return chamado.candidaturas.length;
  }

  return 0;
}

function isAcceptedStatus(status?: string | null) {
  const normalizedStatus = status?.toLowerCase().trim();

  return (
    normalizedStatus === "aceito" ||
    normalizedStatus === "aceita" ||
    normalizedStatus === "aprovado" ||
    normalizedStatus === "aprovada" ||
    normalizedStatus === "accepted" ||
    normalizedStatus === "contratado" ||
    normalizedStatus === "contratada"
  );
}

function getTotalProfessionals(chamado: ChamadoApi) {
  const rawTotal =
    chamado.quantidadeProfissionais ??
    chamado.quantidade_profissionais ??
    chamado.totalProfissionais ??
    chamado.totalVagas ??
    chamado.vagasTotais ??
    chamado.professionals ??
    1;

  const total = parseNumberValue(rawTotal, 1);

  if (total <= 0) {
    return 1;
  }

  return total;
}

function getAcceptedProfessionals(chamado: ChamadoApi) {
  const rawAccepted =
    chamado.totalAceitos ??
    chamado.total_aceitos ??
    chamado.quantidadeAceitos ??
    chamado.profissionaisAceitos ??
    chamado.vagasPreenchidas;

  if (rawAccepted !== undefined && rawAccepted !== null) {
    const accepted = parseNumberValue(rawAccepted, 0);

    if (accepted <= 0) {
      return 0;
    }

    return accepted;
  }

  if (Array.isArray(chamado.candidaturas)) {
    return chamado.candidaturas.filter((candidatura) => {
      return (
        isAcceptedStatus(candidatura.status) ||
        isAcceptedStatus(candidatura.situacao) ||
        isAcceptedStatus(candidatura.statusCandidatura)
      );
    }).length;
  }

  return 0;
}

function getAvailableSpots(chamado: ChamadoApi) {
  const rawAvailableSpots =
    chamado.vagasDisponiveis ?? chamado.vagas_disponiveis;

  if (rawAvailableSpots !== undefined && rawAvailableSpots !== null) {
    const apiAvailableSpots = parseNumberValue(rawAvailableSpots, 0);

    if (apiAvailableSpots <= 0) {
      return 0;
    }

    return apiAvailableSpots;
  }

  const totalProfessionals = getTotalProfessionals(chamado);
  const acceptedProfessionals = getAcceptedProfessionals(chamado);

  const availableSpots = totalProfessionals - acceptedProfessionals;

  if (availableSpots <= 0) {
    return 0;
  }

  return availableSpots;
}

function getAvailableSpotsText(job: CompanyJob) {
  if (job.status === "finished") {
    return "Serviço finalizado";
  }

  if (job.availableSpots <= 0) {
    return "Vagas preenchidas";
  }

  if (job.availableSpots === 1) {
    return "1 vaga aberta";
  }

  return `${job.availableSpots} vagas abertas`;
}

export default function CompanyDashboardScreen() {
  const { isDark, theme } = useTheme();

  const [companyJobs, setCompanyJobs] = useState<CompanyJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelJobId, setCancelJobId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Empresa");
  const [companyPhotoUrl, setCompanyPhotoUrl] = useState("");

  const infoIconColor = isDark ? colors.white : colors.black;
  const emptyIconColor = isDark ? colors.white : colors.black;

  useFocusEffect(
    useCallback(() => {
      loadCompanyJobs();
    }, [])
  );

  async function loadCompanyJobs() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      const savedCompanyData = await getCompanyData(loggedUser.id);

      setCompanyName(savedCompanyData?.name || loggedUser.nome || "Empresa");
      setCompanyPhotoUrl(getProfilePhotoUrl(savedCompanyData, getProfilePhotoUrl(loggedUser)));

      const response = await apiGet<ChamadosResponse>("/api/Chamados");
      const chamados = getChamadosFromResponse(response);

      const companyProfileId = Number(loggedUser.perfilId);
      const loggedUserId = Number(loggedUser.id);

      console.log("Usuário logado:", loggedUser);
      console.log("Empresa perfilId:", companyProfileId);
      console.log("Usuário id:", loggedUserId);
      console.log("Chamados retornados pela API:", chamados);

      const companyChamados = chamados.filter((chamado) => {
        const chamadoEmpresaId = Number(chamado.empresaId);

        return (
          chamadoEmpresaId === companyProfileId ||
          chamadoEmpresaId === loggedUserId
        );
      });

      const chamadosParaMostrar =
        companyChamados.length > 0 ? companyChamados : chamados;

      const formattedJobs: CompanyJob[] = chamadosParaMostrar
        .sort((a, b) => Number(b.id) - Number(a.id))
        .map((chamado) => {
          const totalProfessionals = getTotalProfessionals(chamado);
          const acceptedProfessionals = getAcceptedProfessionals(chamado);
          const availableSpots = getAvailableSpots(chamado);

          return {
            id: String(chamado.id),
            title: chamado.titulo,
            category:
              chamado.categoria ||
              getCategoryName(Number(chamado.categoriaId)),
            price: formatCurrency(chamado.valorEstimado),
            location:
              chamado.localServico ||
              [chamado.cidade, chamado.estado].filter(Boolean).join(" - ") ||
              "Local não informado",
            time: formatJobDate(chamado.dataServico, chamado.horaServico),
            candidates: getCandidatesCount(chamado),
            totalProfessionals,
            acceptedProfessionals,
            availableSpots,
            status: getJobStatus(chamado.status),
          };
        });

      setCompanyJobs(formattedJobs);
    } catch (error) {
      console.log("Erro ao carregar chamados da empresa:", error);

      setCompanyJobs([]);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os chamados da empresa agora."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const openJobs = useMemo(() => {
    return companyJobs.filter((job) => job.status === "open").length;
  }, [companyJobs]);

  const totalCandidates = useMemo(() => {
    return companyJobs.reduce((total, job) => total + job.candidates, 0);
  }, [companyJobs]);

  function handleCreateJob() {
    router.push("/create-job");
  }

  function handleViewCandidates(job: CompanyJob) {
    router.push({
      pathname: "/job-candidates",
      params: {
        id: job.id,
        title: job.title,
        category: job.category,
        price: job.price,
        location: job.location,
        time: job.time,
        companyName,
        companyPhotoUrl,
        empresaFotoUrl: companyPhotoUrl,
        candidates: String(job.candidates),
        totalProfessionals: String(job.totalProfessionals),
        acceptedProfessionals: String(job.acceptedProfessionals),
        availableSpots: String(job.availableSpots),
        status: job.status,
      },
    });
  }

  function handleCancelJob(job: CompanyJob) {
    console.log("Clicou em cancelar chamado:", job.id);
    setCancelJobId(job.id);
  }

  async function confirmCancelJob(job: CompanyJob) {
    try {
      console.log("Confirmou cancelamento:", job.id);

      await apiDelete(`/api/Chamados/${job.id}`);

      setCancelJobId(null);

      Alert.alert(
        "Chamado cancelado",
        "O chamado foi cancelado com sucesso."
      );

      loadCompanyJobs();
    } catch (error) {
      console.log("Erro ao cancelar chamado:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível cancelar o chamado agora.";

      Alert.alert("Erro ao cancelar", errorMessage);
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Olá, {companyName}
            </Text>

            <Text style={[styles.title, { color: theme.text }]}>
              Gerencie seus chamados
            </Text>
          </View>

          {companyPhotoUrl ? (
            <Image
              source={{ uri: companyPhotoUrl }}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: theme.card,
                borderWidth: 2,
                borderColor: theme.border,
              }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: theme.border,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                {getInitial(companyName)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.summaryArea}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.summaryNumber, { color: theme.text }]}>
              {companyJobs.length}
            </Text>

            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Chamados
            </Text>
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
            <Text style={[styles.summaryNumber, { color: theme.text }]}>
              {openJobs}
            </Text>

            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Abertos
            </Text>
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
            <Text style={[styles.summaryNumber, { color: theme.text }]}>
              {totalCandidates}
            </Text>

            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Candidatos
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.createJobButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreateJob}
        >
          <PlusIcon width={18} height={18} color={colors.plus} />
          <Text style={styles.createJobText}>Criar novo chamado</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Meus chamados
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Acompanhe suas publicações
          </Text>
        </View>

        <View style={styles.jobsList}>
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
                Carregando chamados...
              </Text>

              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                Buscando os chamados publicados pela empresa.
              </Text>
            </View>
          ) : companyJobs.length === 0 ? (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <AssignmentIcon
                  width={34}
                  height={34}
                  color={emptyIconColor}
                  fill={emptyIconColor}
                />
              </View>

              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Nenhum chamado publicado
              </Text>

              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                Quando a empresa criar chamados, eles aparecerão aqui.
              </Text>
            </View>
          ) : (
            companyJobs.map((job) => {
              const currentStatus = statusConfig[job.status];

              return (
                <View
                  key={job.id}
                  style={[
                    styles.jobCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.cardTop}>
                    <View style={styles.cardTitleArea}>
                      <Text style={[styles.jobTitle, { color: theme.text }]}>
                        {job.title}
                      </Text>

                      <Text
                        style={[
                          styles.jobCategory,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {job.category}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        styles[currentStatus.badgeStyle],
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          styles[currentStatus.textStyle],
                        ]}
                      >
                        {currentStatus.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoArea}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoIconBox}>
                        <WalletIcon
                          width={18}
                          height={18}
                          color={infoIconColor}
                          fill={infoIconColor}
                        />
                      </View>

                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {job.price}
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

                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {job.location}
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

                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {job.time}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.cardFooter,
                      { borderTopColor: theme.border },
                    ]}
                  >
                    <View>
                      <View style={styles.candidatesArea}>
                        <Text
                          style={[
                            styles.candidatesNumber,
                            { color: theme.text },
                          ]}
                        >
                          {job.candidates}
                        </Text>

                        <Text
                          style={[
                            styles.candidatesText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          candidatos
                        </Text>
                      </View>

                      <Text
                        style={{
                          color:
                            job.availableSpots > 0
                              ? colors.success
                              : theme.textSecondary,
                          fontSize: 12,
                          fontWeight: "900",
                          marginTop: 3,
                        }}
                      >
                        {getAvailableSpotsText(job)}
                      </Text>
                    </View>

                    {cancelJobId === job.id ? (
                      <View style={{ gap: 8, alignItems: "flex-end" }}>
                        <Text
                          style={{
                            color: "#DC2626",
                            fontSize: 12,
                            fontWeight: "800",
                          }}
                        >
                          Confirmar cancelamento?
                        </Text>

                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <Pressable
                            hitSlop={10}
                            onPress={() => setCancelJobId(null)}
                            style={({ pressed }) => [
                              {
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 10,
                                backgroundColor: theme.inputBackground,
                                borderWidth: 1,
                                borderColor: theme.border,
                              },
                              pressed && { opacity: 0.7 },
                            ]}
                          >
                            <Text
                              style={{
                                color: theme.text,
                                fontSize: 12,
                                fontWeight: "800",
                              }}
                            >
                              Não
                            </Text>
                          </Pressable>

                          <Pressable
                            hitSlop={10}
                            onPress={() => confirmCancelJob(job)}
                            style={({ pressed }) => [
                              {
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 10,
                                backgroundColor: "#DC2626",
                              },
                              pressed && { opacity: 0.7 },
                            ]}
                          >
                            <Text
                              style={{
                                color: "#FFFFFF",
                                fontSize: 12,
                                fontWeight: "800",
                              }}
                            >
                              Sim, cancelar
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {job.status === "open" && (
                          <Pressable
                            hitSlop={10}
                            onPress={() => handleCancelJob(job)}
                            style={({ pressed }) => [
                              {
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderRadius: 10,
                                backgroundColor: "rgba(220, 38, 38, 0.08)",
                                borderWidth: 1,
                                borderColor: "rgba(220, 38, 38, 0.22)",
                              },
                              pressed && { opacity: 0.7 },
                            ]}
                          >
                            <Text
                              style={{
                                color: "#DC2626",
                                fontSize: 12,
                                fontWeight: "800",
                              }}
                            >
                              Cancelar
                            </Text>
                          </Pressable>
                        )}

                        <Pressable
                          hitSlop={10}
                          onPress={() => handleViewCandidates(job)}
                        >
                          <Text style={styles.detailsText}>
                            Ver candidatos ›
                          </Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>
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
            Dica para empresas
          </Text>

          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Chamados com descrição clara, valor definido e horário informado
            costumam receber mais candidatos qualificados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
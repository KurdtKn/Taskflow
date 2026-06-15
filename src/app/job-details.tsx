import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";

type ChamadoApi = {
  id?: number | string;
  empresaId?: number | string;
  empresa_id?: number | string;
  categoriaId?: number | string;
  categoria_id?: number | string;
  titulo?: string;
  title?: string;
  descricao?: string;
  description?: string;
  categoria?: string;
  empresa?: string;
  company?: string;
  nomeEmpresa?: string;
  nome_empresa?: string;
  localServico?: string | null;
  local_servico?: string | null;
  cidade?: string | null;
  estado?: string | null;
  dataServico?: string | null;
  data_servico?: string | null;
  horaServico?: string | null;
  hora_servico?: string | null;
  valorEstimado?: number | string | null;
  valor_estimado?: number | string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  status?: string;
  vagasDisponiveis?: number | string;
  vagas_disponiveis?: number | string;
  quantidadeProfissionais?: number | string;
  quantidade_profissionais?: number | string;
  totalCandidaturas?: number | string;
  total_candidaturas?: number | string;
  totalAceitos?: number | string;
  total_aceitos?: number | string;
};

type ChamadosResponse =
  | ChamadoApi[]
  | {
      data?: ChamadoApi[];
      dados?: ChamadoApi[];
      chamados?: ChamadoApi[];
    };

type CandidaturaApi = {
  id?: number | string;
  chamadoId?: number | string;
  chamado_id?: number | string;
  status?: string;
  chamado?: {
    id?: number | string;
  };
};

type CandidaturasResponse =
  | CandidaturaApi[]
  | {
      data?: CandidaturaApi[];
      dados?: CandidaturaApi[];
      candidaturas?: CandidaturaApi[];
    };

type JobDetails = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  rawPrice: string;
  location: string;
  city: string;
  state: string;
  time: string;
  date: string;
  status: string;
  companyName: string;
  vacancies: number;
};

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function getChamadosFromResponse(response: ChamadosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.chamados ?? [];
}

function getCandidaturasFromResponse(response: CandidaturasResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.candidaturas ?? [];
}

function toNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace("R$", "").replace(/\./g, "").replace(",", ".").trim());

  if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
    return null;
  }

  return parsed;
}

function formatCurrency(value: unknown) {
  if (typeof value === "string" && value.trim().startsWith("R$")) {
    return value;
  }

  const parsed = toNumber(value);

  if (parsed === null || parsed <= 0) {
    return "Valor a combinar";
  }

  return parsed.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Data a combinar";
  }

  const parts = value.split("-");

  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return value;
}

function normalizeStatus(status: string) {
  return status.toLowerCase().trim();
}

function isUnavailableStatus(status: string) {
  const normalized = normalizeStatus(status);

  return (
    normalized === "finalizado" ||
    normalized === "cancelado" ||
    normalized === "cancelada" ||
    normalized === "finished"
  );
}

function getVacanciesFromApi(chamado: ChamadoApi) {
  const vagas = toNumber(chamado.vagasDisponiveis ?? chamado.vagas_disponiveis);

  if (vagas !== null) {
    return Math.max(Math.trunc(vagas), 0);
  }

  const quantidade = toNumber(chamado.quantidadeProfissionais ?? chamado.quantidade_profissionais) ?? 1;
  const aceitos = toNumber(chamado.totalAceitos ?? chamado.total_aceitos) ?? 0;

  return Math.max(Math.trunc(quantidade - aceitos), 0);
}

function normalizeJobFromApi(chamado: ChamadoApi, fallback: JobDetails): JobDetails {
  const id = String(chamado.id ?? fallback.id);

  const local =
    chamado.localServico ??
    chamado.local_servico ??
    fallback.location ??
    "Local não informado";

  const city = chamado.cidade ?? fallback.city ?? "";
  const state = chamado.estado ?? fallback.state ?? "";
  const date = formatDate(chamado.dataServico ?? chamado.data_servico);
  const hour = chamado.horaServico ?? chamado.hora_servico ?? "Horário a combinar";

  const status = chamado.status ?? fallback.status ?? "aberto";

  const vacancies = isUnavailableStatus(status) ? 0 : getVacanciesFromApi(chamado);

  return {
    id,
    title: chamado.titulo ?? chamado.title ?? fallback.title,
    description: chamado.descricao ?? chamado.description ?? fallback.description,
    category: chamado.categoria ?? fallback.category,
    price: formatCurrency(chamado.valorEstimado ?? chamado.valor_estimado ?? fallback.rawPrice ?? fallback.price),
    rawPrice: String(chamado.valorEstimado ?? chamado.valor_estimado ?? fallback.rawPrice ?? ""),
    location: local,
    city,
    state,
    time: `${date}, ${hour}`,
    date,
    status,
    companyName:
      chamado.empresa ??
      chamado.company ??
      chamado.nomeEmpresa ??
      chamado.nome_empresa ??
      fallback.companyName ??
      "Empresa contratante",
    vacancies,
  };
}

function resolveLoggedUserType(loggedUserData: any) {
  return String(
    loggedUserData?.tipoUsuario ??
      loggedUserData?.tipo_usuario ??
      loggedUserData?.tipo ??
      ""
  )
    .toLowerCase()
    .trim();
}

function resolveFreelancerId(loggedUserData: any) {
  const value = Number(
    loggedUserData?.perfilId ??
      loggedUserData?.freelancerId ??
      loggedUserData?.idFreelancer ??
      loggedUserData?.freelancer_id ??
      loggedUserData?.id
  );

  if (Number.isNaN(value) || value <= 0) {
    return null;
  }

  return value;
}

export default function JobDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    jobId?: string;
    chamadoId?: string;
    title?: string;
    description?: string;
    category?: string;
    price?: string;
    rawPrice?: string;
    location?: string;
    city?: string;
    state?: string;
    time?: string;
    distance?: string;
    status?: string;
    company?: string;
    companyName?: string;
    vacancies?: string;
    vagasDisponiveis?: string;
    availableVacancies?: string;
  }>();

  const { isDark, theme } = useTheme();

  const initialJob: JobDetails = {
    id: firstParam(params.chamadoId) || firstParam(params.jobId) || firstParam(params.id),
    title: firstParam(params.title) || "Chamado disponível",
    description: firstParam(params.description) || "A descrição deste chamado será carregada conforme os dados cadastrados pela empresa.",
    category: firstParam(params.category) || "Serviço",
    price: firstParam(params.price) || "Valor a combinar",
    rawPrice: firstParam(params.rawPrice),
    location: firstParam(params.location) || "Local não informado",
    city: firstParam(params.city) || firstParam(params.distance),
    state: firstParam(params.state),
    time: firstParam(params.time) || "Data e horário a combinar",
    date: "",
    status: firstParam(params.status) || "aberto",
    companyName: firstParam(params.companyName) || firstParam(params.company) || "Empresa contratante",
    vacancies: Number(
      firstParam(params.vagasDisponiveis) ||
        firstParam(params.availableVacancies) ||
        firstParam(params.vacancies) ||
        "1"
    ),
  };

  const [job, setJob] = useState<JobDetails>(initialJob);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loggedUserType, setLoggedUserType] = useState("");

  const hasVacancies = job.vacancies > 0 && !isUnavailableStatus(job.status);
  const canApply = loggedUserType !== "empresa" && hasVacancies && !hasApplied;

  useFocusEffect(
    useCallback(() => {
      loadJobDetails();
      checkAppliedStatus();
    }, [job.id])
  );

  async function loadJobDetails() {
    if (!job.id) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await apiGet<ChamadosResponse>("/api/Chamados");
      const chamados = getChamadosFromResponse(response);
      const chamado = chamados.find((item) => String(item.id) === String(job.id));

      if (chamado) {
        setJob((currentJob) => normalizeJobFromApi(chamado, currentJob));
      }
    } catch (error) {
      console.log("Erro ao carregar detalhes do chamado:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function checkAppliedStatus() {
    try {
      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        setLoggedUserType("");
        setHasApplied(false);
        return;
      }

      const loggedUserData = loggedUser as any;
      const userType = resolveLoggedUserType(loggedUserData);
      setLoggedUserType(userType);

      if (userType !== "freelancer") {
        setHasApplied(false);
        return;
      }

      const freelancerId = resolveFreelancerId(loggedUserData);

      if (!freelancerId || !job.id) {
        setHasApplied(false);
        return;
      }

      const response = await apiGet<CandidaturasResponse>(
        `/api/Candidaturas/freelancer/${freelancerId}`
      );
      const candidaturas = getCandidaturasFromResponse(response);

      const candidaturaEncontrada = candidaturas.some((candidatura) => {
        const chamadoId =
          candidatura.chamadoId ??
          candidatura.chamado_id ??
          candidatura.chamado?.id;

        return String(chamadoId) === String(job.id);
      });

      setHasApplied(candidaturaEncontrada);
    } catch (error) {
      console.log("Erro ao verificar candidatura existente:", error);
      setHasApplied(false);
    }
  }

  function goToRequestConfirmation() {
    if (!hasVacancies) {
      Alert.alert(
        "Sem vagas disponíveis",
        "Este chamado não possui vagas disponíveis no momento."
      );
      return;
    }

    if (hasApplied) {
      Alert.alert(
        "Candidatura já enviada",
        "Você já enviou uma candidatura para este chamado. Aguarde a resposta da empresa."
      );
      return;
    }

    router.push({
      pathname: "/request-confirmation",
      params: {
        id: job.id,
        jobId: job.id,
        chamadoId: job.id,
        title: job.title,
        category: job.category,
        price: job.price,
        location: job.location,
        time: job.time,
        status: job.status,
        vacancies: String(job.vacancies),
        vagasDisponiveis: String(job.vacancies),
      },
    });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}> 
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { borderBottomColor: theme.border }]}> 
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backText, { color: theme.text }]}>‹</Text>
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>Detalhes do chamado</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.hero,
            {
              backgroundColor: isDark
                ? "rgba(11,87,208,0.16)"
                : "rgba(11,87,208,0.08)",
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={styles.heroIcon}>📍</Text>
          <Text style={[styles.heroText, { color: theme.textSecondary }]}>Local do chamado</Text>
        </View>

        <View style={styles.titleArea}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: "rgba(11,87,208,0.14)" }]}> 
              <Text style={styles.categoryText}>{job.category}</Text>
            </View>

            <View
              style={[
                styles.vacancyBadge,
                {
                  backgroundColor: hasVacancies
                    ? "rgba(22,163,74,0.12)"
                    : "rgba(220,38,38,0.12)",
                },
              ]}
            >
              <Text
                style={[
                  styles.vacancyText,
                  { color: hasVacancies ? "#16A34A" : "#DC2626" },
                ]}
              >
                {hasVacancies
                  ? `${job.vacancies} ${job.vacancies === 1 ? "vaga" : "vagas"}`
                  : "Sem vagas disponíveis"}
              </Text>
            </View>
          </View>

          <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
          <Text style={styles.jobPrice}>{job.price}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoEmoji}>📍</Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Localização</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}> 
                {job.city ? `${job.city} - ` : ""}{job.location}{job.state ? `/${job.state}` : ""}
              </Text>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoEmoji}>🕒</Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Data e horário</Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{job.time}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Descrição do serviço</Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}> 
          {job.description}
        </Text>

        <View style={[styles.companyCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>TF</Text>
          </View>

          <View style={styles.companyTextArea}>
            <Text style={[styles.companyName, { color: theme.text }]}>{job.companyName}</Text>
            <Text style={[styles.companySubtitle, { color: theme.textSecondary }]}>Empresa responsável pelo chamado</Text>
          </View>
        </View>

        {isLoading && (
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Atualizando dados pela API...</Text>
        )}

        {loggedUserType === "empresa" ? (
          <View style={[styles.noticeBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>Você está logado como empresa. Para se candidatar, acesse com perfil freelancer.</Text>
          </View>
        ) : hasApplied ? (
          <View style={[styles.noticeBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.noticeTitle, { color: theme.text }]}>Candidatura já enviada</Text>
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>Aguarde a resposta da empresa para continuar o atendimento.</Text>
          </View>
        ) : !hasVacancies ? (
          <View style={[styles.noticeBox, { backgroundColor: theme.card, borderColor: theme.border }]}> 
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>Este chamado não possui vagas disponíveis no momento.</Text>
          </View>
        ) : null}

        <Pressable
          disabled={!canApply}
          style={({ pressed }) => [
            styles.primaryButton,
            !canApply && styles.primaryButtonDisabled,
            pressed && canApply && { opacity: 0.85 },
          ]}
          onPress={goToRequestConfirmation}
        >
          <Text style={styles.primaryButtonText}>
            {hasApplied
              ? "Candidatura já enviada"
              : hasVacancies
              ? "Solicitar candidatura"
              : "Sem vagas disponíveis"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 74,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "400",
  },

  headerTitle: {
    fontSize: 17,
    fontWeight: "900",
  },

  headerPlaceholder: {
    width: 44,
    height: 44,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 36,
  },

  hero: {
    height: 190,
    borderWidth: 1,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  heroIcon: {
    fontSize: 54,
    marginBottom: 8,
  },

  heroText: {
    fontSize: 13,
    fontWeight: "800",
  },

  titleArea: {
    marginBottom: 18,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  categoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  vacancyBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },

  vacancyText: {
    fontSize: 12,
    fontWeight: "900",
  },

  jobTitle: {
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31,
    marginBottom: 8,
  },

  jobPrice: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },

  infoCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(148,163,184,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  infoEmoji: {
    fontSize: 20,
  },

  infoTextArea: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 20,
  },

  separator: {
    height: 1,
    marginVertical: 14,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 22,
    marginBottom: 20,
  },

  companyCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },

  companyAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  companyAvatarText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  companyTextArea: {
    flex: 1,
  },

  companyName: {
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 3,
  },

  companySubtitle: {
    fontSize: 12,
    fontWeight: "700",
  },

  loadingText: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 12,
  },

  noticeBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },

  noticeTitle: {
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 4,
  },

  noticeText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonDisabled: {
    backgroundColor: "rgba(100,116,139,0.45)",
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
});

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
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/jobCandidates";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";
import { apiGet, apiPost } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

type Candidate = {
  id: string;
  contratoId?: string;
  freelancerId?: string;
  name: string;
  email?: string;
  photoUrl?: string;
  role: string;
  rating: number | null;
  reviews: number;
  distance: string;
  completedJobs: number;
  price: string;
  description: string;
  skills: string[];
  status: string;
  paymentConfirmed?: boolean;
};

type FreelancerNestedApi = {
  id?: number | null;
  nome?: string | null;
  name?: string | null;
  email?: string | null;
  telefone?: string | null;
  fotoUrl?: string | null;
  foto_url?: string | null;
  photoUrl?: string | null;
  photo_url?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
  habilidades?: string[] | string | null;
  skills?: string[] | string | null;
  rating?: number | null;
  nota?: number | null;
  avaliacoes?: number | null;
  reviews?: number | null;
  servicosConcluidos?: number | null;
  completedJobs?: number | null;
};

type CandidaturaApi = {
  id: number;

  freelancerId?: number | null;
  freelancer_id?: number | null;

  contratoId?: number | null;
  contrato_id?: number | null;
  contrato?: { id?: number | null } | null;

  freelancer?: string | FreelancerNestedApi | null;

  nome?: string | null;
  name?: string | null;
  nomeFreelancer?: string | null;
  freelancerNome?: string | null;

  email?: string | null;
  freelancerEmail?: string | null;
  emailFreelancer?: string | null;

  fotoUrl?: string | null;
  foto_url?: string | null;
  photoUrl?: string | null;
  photo_url?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
  freelancerFotoUrl?: string | null;
  freelancer_foto_url?: string | null;
  freelancerPhotoUrl?: string | null;
  freelancer_photo_url?: string | null;
  freelancerAvatarUrl?: string | null;
  freelancer_avatar_url?: string | null;

  mensagem?: string | null;
  descricao?: string | null;

  valorProposto?: number | null;
  valor_proposto?: number | null;

  status?: string | null;
  dataCandidatura?: string | null;

  habilidades?: string[] | string | null;
  skills?: string[] | string | null;

  rating?: number | null;
  nota?: number | null;
  reviews?: number | null;
  avaliacoes?: number | null;
  completedJobs?: number | null;
  servicosConcluidos?: number | null;
};

type CandidaturasResponse =
  | CandidaturaApi[]
  | {
      data?: CandidaturaApi[];
      dados?: CandidaturaApi[];
      candidaturas?: CandidaturaApi[];
    };

type CandidaturaActionResponse = {
  mensagem?: string;
  candidaturaId?: number;
  contratoId?: number | null;
  contrato_id?: number | null;
  chamadoId?: number;
  freelancerId?: number;
  quantidadeProfissionais?: number;
  totalAceitos?: number;
  vagasDisponiveis?: number;
  chamadoStatus?: string;
};

const PAYMENT_CONFIRMED_PREFIX = "payment_confirmed_";

function getPaymentConfirmedKey(contratoId?: string | null) {
  return `${PAYMENT_CONFIRMED_PREFIX}${contratoId ?? ""}`;
}

async function checkPaymentConfirmed(contratoId?: string | null) {
  if (!contratoId) {
    return false;
  }

  try {
    const storedValue = await AsyncStorage.getItem(
      getPaymentConfirmedKey(contratoId),
    );

    return storedValue === "true";
  } catch (error) {
    console.log("Erro ao verificar pagamento confirmado:", error);
    return false;
  }
}

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

function getBestPaymentValue(candidate: Candidate, jobPrice: string) {
  const normalizedJobPrice = jobPrice.trim();

  if (normalizedJobPrice && normalizedJobPrice !== "Valor a combinar") {
    return normalizedJobPrice;
  }

  return candidate.price || "Valor a combinar";
}

function normalizeStatus(value?: string | null) {
  return value?.toLowerCase().trim() ?? "";
}

function getCandidateStatusLabel(status?: string | null) {
  const normalizedStatus = normalizeStatus(status);

  if (
    normalizedStatus === "aceita" ||
    normalizedStatus === "aceito" ||
    normalizedStatus === "accepted" ||
    normalizedStatus === "aprovada" ||
    normalizedStatus === "aprovado"
  ) {
    return "Aceita";
  }

  if (
    normalizedStatus === "recusada" ||
    normalizedStatus === "recusado" ||
    normalizedStatus === "rejected"
  ) {
    return "Recusada";
  }

  if (
    normalizedStatus === "cancelada" ||
    normalizedStatus === "cancelado" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "cancelled"
  ) {
    return "Cancelada";
  }

  return "Pendente";
}

function isFinishedStatus(status?: string | null) {
  const normalizedStatus = normalizeStatus(status);

  return (
    normalizedStatus === "finished" ||
    normalizedStatus === "finalizado" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluído" ||
    normalizedStatus === "completed" ||
    normalizedStatus === "cancelado" ||
    normalizedStatus === "cancelada" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  );
}

function getNestedFreelancer(apiCandidate: CandidaturaApi) {
  if (apiCandidate.freelancer && typeof apiCandidate.freelancer === "object") {
    return apiCandidate.freelancer;
  }

  return null;
}

function getFreelancerId(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  return (
    apiCandidate.freelancerId ??
    apiCandidate.freelancer_id ??
    nestedFreelancer?.id ??
    null
  );
}

function getContratoId(apiCandidate: CandidaturaApi) {
  return (
    apiCandidate.contratoId ??
    apiCandidate.contrato_id ??
    apiCandidate.contrato?.id ??
    null
  );
}

function getFreelancerName(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  if (typeof apiCandidate.freelancer === "string") {
    return apiCandidate.freelancer;
  }

  return (
    apiCandidate.nomeFreelancer ||
    apiCandidate.freelancerNome ||
    apiCandidate.nome ||
    apiCandidate.name ||
    nestedFreelancer?.nome ||
    nestedFreelancer?.name ||
    "Freelancer não informado"
  );
}

function getFreelancerEmail(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  return (
    apiCandidate.freelancerEmail ||
    apiCandidate.emailFreelancer ||
    apiCandidate.email ||
    nestedFreelancer?.email ||
    undefined
  );
}


function pickImageUrl(...values: Array<unknown>) {
  const foundValue = values.find((value) => {
    if (value === null || value === undefined) {
      return false;
    }

    return String(value).trim().length > 0;
  });

  if (!foundValue) {
    return undefined;
  }

  return String(foundValue).trim();
}

function getFreelancerPhoto(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  return pickImageUrl(
    apiCandidate.freelancerPhotoUrl,
    apiCandidate.freelancer_photo_url,
    apiCandidate.freelancerFotoUrl,
    apiCandidate.freelancer_foto_url,
    apiCandidate.freelancerAvatarUrl,
    apiCandidate.freelancer_avatar_url,
    apiCandidate.photoUrl,
    apiCandidate.photo_url,
    apiCandidate.fotoUrl,
    apiCandidate.foto_url,
    apiCandidate.imageUrl,
    apiCandidate.image_url,
    apiCandidate.avatarUrl,
    apiCandidate.avatar_url,
    apiCandidate.logoUrl,
    apiCandidate.logo_url,
    nestedFreelancer?.photoUrl,
    nestedFreelancer?.photo_url,
    nestedFreelancer?.fotoUrl,
    nestedFreelancer?.foto_url,
    nestedFreelancer?.imageUrl,
    nestedFreelancer?.image_url,
    nestedFreelancer?.avatarUrl,
    nestedFreelancer?.avatar_url,
    nestedFreelancer?.logoUrl,
    nestedFreelancer?.logo_url
  );
}

function getFreelancerRating(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  return (
    apiCandidate.rating ??
    apiCandidate.nota ??
    nestedFreelancer?.rating ??
    nestedFreelancer?.nota ??
    null
  );
}

function getFreelancerReviews(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  return (
    apiCandidate.reviews ??
    apiCandidate.avaliacoes ??
    nestedFreelancer?.reviews ??
    nestedFreelancer?.avaliacoes ??
    0
  );
}

function getCompletedJobs(apiCandidate: CandidaturaApi) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  return (
    apiCandidate.completedJobs ??
    apiCandidate.servicosConcluidos ??
    nestedFreelancer?.completedJobs ??
    nestedFreelancer?.servicosConcluidos ??
    0
  );
}

function normalizeSkills(value?: string[] | string | null) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getFreelancerSkills(
  apiCandidate: CandidaturaApi,
  jobCategory: string,
  statusLabel: string,
) {
  const nestedFreelancer = getNestedFreelancer(apiCandidate);

  const skillsOptions = [
    normalizeSkills(apiCandidate.habilidades),
    normalizeSkills(apiCandidate.skills),
    normalizeSkills(nestedFreelancer?.habilidades),
    normalizeSkills(nestedFreelancer?.skills),
  ];

  const skills =
    skillsOptions.find((skillsList) => skillsList.length > 0) ?? [];

  const baseSkills = skills.length > 0 ? skills : [jobCategory];

  return [...baseSkills, `Status: ${statusLabel}`];
}

function formatCandidate(
  apiCandidate: CandidaturaApi,
  jobCategory: string,
  jobPrice: string,
): Candidate {
  const valorProposto =
    apiCandidate.valorProposto ?? apiCandidate.valor_proposto ?? null;

  const candidatePrice = formatCurrency(valorProposto);

  const displayPrice =
    candidatePrice === "Valor a combinar" ? jobPrice : candidatePrice;

  const freelancerId = getFreelancerId(apiCandidate);
  const contratoId = getContratoId(apiCandidate);
  const candidateName = getFreelancerName(apiCandidate);
  const candidateEmail = getFreelancerEmail(apiCandidate);
  const candidatePhoto = getFreelancerPhoto(apiCandidate);
  const statusLabel = getCandidateStatusLabel(apiCandidate.status);
  const rating = getFreelancerRating(apiCandidate);
  const reviews = getFreelancerReviews(apiCandidate);
  const completedJobs = getCompletedJobs(apiCandidate);

  return {
    id: String(apiCandidate.id),
    contratoId: contratoId ? String(contratoId) : undefined,
    freelancerId: freelancerId ? String(freelancerId) : undefined,
    name: candidateName,
    email: candidateEmail,
    photoUrl: candidatePhoto,
    role: candidateEmail ? candidateEmail : "Freelancer",
    rating,
    reviews,
    distance: "Não informado",
    completedJobs,
    price: displayPrice,
    description:
      apiCandidate.mensagem ||
      apiCandidate.descricao ||
      "O freelancer ainda não enviou uma mensagem para essa candidatura.",
    skills: getFreelancerSkills(apiCandidate, jobCategory, statusLabel),
    status: statusLabel,
  };
}

export default function JobCandidatesScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    chamadoId?: string | string[];
    jobId?: string | string[];
    idChamado?: string | string[];
    chamado_id?: string | string[];
    title?: string | string[];
    category?: string | string[];
    price?: string | string[];
    location?: string | string[];
    time?: string | string[];
    candidates?: string | string[];
    status?: string | string[];
    jobStatus?: string | string[];
    companyName?: string | string[];
    companyPhotoUrl?: string | string[];
    empresaFotoUrl?: string | string[];
  }>();

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionCandidateId, setActionCandidateId] = useState("");

  const { isDark, theme } = useTheme();

  const infoIconColor = isDark ? colors.white : colors.black;

  function getParamValue(value?: string | string[], fallback = "") {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }

    return value ?? fallback;
  }

  const jobId =
    getParamValue(params.id) ||
    getParamValue(params.chamadoId) ||
    getParamValue(params.jobId) ||
    getParamValue(params.idChamado) ||
    getParamValue(params.chamado_id);
  const jobTitle = getParamValue(params.title, "Chamado");
  const jobCategory = getParamValue(params.category, "Categoria");
  const jobPrice = getParamValue(params.price, "Valor a combinar");
  const jobLocation = getParamValue(params.location, "Local não informado");
  const jobTime = getParamValue(params.time, "Data não informada");
  const jobStatus =
    getParamValue(params.status) || getParamValue(params.jobStatus);
  const companyName = getParamValue(params.companyName, "Empresa");
  const companyPhotoUrl =
    getParamValue(params.companyPhotoUrl) || getParamValue(params.empresaFotoUrl);

  const isJobFinished = isFinishedStatus(jobStatus);

  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === selectedCandidateId,
  );

  useFocusEffect(
    useCallback(() => {
      loadCandidates();
    }, [jobId]),
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
          "Não foi possível identificar o chamado selecionado.",
        );

        return;
      }

      const response = await apiGet<CandidaturasResponse>(
        `/api/Candidaturas/chamado/${jobId}`,
      );

      const candidaturas = getCandidaturasFromResponse(response);

      console.log("Candidaturas retornadas pela API:", candidaturas);

      const formattedCandidates = candidaturas.map((candidatura) =>
        formatCandidate(candidatura, jobCategory, jobPrice),
      );

      const formattedCandidatesWithPayment = await Promise.all(
        formattedCandidates.map(async (candidate) => ({
          ...candidate,
          paymentConfirmed: await checkPaymentConfirmed(candidate.contratoId),
        })),
      );

      setCandidates(formattedCandidatesWithPayment);
      setSelectedCandidateId(formattedCandidatesWithPayment[0]?.id ?? "");
    } catch (error) {
      console.log("Erro ao carregar candidatos:", error);

      setCandidates([]);
      setSelectedCandidateId("");

      Alert.alert(
        "Erro",
        "Não foi possível carregar os candidatos desse chamado agora.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function isCandidateAccepted(candidate: Candidate) {
    return candidate.status === "Aceita";
  }

  function isCandidatePaid(candidate: Candidate) {
    return Boolean(candidate.paymentConfirmed);
  }

  function isCandidateRejected(candidate: Candidate) {
    return candidate.status === "Recusada" || candidate.status === "Cancelada";
  }

  function showFinishedAlert() {
    Alert.alert(
      "Chamado finalizado",
      "Este serviço já foi finalizado. Não é possível aceitar candidatos, abrir pagamento ou iniciar chat.",
    );
  }

  function openChat(candidate: Candidate, contratoId?: string) {
    if (isJobFinished) {
      showFinishedAlert();
      return;
    }

    const finalContratoId = contratoId || candidate.contratoId || "";

    if (!finalContratoId) {
      Alert.alert(
        "Contrato não encontrado",
        "Esse freelancer já foi aceito, mas o app não recebeu o contratoId. Recarregue a tela ou confira se a API está retornando contratoId na listagem de candidaturas.",
      );
      return;
    }

    const paymentValue = getBestPaymentValue(candidate, jobPrice);

    router.push({
      pathname: "/chat",
      params: {
        contratoId: finalContratoId,

        jobId,
        candidaturaId: candidate.id,
        freelancerId: candidate.freelancerId ?? "",

        jobTitle,
        jobCategory,
        jobPrice: paymentValue,
        jobLocation,
        jobTime,
        status: jobStatus || "em_andamento",

        candidateName: candidate.name,
        candidateEmail: candidate.email ?? "",
        candidateRating: candidate.rating ? String(candidate.rating) : "",
        candidatePhotoUrl: candidate.photoUrl ?? "",

        companyName,
        companyPhotoUrl,

        serviceValue: paymentValue,
        candidatePrice: paymentValue,

        userRole: "empresa",
      },
    });
  }

  function goToPayment(candidate: Candidate, contratoId?: string) {
    if (isJobFinished) {
      showFinishedAlert();
      return;
    }

    const finalContratoId = contratoId || candidate.contratoId || "";
    const paymentValue = getBestPaymentValue(candidate, jobPrice);

    router.push({
      pathname: "/payment",
      params: {
        contratoId: finalContratoId,

        jobId,
        candidaturaId: candidate.id,
        freelancerId: candidate.freelancerId ?? "",

        jobTitle,
        jobCategory,
        jobPrice: paymentValue,
        jobLocation,
        jobTime,
        status: jobStatus,

        candidateName: candidate.name,
        candidateEmail: candidate.email ?? "",
        candidateRating: candidate.rating ? String(candidate.rating) : "",
        candidatePhotoUrl: candidate.photoUrl ?? "",

        companyName,
        companyPhotoUrl,

        serviceValue: paymentValue,
        candidatePrice: paymentValue,

        userRole: "empresa",
      },
    });
  }

  async function handleAcceptCandidate(candidate: Candidate) {
    if (isJobFinished) {
      showFinishedAlert();
      return;
    }

    if (isCandidateRejected(candidate)) {
      Alert.alert(
        "Candidatura recusada",
        "Não é possível aceitar uma candidatura que já foi recusada.",
      );
      return;
    }

    if (isCandidateAccepted(candidate)) {
      if (isCandidatePaid(candidate)) {
        openChat(candidate, candidate.contratoId);
        return;
      }

      goToPayment(candidate, candidate.contratoId);
      return;
    }

    try {
      setActionCandidateId(candidate.id);

      const response = await apiPost<CandidaturaActionResponse>(
        `/api/Candidaturas/${candidate.id}/aceitar`,
        {},
      );

      console.log("Candidatura aceita pela API:", response);

      const responseContratoId =
        response.contratoId ?? response.contrato_id ?? null;

      const contratoId = responseContratoId
        ? String(responseContratoId)
        : (candidate.contratoId ?? "");

      if (!contratoId) {
        console.log(
          "A API aceitou a candidatura, mas não retornou contratoId. O pagamento não vai conseguir confirmar sem esse ID.",
        );
      }

      setCandidates((currentCandidates) =>
        currentCandidates.map((item) =>
          item.id === candidate.id
            ? {
                ...item,
                contratoId,
                status: "Aceita",
                paymentConfirmed: false,
                skills: item.skills.map((skill) =>
                  skill.startsWith("Status:") ? "Status: Aceita" : skill,
                ),
              }
            : item,
        ),
      );

      goToPayment(
        {
          ...candidate,
          contratoId,
          status: "Aceita",
          paymentConfirmed: false,
        },
        contratoId,
      );
    } catch (error) {
      console.log("Erro ao aceitar candidatura:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível aceitar essa candidatura agora.";

      Alert.alert("Erro ao aceitar", errorMessage);
    } finally {
      setActionCandidateId("");
    }
  }

  function handleViewFreelancerProfile(candidate: Candidate) {
    router.push({
      pathname: "/freelancer-profile",
      params: {
        contratoId: candidate.contratoId ?? "",

        jobId,
        candidaturaId: candidate.id,
        freelancerId: candidate.freelancerId ?? "",

        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,
        status: jobStatus,

        candidateName: candidate.name,
        candidateEmail: candidate.email ?? "",
        candidateRating: candidate.rating ? String(candidate.rating) : "",
        candidatePhotoUrl: candidate.photoUrl ?? "",
        candidatePrice: candidate.price,
      },
    });
  }

  async function rejectCandidate(candidate: Candidate) {
    try {
      setActionCandidateId(candidate.id);

      const response = await apiPost<CandidaturaActionResponse>(
        `/api/Candidaturas/${candidate.id}/recusar`,
        {},
      );

      console.log("Candidatura recusada pela API:", response);

      setCandidates((currentCandidates) =>
        currentCandidates.map((item) =>
          item.id === candidate.id
            ? {
                ...item,
                status: "Recusada",
                skills: item.skills.map((skill) =>
                  skill.startsWith("Status:") ? "Status: Recusada" : skill,
                ),
              }
            : item,
        ),
      );

      Alert.alert(
        "Candidatura recusada",
        `A candidatura de ${candidate.name} foi recusada.`,
      );
    } catch (error) {
      console.log("Erro ao recusar candidatura:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível recusar essa candidatura agora.";

      Alert.alert("Erro ao recusar", errorMessage);
    } finally {
      setActionCandidateId("");
    }
  }

  function handleRejectCandidate(candidate: Candidate) {
    if (isJobFinished) {
      showFinishedAlert();
      return;
    }

    if (isCandidateAccepted(candidate)) {
      Alert.alert(
        "Candidatura já aceita",
        "Não é possível recusar uma candidatura que já foi aceita.",
      );
      return;
    }

    if (isCandidateRejected(candidate)) {
      Alert.alert(
        "Candidatura já recusada",
        "Essa candidatura já foi recusada.",
      );
      return;
    }

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
          onPress: () => rejectCandidate(candidate),
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} color={theme.text} />
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
        style={{ backgroundColor: theme.background }}
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
            {isJobFinished ? "Chamado finalizado" : "Chamado"}
          </Text>

          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          {isJobFinished && (
            <Text
              style={{
                color: colors.danger,
                fontSize: 12,
                fontWeight: "900",
                marginTop: 8,
              }}
            >
              Este chamado está encerrado. Pagamento e chat ficam bloqueados.
            </Text>
          )}

          <View style={styles.jobInfoArea}>
            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <WalletIcon
                  width={18}
                  height={18}
                  color={infoIconColor}
                  fill={infoIconColor}
                />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobPrice}
              </Text>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <LocationIcon
                  width={18}
                  height={18}
                  color={infoIconColor}
                  fill={infoIconColor}
                />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobLocation}
              </Text>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <TimeIcon
                  width={18}
                  height={18}
                  color={infoIconColor}
                  fill={infoIconColor}
                />
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
              style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
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
              const isAccepted = isCandidateAccepted(candidate);
              const isPaid = isCandidatePaid(candidate);
              const isRejected = isCandidateRejected(candidate);
              const isActionLoading = actionCandidateId === candidate.id;

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
                    {candidate.photoUrl ? (
                      <Image
                        source={{ uri: candidate.photoUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/icon.png")}
                        style={styles.avatar}
                        resizeMode="contain"
                      />
                    )}

                    <View style={styles.candidateInfo}>
                      <Text
                        style={[styles.candidateName, { color: theme.text }]}
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

                    <Text
                      style={[styles.candidatePrice, { color: theme.primary }]}
                    >
                      {candidate.price}
                    </Text>
                  </View>

                  <Text
                    style={[styles.description, { color: theme.textSecondary }]}
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
                        <Text style={[styles.skillText, { color: theme.text }]}>
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View
                    style={[
                      styles.statsArea,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                    ]}
                  >
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
                      style={[styles.profileButtonText, { color: theme.text }]}
                    >
                      Ver perfil completo
                    </Text>
                  </Pressable>

                  <View style={styles.actionButtonsRow}>
                    <Pressable
                      disabled={
                        isJobFinished ||
                        isAccepted ||
                        isRejected ||
                        isActionLoading
                      }
                      style={({ pressed }) => [
                        styles.rejectButton,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                        (isJobFinished ||
                          isAccepted ||
                          isRejected ||
                          isActionLoading) &&
                          styles.acceptButtonDisabled,
                        pressed &&
                          !isJobFinished &&
                          !isAccepted &&
                          !isRejected &&
                          !isActionLoading &&
                          styles.rejectButtonPressed,
                      ]}
                      onPress={() => handleRejectCandidate(candidate)}
                    >
                      <Text style={styles.rejectButtonText}>
                        {isJobFinished
                          ? "Finalizado"
                          : isRejected
                            ? "Recusada"
                            : "Recusar"}
                      </Text>
                    </Pressable>

                    <Pressable
                      disabled={isJobFinished || isRejected || isActionLoading}
                      style={({ pressed }) => [
                        styles.acceptButton,
                        (isJobFinished || isRejected || isActionLoading) &&
                          styles.acceptButtonDisabled,
                        pressed &&
                          !isJobFinished &&
                          !isRejected &&
                          !isActionLoading &&
                          styles.acceptButtonPressed,
                      ]}
                      onPress={() => handleAcceptCandidate(candidate)}
                    >
                      <Text
                        style={[
                          styles.acceptButtonText,
                          (isJobFinished || isRejected || isActionLoading) &&
                            styles.acceptButtonDisabledText,
                        ]}
                      >
                        {isJobFinished
                          ? "Serviço finalizado"
                          : isActionLoading
                            ? "Aguarde..."
                            : isAccepted
                              ? isPaid
                                ? "Abrir chat"
                                : "Pagamento"
                              : isRejected
                                ? "Recusada"
                                : "Aceitar"}
                      </Text>
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
            {isJobFinished
              ? "Chamado encerrado"
              : selectedCandidate && isCandidateAccepted(selectedCandidate)
                ? isCandidatePaid(selectedCandidate)
                  ? "Chat liberado"
                  : "Freelancer aceito"
                : "Antes de aceitar"}
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            {isJobFinished
              ? "Este chamado já foi finalizado. Os candidatos ficam disponíveis apenas para histórico."
              : selectedCandidate && isCandidateAccepted(selectedCandidate)
                ? isCandidatePaid(selectedCandidate)
                  ? "Pagamento confirmado. Clique em Abrir chat para conversar, finalizar e avaliar o serviço."
                  : "Este freelancer já foi aceito. Clique em Pagamento para confirmar o pagamento e liberar o chat."
                : "Analise a mensagem enviada pelo freelancer e o valor proposto. Após o aceite, o próximo passo será revisar o pagamento da taxa da plataforma para liberar o chat."}
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
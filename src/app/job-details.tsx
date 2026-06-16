import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";


const JOB_IMAGE_STORAGE_KEY = "@taskflow:job-images-by-key";

type LocalJobImageRecord = {
  imageUrls?: string[];
};

function normalizeStorageKeyPart(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeJobFingerprintKey(values: {
  title?: unknown;
  localServico?: unknown;
  location?: unknown;
  cidade?: unknown;
  city?: unknown;
  estado?: unknown;
  state?: unknown;
}) {
  return [
    normalizeStorageKeyPart(values.title),
    normalizeStorageKeyPart(values.localServico ?? values.location),
    normalizeStorageKeyPart(values.cidade ?? values.city),
    normalizeStorageKeyPart(values.estado ?? values.state),
  ].join("|");
}

function mergeUniqueImageUrls(...lists: string[][]) {
  return Array.from(
    new Set(
      lists
        .flat()
        .map((url) => String(url ?? "").trim())
        .filter(Boolean)
    )
  );
}

async function loadLocalJobImages(job: Partial<JobDetails>) {
  try {
    const rawStorage = await AsyncStorage.getItem(JOB_IMAGE_STORAGE_KEY);

    if (!rawStorage) {
      return [];
    }

    const storage: Record<string, LocalJobImageRecord> = JSON.parse(rawStorage);
    const possibleKeys = new Set<string>();

    if (job.id) {
      possibleKeys.add(`id:${job.id}`);
    }

    const fingerprintKey = makeJobFingerprintKey({
      title: job.title,
      location: job.location,
      city: job.city,
      state: job.state,
    });

    if (fingerprintKey.replace(/\|/g, "")) {
      possibleKeys.add(`fingerprint:${fingerprintKey}`);
    }

    for (const key of possibleKeys) {
      const record = storage[key];

      if (record?.imageUrls?.length) {
        return record.imageUrls.map((url) => String(url).trim()).filter(Boolean);
      }
    }
  } catch (error) {
    console.log("Erro ao carregar imagens locais do chamado:", error);
  }

  return [];
}


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
  empresaFotoUrl?: string | null;
  empresa_foto_url?: string | null;
  empresaPhotoUrl?: string | null;
  empresa_photo_url?: string | null;
  companyPhotoUrl?: string | null;
  company_photo_url?: string | null;
  companyLogoUrl?: string | null;
  company_logo_url?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
  avatarUrl?: string | null;
  avatar_url?: string | null;
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

  imagemUrl?: string | null;
  imagem_url?: string | null;
  fotoUrl?: string | null;
  foto_url?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;

  imagens?: string[] | string | null;
  images?: string[] | string | null;
  imageUrls?: string[] | string | null;
  image_urls?: string[] | string | null;
  anexos?: string[] | string | null;
  anexosImagem?: string[] | string | null;
  anexos_imagem?: string[] | string | null;
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
  companyPhotoUrl: string;
  vacancies: number;
  latitude: number | null;
  longitude: number | null;
  imageUrls: string[];
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

  const parsed = Number(
    String(value).replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
  );

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

  const quantidade =
    toNumber(chamado.quantidadeProfissionais ?? chamado.quantidade_profissionais) ?? 1;

  const aceitos = toNumber(chamado.totalAceitos ?? chamado.total_aceitos) ?? 0;

  return Math.max(Math.trunc(quantidade - aceitos), 0);
}

function normalizeImageList(value: unknown) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  const text = String(value).trim();

  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => String(item).trim())
        .filter(Boolean);
    }
  } catch {
    // segue para tentativa com separadores
  }

  return text
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getImageUrlsFromApi(chamado: ChamadoApi, fallback: string[] = []) {
  const possibleLists = [
    chamado.imagens,
    chamado.images,
    chamado.imageUrls,
    chamado.image_urls,
    chamado.anexos,
    chamado.anexosImagem,
    chamado.anexos_imagem,
  ];

  const listFromApi = possibleLists
    .map(normalizeImageList)
    .find((list) => list.length > 0);

  if (listFromApi && listFromApi.length > 0) {
    return listFromApi;
  }

  // Não usa campos únicos tipo imageUrl/fotoUrl aqui.
  // Esses campos costumam vir de imagens automáticas de card/categoria.
  // O job-details deve mostrar apenas as URLs adicionadas no create-job.
  return fallback;
}


function pickImageUrl(...values: Array<unknown>) {
  const foundValue = values.find((value) => {
    if (value === null || value === undefined) {
      return false;
    }

    return String(value).trim().length > 0;
  });

  if (!foundValue) {
    return "";
  }

  return String(foundValue).trim();
}

function getCompanyPhotoFromApi(chamado: ChamadoApi, fallback = "") {
  return pickImageUrl(
    chamado.companyPhotoUrl,
    chamado.company_photo_url,
    chamado.empresaPhotoUrl,
    chamado.empresa_photo_url,
    chamado.empresaFotoUrl,
    chamado.empresa_foto_url,
    chamado.companyLogoUrl,
    chamado.company_logo_url,
    chamado.logoUrl,
    chamado.logo_url,
    chamado.avatarUrl,
    chamado.avatar_url,
    fallback
  );
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
    price: formatCurrency(
      chamado.valorEstimado ?? chamado.valor_estimado ?? fallback.rawPrice ?? fallback.price
    ),
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
    companyPhotoUrl: getCompanyPhotoFromApi(chamado, fallback.companyPhotoUrl),
    vacancies,
    latitude: toNumber(chamado.latitude) ?? fallback.latitude,
    longitude: toNumber(chamado.longitude) ?? fallback.longitude,
    imageUrls: getImageUrlsFromApi(chamado, fallback.imageUrls),
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
    companyPhotoUrl?: string;
    empresaFotoUrl?: string;
    companyLogoUrl?: string;
    logoUrl?: string;
    avatarUrl?: string;
    vacancies?: string;
    vagasDisponiveis?: string;
    availableVacancies?: string;
    latitude?: string;
    longitude?: string;
    imageUrl?: string;
    imagemUrl?: string;
    imageUrls?: string;
    imagens?: string;
  }>();

  const { isDark, theme } = useTheme();

  // Não usa imageUrl/imagemUrl individual porque essas imagens podem vir de fallback
  // aleatório/card automático. Aqui entram somente as imagens adicionadas no create-job.
  const initialImages = [
    ...normalizeImageList(firstParam(params.imageUrls)),
    ...normalizeImageList(firstParam(params.imagens)),
  ];

  const initialJob: JobDetails = {
    id: firstParam(params.chamadoId) || firstParam(params.jobId) || firstParam(params.id),
    title: firstParam(params.title) || "Chamado disponível",
    description:
      firstParam(params.description) ||
      "A descrição deste chamado será carregada conforme os dados cadastrados pela empresa.",
    category: firstParam(params.category) || "Serviço",
    price: firstParam(params.price) || "Valor a combinar",
    rawPrice: firstParam(params.rawPrice),
    location: firstParam(params.location) || "Local não informado",
    city: firstParam(params.city) || firstParam(params.distance),
    state: firstParam(params.state),
    time: firstParam(params.time) || "Data e horário a combinar",
    date: "",
    status: firstParam(params.status) || "aberto",
    companyName:
      firstParam(params.companyName) || firstParam(params.company) || "Empresa contratante",
    companyPhotoUrl:
      firstParam(params.companyPhotoUrl) ||
      firstParam(params.empresaFotoUrl) ||
      firstParam(params.companyLogoUrl) ||
      firstParam(params.logoUrl) ||
      firstParam(params.avatarUrl),
    vacancies: Number(
      firstParam(params.vagasDisponiveis) ||
        firstParam(params.availableVacancies) ||
        firstParam(params.vacancies) ||
        "1"
    ),
    latitude: toNumber(firstParam(params.latitude)),
    longitude: toNumber(firstParam(params.longitude)),
    imageUrls: initialImages,
  };

  const [job, setJob] = useState<JobDetails>(initialJob);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loggedUserType, setLoggedUserType] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);

  const hasVacancies = job.vacancies > 0 && !isUnavailableStatus(job.status);
  const canApply = loggedUserType !== "empresa" && hasVacancies && !hasApplied;
  const hasImages = job.imageUrls.length > 0;
  const currentImage = hasImages ? job.imageUrls[selectedImageIndex] : "";

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

      const jobFromApi = chamado ? normalizeJobFromApi(chamado, job) : job;
      const localImages = await loadLocalJobImages(jobFromApi);
      const updatedJob = {
        ...jobFromApi,
        imageUrls: mergeUniqueImageUrls(jobFromApi.imageUrls, localImages),
      };

      if (selectedImageIndex > updatedJob.imageUrls.length - 1) {
        setSelectedImageIndex(0);
      }

      setJob(updatedJob);
    } catch (error) {
      console.log("Erro ao carregar detalhes do chamado:", error);

      const localImages = await loadLocalJobImages(job);

      if (localImages.length > 0) {
        setJob((currentJob) => ({
          ...currentJob,
          imageUrls: mergeUniqueImageUrls(currentJob.imageUrls, localImages),
        }));
      }
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
          candidatura.chamadoId ?? candidatura.chamado_id ?? candidatura.chamado?.id;

        return String(chamadoId) === String(job.id);
      });

      setHasApplied(candidaturaEncontrada);
    } catch (error) {
      console.log("Erro ao verificar candidatura existente:", error);
      setHasApplied(false);
    }
  }

  function goToMap() {
    router.push({
      pathname: "/map",
      params: {
        id: job.id,
        jobId: job.id,
        chamadoId: job.id,
        selectedJobId: job.id,
        title: job.title,
        location: job.location,
        city: job.city,
        state: job.state,
        latitude: job.latitude !== null ? String(job.latitude) : "",
        longitude: job.longitude !== null ? String(job.longitude) : "",
      },
    });
  }

  function openImageModal(index = selectedImageIndex) {
    if (!hasImages) {
      return;
    }

    setSelectedImageIndex(index);
    setIsImageModalVisible(true);
  }

  function goToPreviousImage() {
    if (!hasImages) {
      return;
    }

    setSelectedImageIndex((currentIndex) => {
      if (currentIndex === 0) {
        return job.imageUrls.length - 1;
      }

      return currentIndex - 1;
    });
  }

  function goToNextImage() {
    if (!hasImages) {
      return;
    }

    setSelectedImageIndex((currentIndex) => {
      if (currentIndex >= job.imageUrls.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });
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

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Detalhes do chamado
        </Text>

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
          {hasImages ? (
            <>
              <Image
                source={{ uri: currentImage }}
                style={styles.heroImage}
                resizeMode="cover"
              />

              <View style={styles.heroOverlay}>
                <Text style={styles.heroOverlayTitle}>Imagens do chamado</Text>

                <Text style={styles.heroOverlaySubtitle}>
                  {selectedImageIndex + 1}/{job.imageUrls.length}
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.expandImageButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => openImageModal()}
              >
                <Text style={styles.expandImageButtonText}>Expandir imagem</Text>
              </Pressable>

              {job.imageUrls.length > 1 && (
                <View style={styles.heroArrowsArea}>
                  <Pressable
                    style={styles.heroArrowButton}
                    onPress={goToPreviousImage}
                  >
                    <Text style={styles.heroArrowText}>‹</Text>
                  </Pressable>

                  <Pressable
                    style={styles.heroArrowButton}
                    onPress={goToNextImage}
                  >
                    <Text style={styles.heroArrowText}>›</Text>
                  </Pressable>
                </View>
              )}
            </>
          ) : (
            <>
              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Local do chamado
              </Text>

              <Text
                style={[
                  styles.noImageText,
                  { color: theme.textSecondary },
                ]}
              >
                A empresa ainda não adicionou imagens.
              </Text>
            </>
          )}
        </View>

        <View style={styles.titleArea}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: "rgba(11,87,208,0.14)" },
              ]}
            >
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

        <View
          style={[
            styles.infoCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoEmoji}>📍</Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Localização
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {job.city ? `${job.city} - ` : ""}
                {job.location}
                {job.state ? `/${job.state}` : ""}
              </Text>

              <View style={styles.locationButtonsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.mapButton,
                    pressed && { opacity: 0.75 },
                  ]}
                  onPress={goToMap}
                >
                  <Text style={styles.mapButtonText}>Ver no mapa</Text>
                </Pressable>

                {hasImages && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.imageMiniButton,
                      pressed && { opacity: 0.75 },
                    ]}
                    onPress={() => openImageModal()}
                  >
                    <Text style={styles.imageMiniButtonText}>
                      Ver imagens
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text style={styles.infoEmoji}>🕒</Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Data e horário
              </Text>
              <Text style={[styles.infoValue, { color: theme.text }]}>{job.time}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Descrição do serviço
        </Text>

        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {job.description}
        </Text>

        <View
          style={[
            styles.companyCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          {job.companyPhotoUrl ? (
            <Image
              source={{ uri: job.companyPhotoUrl }}
              style={styles.companyAvatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.companyAvatar}>
              <Text style={styles.companyAvatarText}>TF</Text>
            </View>
          )}

          <View style={styles.companyTextArea}>
            <Text style={[styles.companyName, { color: theme.text }]}>
              {job.companyName}
            </Text>
            <Text style={[styles.companySubtitle, { color: theme.textSecondary }]}>
              Empresa responsável pelo chamado
            </Text>
          </View>
        </View>

        {isLoading && (
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Atualizando dados pela API...
          </Text>
        )}

        {loggedUserType === "empresa" ? (
          <View
            style={[
              styles.noticeBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
              Você está logado como empresa. Para se candidatar, acesse com perfil
              freelancer.
            </Text>
          </View>
        ) : hasApplied ? (
          <View
            style={[
              styles.noticeBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.noticeTitle, { color: theme.text }]}>
              Candidatura já enviada
            </Text>
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
              Aguarde a resposta da empresa para continuar o atendimento.
            </Text>
          </View>
        ) : !hasVacancies ? (
          <View
            style={[
              styles.noticeBox,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.noticeText, { color: theme.textSecondary }]}>
              Este chamado não possui vagas disponíveis no momento.
            </Text>
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

      <Modal
        visible={isImageModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalCounter}>
              {selectedImageIndex + 1}/{job.imageUrls.length}
            </Text>

            <Pressable
              style={styles.modalCloseButton}
              onPress={() => setIsImageModalVisible(false)}
            >
              <Text style={styles.modalCloseText}>×</Text>
            </Pressable>
          </View>

          <View style={styles.modalImageArea}>
            {job.imageUrls.length > 1 && (
              <Pressable
                style={[styles.modalArrowButton, styles.modalArrowLeft]}
                onPress={goToPreviousImage}
              >
                <Text style={styles.modalArrowText}>‹</Text>
              </Pressable>
            )}

            {currentImage ? (
              <Image
                source={{ uri: currentImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ) : null}

            {job.imageUrls.length > 1 && (
              <Pressable
                style={[styles.modalArrowButton, styles.modalArrowRight]}
                onPress={goToNextImage}
              >
                <Text style={styles.modalArrowText}>›</Text>
              </Pressable>
            )}
          </View>

          <Text style={styles.modalHint}>
            Imagens adicionadas pela empresa para ajudar no entendimento do serviço.
          </Text>
        </View>
      </Modal>
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
    height: 210,
    borderWidth: 1,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },

  heroImage: {
    width: "100%",
    height: "100%",
  },

  heroOverlay: {
    position: "absolute",
    left: 14,
    top: 14,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(2,6,23,0.68)",
  },

  heroOverlayTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  heroOverlaySubtitle: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },

  expandImageButton: {
    position: "absolute",
    right: 14,
    bottom: 14,
    minHeight: 36,
    borderRadius: 999,
    paddingHorizontal: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  expandImageButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  heroArrowsArea: {
    position: "absolute",
    left: 14,
    right: 14,
    top: "50%",
    marginTop: -20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  heroArrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(2,6,23,0.62)",
    alignItems: "center",
    justifyContent: "center",
  },

  heroArrowText: {
    color: colors.white,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: "700",
  },

  heroIcon: {
    fontSize: 54,
    marginBottom: 8,
  },

  heroPinImage: {
    width: 76,
    height: 76,
    marginBottom: 8,
  },

  heroText: {
    fontSize: 13,
    fontWeight: "800",
  },

  noImageText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
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
    alignItems: "flex-start",
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

  infoPinImage: {
    width: 24,
    height: 24,
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

  locationButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },

  mapButton: {
    alignSelf: "flex-start",
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  mapButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  imageMiniButton: {
    alignSelf: "flex-start",
    minHeight: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(11,87,208,0.12)",
    borderWidth: 1,
    borderColor: "rgba(11,87,208,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },

  imageMiniButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
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

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.96)",
    paddingTop: 46,
    paddingHorizontal: 18,
    paddingBottom: 26,
  },

  modalHeader: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  modalCounter: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
  },

  modalCloseButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "700",
  },

  modalImageArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  modalImage: {
    width: "100%",
    height: "86%",
  },

  modalArrowButton: {
    position: "absolute",
    zIndex: 5,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalArrowLeft: {
    left: 0,
  },

  modalArrowRight: {
    right: 0,
  },

  modalArrowText: {
    color: colors.white,
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "700",
  },

  modalHint: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },
});
import { useCallback, useMemo, useState } from "react";
import {
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
import AssignmentIcon from "../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/freelancerProfile";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";
import { API_BASE_URL, apiGet } from "@/services/api";

type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  category?: string;
  clientName?: string;
  date?: string;
  link?: string;
};

const skillFilters = [
  "Todos",
  "Eventos",
  "Fotografia",
  "Manutenção",
  "Limpeza",
  "Tecnologia",
  "Serviços gerais",
];

const defaultPortfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Portfólio não preenchido",
    description:
      "Quando o freelancer adicionar experiências, elas aparecerão aqui.",
  },
];

const defaultReviews = [
  {
    id: "1",
    company: "Sem avaliações",
    rating: 0,
    comment: "As avaliações recebidas pelo freelancer aparecerão aqui.",
  },
];

const REVIEWS_STORAGE_KEY = "@taskflow:reviews";
const PORTFOLIO_STORAGE_KEY = "@taskflow:portfolio-items";
const PORTFOLIO_COMPAT_STORAGE_KEYS = [
  PORTFOLIO_STORAGE_KEY,
  "@taskflow:portfolio",
  "portfolioItems",
];

type ReviewItem = {
  id: string;
  company: string;
  rating: number;
  comment: string;
};

type LocalPortfolioPayload = {
  id?: string;
  title?: string;
  description?: string;
  category?: string;
  clientName?: string;
  date?: string;
  link?: string;
  freelancerId?: string;
  freelancerUserId?: string;
  usuarioId?: string;
  userId?: string;
  freelancerName?: string;
};

type RatingStats = {
  media: number;
  total: number;
  servicosConcluidos: number;
  avaliacoes: ReviewItem[];
};

type AvaliacaoApiItem = {
  id?: number | string | null;
  nomeAvaliador?: string | null;
  avaliadorNome?: string | null;
  empresa?: string | null;
  company?: string | null;
  nota?: number | string | null;
  rating?: number | string | null;
  comentario?: string | null;
  comment?: string | null;
};

type AvaliacoesApiResponse = {
  media?: number | string | null;
  average?: number | string | null;
  total?: number | string | null;
  quantidade?: number | string | null;
  servicosConcluidos?: number | string | null;
  servicos_concluidos?: number | string | null;
  completedJobs?: number | string | null;
  totalServicos?: number | string | null;
  avaliacoes?: AvaliacaoApiItem[];
  data?: AvaliacaoApiItem[];
  reviews?: AvaliacaoApiItem[];
};

type LocalReviewPayload = {
  id?: string;
  freelancerId?: string;
  ratedUserName?: string;
  ratedUserType?: string;
  rating?: number;
  comment?: string;
  companyName?: string;
};

type ResolvedFreelancerIdentity = {
  name?: string;
  photoUrl?: string;
  about?: string;
};

type AnyRecord = Record<string, any>;

const NAME_FIELDS = [
  "name",
  "nome",
  "nomeCompleto",
  "nome_completo",
  "fullName",
  "full_name",
  "candidateName",
  "freelancerName",
];

const PHOTO_FIELDS = [
  "photoUrl",
  "photoURL",
  "photo",
  "profilePhoto",
  "profile_photo",
  "profilePhotoUrl",
  "profile_photo_url",
  "fotoPerfil",
  "foto_perfil",
  "photo_url",
  "fotoUrl",
  "fotoURL",
  "foto_url",
  "foto",
  "imagem",
  "imageUrl",
  "imageURL",
  "image_url",
  "imageUri",
  "imageURI",
  "profileImage",
  "profileImageUri",
  "profilePicture",
  "avatarUrl",
  "avatarURL",
  "avatar_url",
  "avatarUri",
  "picture",
  "pictureUrl",
  "picture_url",
  "logo",
  "logoUrl",
  "logo_url",
  "uri",
];

const ABOUT_FIELDS = [
  "about",
  "sobre",
  "bio",
  "descricao",
  "descrição",
  "description",
  "experiencia",
  "experiência",
];

const ID_FIELDS = [
  "id",
  "usuarioId",
  "idUsuario",
  "id_usuario",
  "userId",
  "idUser",
  "freelancerId",
  "idFreelancer",
  "id_freelancer",
  "perfilId",
  "profileId",
  "idPerfil",
  "id_perfil",
  "freelancerPerfilId",
  "candidateId",
  "candidateUserId",
];

function isRecord(value: unknown): value is AnyRecord {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function normalizePhotoUrl(value?: string) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return "";
  }

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("file://") ||
    trimmedValue.startsWith("data:image") ||
    trimmedValue.startsWith("blob:")
  ) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith("/")) {
    return `${API_BASE_URL}${trimmedValue}`;
  }

  return `${API_BASE_URL}/${trimmedValue}`;
}

function getStringField(source: unknown, fields: string[]) {
  if (!isRecord(source)) {
    return "";
  }

  for (const field of fields) {
    const value = source[field];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (isRecord(value) && typeof value.uri === "string" && value.uri.trim()) {
      return value.uri.trim();
    }
  }

  return "";
}

function getObjectIds(source: unknown) {
  if (!isRecord(source)) {
    return [];
  }

  return ID_FIELDS.map((field) => source[field])
    .filter((value) => value !== null && value !== undefined && value !== "")
    .map((value) => String(value));
}

function collectObjects(value: unknown, result: AnyRecord[] = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectObjects(item, result));
    return result;
  }

  if (!isRecord(value)) {
    return result;
  }

  result.push(value);

  Object.values(value).forEach((child) => {
    if (Array.isArray(child) || isRecord(child)) {
      collectObjects(child, result);
    }
  });

  return result;
}

function extractIdentityFromObjects(
  value: unknown,
  validIds: Set<string>,
  candidateNameNormalized: string,
): ResolvedFreelancerIdentity | null {
  const objects = collectObjects(value);

  for (const object of objects) {
    const objectName = getStringField(object, NAME_FIELDS);
    const objectIds = getObjectIds(object);
    const matchesById = objectIds.some((id) => validIds.has(id));
    const matchesByName = objectName
      ? normalizeName(objectName) === candidateNameNormalized
      : false;

    if (!matchesById && !matchesByName) {
      continue;
    }

    const photoUrl = normalizePhotoUrl(getStringField(object, PHOTO_FIELDS));
    const about = getStringField(object, ABOUT_FIELDS);

    if (objectName || photoUrl || about) {
      return {
        name: objectName || undefined,
        photoUrl: photoUrl || undefined,
        about: about || undefined,
      };
    }
  }

  return null;
}

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function parseNumberValue(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  const text = String(value)
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/[^0-9,.-]/g, "")
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

  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseRatingText(value?: string | string[]) {
  const text = getParamValue(value, "");

  if (!text || text.toLowerCase().includes("sem")) {
    return 0;
  }

  return parseNumberValue(text, 0);
}

function formatRating(value: number) {
  if (!value || value <= 0) {
    return "Sem avaliações";
  }

  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function normalizeName(value?: string | null) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function getUniquePositiveIds(values: Array<string | string[] | undefined>) {
  const ids = values
    .map((value) => Number(getParamValue(value, "")))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => String(value));

  return [...new Set(ids)];
}

function normalizeReviewsResponse(response: AvaliacoesApiResponse): RatingStats {
  const apiReviews = response.avaliacoes ?? response.data ?? response.reviews ?? [];
  const totalFromResponse = parseNumberValue(
    response.total ?? response.quantidade,
    apiReviews.length
  );

  const reviews = apiReviews.map((review, index) => {
    const rating = parseNumberValue(review.nota ?? review.rating, 0);

    return {
      id: String(review.id ?? index + 1),
      company:
        review.nomeAvaliador ??
        review.avaliadorNome ??
        review.empresa ??
        review.company ??
        "Empresa",
      rating,
      comment:
        review.comentario ??
        review.comment ??
        "Avaliação sem comentário.",
    };
  });

  const mediaFromResponse = parseNumberValue(
    response.media ?? response.average,
    0
  );

  const media = mediaFromResponse > 0
    ? mediaFromResponse
    : reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  const servicosConcluidos = parseNumberValue(
    response.servicosConcluidos ??
      response.servicos_concluidos ??
      response.completedJobs ??
      response.totalServicos,
    totalFromResponse,
  );

  return {
    media: Number(media.toFixed(1)),
    total: totalFromResponse,
    servicosConcluidos,
    avaliacoes: reviews,
  };
}

export default function FreelancerProfileScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    jobId?: string | string[];
    candidaturaId?: string | string[];
    jobTitle?: string | string[];
    jobCategory?: string | string[];
    jobPrice?: string | string[];
    jobLocation?: string | string[];
    jobTime?: string | string[];
    candidateId?: string | string[];
    candidateName?: string | string[];
    candidateEmail?: string | string[];
    candidateRating?: string | string[];
    candidateReviews?: string | string[];
    candidateAvaliacoes?: string | string[];
    candidateCompletedJobs?: string | string[];
    candidateServices?: string | string[];
    totalReviews?: string | string[];
    reviews?: string | string[];
    avaliacoes?: string | string[];
    completedJobs?: string | string[];
    completedServices?: string | string[];
    servicosConcluidos?: string | string[];
    candidatePhotoUrl?: string | string[];
    freelancerId?: string | string[];
    freelancerPerfilId?: string | string[];
    candidateFreelancerId?: string | string[];
    candidateUserId?: string | string[];
    freelancerUserId?: string | string[];
    freelancerUsuarioId?: string | string[];
    usuarioId?: string | string[];
    userId?: string | string[];
    avaliadoId?: string | string[];
    freelancerPhotoUrl?: string | string[];
    photoUrl?: string | string[];
    fotoUrl?: string | string[];
    avatarUrl?: string | string[];
    avatarUri?: string | string[];
    candidatePhoto?: string | string[];
    foto?: string | string[];
    imageUrl?: string | string[];
    imageUri?: string | string[];
    profileImage?: string | string[];
    profileImageUri?: string | string[];
    profilePicture?: string | string[];
    candidatePrice?: string | string[];
  }>();

  const { isDark, theme } = useTheme();

  const candidateRatingFromParams = parseRatingText(params.candidateRating);
  const candidateReviewsFromParams = parseNumberValue(
    getParamValue(params.candidateReviews) ||
      getParamValue(params.candidateAvaliacoes) ||
      getParamValue(params.totalReviews) ||
      getParamValue(params.reviews) ||
      getParamValue(params.avaliacoes),
    0,
  );
  const candidateCompletedJobsFromParams = parseNumberValue(
    getParamValue(params.candidateCompletedJobs) ||
      getParamValue(params.candidateServices) ||
      getParamValue(params.completedJobs) ||
      getParamValue(params.completedServices) ||
      getParamValue(params.servicosConcluidos),
    0,
  );
  const hasCandidateStatsFromParams = Boolean(
    getParamValue(params.candidateRating) ||
      getParamValue(params.candidateReviews) ||
      getParamValue(params.candidateAvaliacoes) ||
      getParamValue(params.totalReviews) ||
      getParamValue(params.reviews) ||
      getParamValue(params.avaliacoes) ||
      getParamValue(params.candidateCompletedJobs) ||
      getParamValue(params.candidateServices) ||
      getParamValue(params.completedJobs) ||
      getParamValue(params.completedServices) ||
      getParamValue(params.servicosConcluidos),
  );

  const [ratingStats, setRatingStats] = useState<RatingStats>({
    media: candidateRatingFromParams,
    total: candidateReviewsFromParams,
    servicosConcluidos: candidateCompletedJobsFromParams,
    avaliacoes: [],
  });
  const [savedPortfolioItems, setSavedPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedPortfolioFilter, setSelectedPortfolioFilter] = useState("Todos");
  const [photoLoadFailed, setPhotoLoadFailed] = useState(false);

  const jobTitle = getParamValue(params.jobTitle, "Chamado não informado");
  const jobCategory = getParamValue(params.jobCategory, "Categoria não informada");
  const jobPrice = getParamValue(params.jobPrice, "Valor não informado");
  const jobLocation = getParamValue(params.jobLocation, "Local não informado");
  const jobTime = getParamValue(params.jobTime, "Horário não informado");

  const candidateName = getParamValue(
    params.candidateName,
    "Freelancer não informado"
  );
  const candidateEmail = getParamValue(params.candidateEmail, "");
  const candidateRating = getParamValue(params.candidateRating, "Sem avaliações");
  const candidatePhotoUrl =
    getParamValue(params.candidatePhotoUrl) ||
    getParamValue(params.candidatePhoto) ||
    getParamValue(params.freelancerPhotoUrl) ||
    getParamValue(params.photoUrl) ||
    getParamValue(params.fotoUrl) ||
    getParamValue(params.foto) ||
    getParamValue(params.imageUrl) ||
    getParamValue(params.imageUri) ||
    getParamValue(params.profileImage) ||
    getParamValue(params.profileImageUri) ||
    getParamValue(params.profilePicture) ||
    getParamValue(params.avatarUrl) ||
    getParamValue(params.avatarUri) ||
    "";
  const candidatePrice = getParamValue(params.candidatePrice, jobPrice);

  const [resolvedCandidateName, setResolvedCandidateName] = useState(candidateName);
  const [resolvedCandidatePhotoUrl, setResolvedCandidatePhotoUrl] = useState(normalizePhotoUrl(candidatePhotoUrl));
  const [resolvedAboutText, setResolvedAboutText] = useState("");

  const userIdCandidates = useMemo(
    () =>
      getUniquePositiveIds([
        params.candidateUserId,
        params.freelancerUserId,
        params.freelancerUsuarioId,
        params.usuarioId,
        params.userId,
        params.avaliadoId,
      ]),
    [
      params.candidateUserId,
      params.freelancerUserId,
      params.freelancerUsuarioId,
      params.usuarioId,
      params.userId,
      params.avaliadoId,
    ]
  );

  const freelancerIdCandidates = useMemo(
    () =>
      getUniquePositiveIds([
        params.freelancerId,
        params.freelancerPerfilId,
        params.candidateFreelancerId,
      ]),
    [
      params.freelancerId,
      params.freelancerPerfilId,
      params.candidateFreelancerId,
    ]
  );

  useFocusEffect(
    useCallback(() => {
      loadFreelancerIdentity();
      loadFreelancerReviews();
      loadFreelancerPortfolio();
    }, [
      candidateName,
      candidatePhotoUrl,
      userIdCandidates.join("|"),
      freelancerIdCandidates.join("|"),
      hasCandidateStatsFromParams,
      candidateRatingFromParams,
      candidateReviewsFromParams,
      candidateCompletedJobsFromParams,
    ])
  );

  async function loadFreelancerIdentity() {
    const validIds = new Set([...userIdCandidates, ...freelancerIdCandidates]);
    const candidateNameNormalized = normalizeName(candidateName);

    let identity: ResolvedFreelancerIdentity = {
      name: candidateName,
      photoUrl: normalizePhotoUrl(candidatePhotoUrl),
    };

    const apiEndpoints = [
      ...userIdCandidates.map((id) => `/api/Usuarios/${id}`),
      ...userIdCandidates.map((id) => `/api/Usuarios/usuario/${id}`),
      ...userIdCandidates.map((id) => `/api/Freelancers/usuario/${id}`),
      ...freelancerIdCandidates.map((id) => `/api/Freelancers/${id}`),
      ...freelancerIdCandidates.map((id) => `/api/Freelancers/perfil/${id}`),
      ...freelancerIdCandidates.map((id) => `/api/Usuarios/${id}`),
    ];

    for (const endpoint of [...new Set(apiEndpoints)]) {
      try {
        const response = await apiGet<unknown>(endpoint);
        const foundIdentity = extractIdentityFromObjects(
          response,
          validIds,
          candidateNameNormalized,
        );

        if (foundIdentity) {
          identity = {
            name: foundIdentity.name || identity.name,
            photoUrl: foundIdentity.photoUrl || identity.photoUrl,
            about: foundIdentity.about || identity.about,
          };

          if (identity.photoUrl) {
            break;
          }
        }
      } catch (error) {
        console.log(`Não foi possível carregar dados do freelancer em ${endpoint}:`, error);
      }
    }

    try {
      const storageKeys = await AsyncStorage.getAllKeys();
      const usefulKeys = storageKeys.filter((key) =>
        /taskflow|freelancer|usuario|usuário|user|profile|perfil|auth|login|logged/i.test(key),
      );

      for (const key of usefulKeys) {
        const storedValue = await AsyncStorage.getItem(key);

        if (!storedValue) {
          continue;
        }

        try {
          const parsedValue = JSON.parse(storedValue);
          const foundIdentity = extractIdentityFromObjects(
            parsedValue,
            validIds,
            candidateNameNormalized,
          );

          if (!foundIdentity) {
            continue;
          }

          identity = {
            name: foundIdentity.name || identity.name,
            photoUrl: foundIdentity.photoUrl || identity.photoUrl,
            about: foundIdentity.about || identity.about,
          };

          if (identity.photoUrl) {
            break;
          }
        } catch {
          // Algumas chaves do storage podem ser texto simples. Pode ignorar.
        }
      }
    } catch (error) {
      console.log("Erro ao buscar foto do freelancer no storage:", error);
    }

    setResolvedCandidateName(identity.name || candidateName);
    setResolvedCandidatePhotoUrl(identity.photoUrl || normalizePhotoUrl(candidatePhotoUrl));
    setResolvedAboutText(identity.about || "");
    setPhotoLoadFailed(false);
  }

  function normalizePortfolioItem(item: LocalPortfolioPayload, index: number): PortfolioItem {
    const details = [item.category, item.clientName, item.date]
      .filter(Boolean)
      .join(" • ");

    return {
      id: String(item.id ?? `portfolio-${index}`),
      title: String(item.title || "Item do portfólio"),
      description: String(item.description || "Descrição não informada."),
      category: details,
      clientName: item.clientName,
      date: item.date,
      link: item.link,
    };
  }

  async function loadFreelancerPortfolio() {
    try {
      let items: LocalPortfolioPayload[] = [];

      for (const key of PORTFOLIO_COMPAT_STORAGE_KEYS) {
        const storedItems = await AsyncStorage.getItem(key);

        if (!storedItems) {
          continue;
        }

        const parsedItems = JSON.parse(storedItems);

        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          items = parsedItems;
          break;
        }
      }

      if (items.length === 0) {
        setSavedPortfolioItems([]);
        return;
      }

      const candidateNameNormalized = normalizeName(resolvedCandidateName || candidateName);
      const validIds = new Set([...userIdCandidates, ...freelancerIdCandidates]);

      const matchedItems = items.filter((item) => {
        const possibleIds = [
          item.freelancerId,
          item.freelancerUserId,
          item.usuarioId,
          item.userId,
        ]
          .filter(Boolean)
          .map((value) => String(value));

        const matchesById = possibleIds.some((id) => validIds.has(id));
        const matchesByName = item.freelancerName
          ? normalizeName(item.freelancerName) === candidateNameNormalized
          : false;

        return matchesById || matchesByName;
      });

      const itemsToDisplay = matchedItems;

      setSavedPortfolioItems(
        itemsToDisplay
          .slice()
          .reverse()
          .map((item, index) => normalizePortfolioItem(item, index))
      );
    } catch (error) {
      console.log("Erro ao carregar portfólio local:", error);
      setSavedPortfolioItems([]);
    }
  }

  async function loadLocalReviews() {
    try {
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews: LocalReviewPayload[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      const candidateNameNormalized = normalizeName(resolvedCandidateName || candidateName);
      const validIds = new Set([...userIdCandidates, ...freelancerIdCandidates]);

      const matchedReviews = reviews.filter((review) => {
        if (review.ratedUserType !== "freelancer") {
          return false;
        }

        const matchesById = review.freelancerId
          ? validIds.has(String(review.freelancerId))
          : false;

        const matchesByName = review.ratedUserName
          ? normalizeName(review.ratedUserName) === candidateNameNormalized
          : false;

        return matchesById || matchesByName;
      });

      if (matchedReviews.length === 0) {
        return false;
      }

      const reviewsMapped = matchedReviews.map((review, index) => ({
        id: review.id ?? `local-${index}`,
        company: review.companyName ?? "Empresa",
        rating: Number(review.rating ?? 0),
        comment: review.comment ?? "Avaliação sem comentário.",
      }));

      const media =
        reviewsMapped.reduce((sum, review) => sum + review.rating, 0) /
        reviewsMapped.length;

      setRatingStats({
        media: Number(media.toFixed(1)),
        total: reviewsMapped.length,
        servicosConcluidos: reviewsMapped.length,
        avaliacoes: reviewsMapped,
      });

      return true;
    } catch (error) {
      console.log("Erro ao carregar avaliações locais:", error);
      return false;
    }
  }

  async function loadFreelancerReviews() {
    if (hasCandidateStatsFromParams) {
      setRatingStats({
        media: candidateRatingFromParams,
        total: candidateReviewsFromParams,
        servicosConcluidos: candidateCompletedJobsFromParams,
        avaliacoes: [],
      });
      return;
    }

    const endpoints = [
      ...userIdCandidates.map((id) => `/api/Avaliacoes/usuario/${id}`),
      ...freelancerIdCandidates.map((id) => `/api/Avaliacoes/freelancer/${id}`),
      ...freelancerIdCandidates.map((id) => `/api/Avaliacoes/usuario/${id}`),
    ];

    let firstSuccessfulResponse: RatingStats | null = null;

    for (const endpoint of endpoints) {
      try {
        const response = await apiGet<AvaliacoesApiResponse>(endpoint);
        const stats = normalizeReviewsResponse(response);

        if (!firstSuccessfulResponse) {
          firstSuccessfulResponse = stats;
        }

        if (stats.total > 0) {
          setRatingStats(stats);
          return;
        }
      } catch (error) {
        console.log(`Não foi possível carregar avaliações em ${endpoint}:`, error);
      }
    }

    const loadedLocalReviews = await loadLocalReviews();

    if (loadedLocalReviews) {
      return;
    }

    if (firstSuccessfulResponse) {
      setRatingStats(firstSuccessfulResponse);
      return;
    }

    setRatingStats({
      media: parseRatingText(candidateRating),
      total: candidateReviewsFromParams,
      servicosConcluidos: candidateCompletedJobsFromParams,
      avaliacoes: [],
    });
  }

  function handleAcceptCandidate() {
    router.push({
      pathname: "/payment",
      params: {
        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,
        candidateName: resolvedCandidateName,
        candidateEmail,
        candidateRating: ratingDisplayText,
        candidatePhotoUrl: resolvedCandidatePhotoUrl,
        candidatePrice,
        freelancerId: freelancerIdCandidates[0] ?? "",
        candidateUserId: userIdCandidates[0] ?? "",
      },
    });
  }

  function getAvatarInitial() {
    const name = resolvedCandidateName || candidateName;

    if (!name || name === "Freelancer não informado") {
      return "?";
    }

    return name.charAt(0).toUpperCase();
  }

  const displayedReviews = ratingStats.avaliacoes.length > 0
    ? ratingStats.avaliacoes.slice(0, 3)
    : defaultReviews;

  const displayedPortfolioItems: PortfolioItem[] = savedPortfolioItems.length > 0
    ? savedPortfolioItems
    : defaultPortfolioItems;

  const filteredPortfolioItems = useMemo(() => {
    if (selectedPortfolioFilter === "Todos" || savedPortfolioItems.length === 0) {
      return displayedPortfolioItems;
    }

    const selectedCategory = normalizeName(selectedPortfolioFilter);

    return savedPortfolioItems.filter((item) =>
      normalizeName(item.category).includes(selectedCategory)
    );
  }, [displayedPortfolioItems, savedPortfolioItems, selectedPortfolioFilter]);

  const ratingDisplayText = ratingStats.media > 0
    ? formatRating(ratingStats.media)
    : formatRating(parseRatingText(candidateRating));

  const totalReviews = ratingStats.total;
  const totalServices = ratingStats.servicosConcluidos;
  const servicesText = `${totalServices} ${totalServices === 1 ? "serviço concluído" : "serviços concluídos"}`;
  const satisfactionText = ratingStats.media > 0
    ? `${Math.round((ratingStats.media / 5) * 100)}%`
    : "0%";
  const notaStatText = ratingStats.media > 0 ? ratingDisplayText : "--";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
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

        <Text style={[styles.headerTitle, { color: theme.text }]}>Perfil do freelancer</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: theme.background }}
      >
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          {resolvedCandidatePhotoUrl && !photoLoadFailed ? (
            <Image
              source={{ uri: resolvedCandidatePhotoUrl }}
              style={styles.avatar}
              resizeMode="cover"
              onError={() => setPhotoLoadFailed(true)}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getAvatarInitial()}</Text>
            </View>
          )}

          <Text style={[styles.name, { color: theme.text }]}>{resolvedCandidateName}</Text>

          <Text style={[styles.role, { color: theme.textSecondary }]}>Freelancer cadastrado</Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>

            <Text style={[styles.ratingText, { color: theme.text }]}>{ratingDisplayText}</Text>

            <Text style={[styles.ratingSubtext, { color: theme.textSecondary }]}>• {servicesText}</Text>
          </View>

          <View
            style={[
              styles.statsArea,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{totalServices}</Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Serviços</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{satisfactionText}</Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Satisfação</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{notaStatText}</Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Nota</Text>
            </View>
          </View>
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Candidatura para o chamado</Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Chamado</Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>{jobTitle}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Categoria</Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>{jobCategory}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Valor proposto</Text>

            <Text style={styles.priceValue}>{candidatePrice}</Text>
          </View>
        </View>

        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Sobre o profissional</Text>

          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            {resolvedAboutText || "Quando o freelancer preencher a descrição do perfil, ela aparecerá aqui."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Habilidades</Text>

          <View style={styles.skillsArea}>
            {skillFilters.map((skill) => {
              const isSelected = selectedPortfolioFilter === skill;

              return (
                <Pressable
                  key={skill}
                  style={({ pressed }) => [
                    styles.skillChip,
                    {
                      backgroundColor: isSelected ? theme.primary : theme.inputBackground,
                      borderColor: isSelected ? theme.primary : theme.border,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                  onPress={() => setSelectedPortfolioFilter(skill)}
                >
                  <Text
                    style={[
                      styles.skillText,
                      { color: isSelected ? colors.white : theme.text },
                    ]}
                  >
                    {skill}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Portfólio</Text>

          <View style={styles.portfolioList}>
            {filteredPortfolioItems.length === 0 ? (
              <View
                style={[
                  styles.portfolioCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.portfolioIconBox,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.white,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <AssignmentIcon
                    width={24}
                    height={24}
                    color={colors.black}
                    fill={colors.black}
                  />
                </View>

                <View style={styles.portfolioTextArea}>
                  <Text style={[styles.portfolioTitle, { color: theme.text }]}>Nenhum item nessa habilidade</Text>
                  <Text style={[styles.portfolioDescription, { color: theme.textSecondary }]}>
                    Selecione Todos ou cadastre um trabalho em {selectedPortfolioFilter}.
                  </Text>
                </View>
              </View>
            ) : (
              filteredPortfolioItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.portfolioCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.portfolioIconBox,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.white,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <AssignmentIcon
                    width={24}
                    height={24}
                    color={colors.black}
                    fill={colors.black}
                  />
                </View>

                <View style={styles.portfolioTextArea}>
                  <Text style={[styles.portfolioTitle, { color: theme.text }]}>{item.title}</Text>

                  {item.category ? (
                    <Text style={[styles.portfolioDescription, { color: theme.primary }]}>
                      {item.category}
                    </Text>
                  ) : null}

                  <Text style={[styles.portfolioDescription, { color: theme.textSecondary }]}>
                    {item.description}
                  </Text>

                  {item.link ? (
                    <Text
                      style={[styles.portfolioDescription, { color: theme.textSecondary }]}
                      numberOfLines={1}
                    >
                      🔗 {item.link}
                    </Text>
                  ) : null}
                </View>
              </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Avaliações recentes</Text>

          <View style={styles.reviewsList}>
            {displayedReviews.map((review) => (
              <View
                key={review.id}
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewCompany, { color: theme.text }]}>{review.company}</Text>

                  <Text style={styles.reviewRating}>⭐ {formatRating(review.rating)}</Text>
                </View>

                <Text style={[styles.reviewComment, { color: theme.textSecondary }]}>{review.comment}</Text>
              </View>
            ))}
          </View>
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
          <Text style={[styles.infoTitle, { color: theme.text }]}>Segurança na contratação</Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>O chat só será liberado após a empresa aceitar o candidato e confirmar a taxa da plataforma.</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.acceptButton,
            pressed && styles.acceptButtonPressed,
          ]}
          onPress={handleAcceptCandidate}
        >
          <Text style={styles.acceptButtonText}>Aceitar candidato</Text>
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
          onPress={() => router.back()}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Voltar aos candidatos</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

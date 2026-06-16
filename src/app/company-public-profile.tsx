import { useEffect, useState } from "react";
import {
  Image,
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
import { API_BASE_URL, apiGet } from "@/services/api";
import { styles } from "@/app/styles/companyPublicProfile";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type CompanyReview = {
  id: string;
  freelancer: string;
  freelancerId?: string;
  photoUrl?: string;
  rating: number;
  comment: string;
  date: string;
};

type CompanyPublicProfile = {
  id?: string;
  name: string;
  location: string;
  rating?: string;
  reviewsCount?: number;
  totalJobs?: number;
  completedJobs?: number;
  satisfactionRate?: string;
  about?: string;
  tags: string[];
  isVerified: boolean;
  averageResponseTime?: string;
  reviews: CompanyReview[];
  logoUrl?: string;
};

type AvaliacaoApi = {
  id?: number | string;
  nota?: number | string;
  rating?: number | string;
  comentario?: string | null;
  comment?: string | null;
  dataAvaliacao?: string;
  data_avaliacao?: string;
  criadaEm?: string;
  criada_em?: string;
  avaliadorId?: number | string;
  avaliador_id?: number | string;
  idAvaliador?: number | string;
  id_avaliador?: number | string;
  freelancerId?: number | string;
  freelancer_id?: number | string;
  idFreelancer?: number | string;
  id_freelancer?: number | string;
  avaliadorNome?: string;
  avaliador_nome?: string;
  freelancerNome?: string;
  freelancer_nome?: string;
  avaliadorFotoUrl?: string;
  avaliador_foto_url?: string;
  freelancerFotoUrl?: string;
  freelancer_foto_url?: string;
  fotoUrl?: string;
  foto_url?: string;
  photoUrl?: string;
  photo_url?: string;
  avatarUrl?: string;
  avatar_url?: string;
  usuarioAvaliador?: {
    id?: number | string;
    nome?: string;
    fotoUrl?: string;
    foto_url?: string;
    photoUrl?: string;
    photo_url?: string;
    avatarUrl?: string;
    avatar_url?: string;
  };
  avaliador?: {
    id?: number | string;
    nome?: string;
    fotoUrl?: string;
    foto_url?: string;
    photoUrl?: string;
    photo_url?: string;
    avatarUrl?: string;
    avatar_url?: string;
  };
  freelancer?: {
    id?: number | string;
    nome?: string;
    fotoUrl?: string;
    foto_url?: string;
    photoUrl?: string;
    photo_url?: string;
    avatarUrl?: string;
    avatar_url?: string;
  };
};

type AvaliacoesResponse =
  | AvaliacaoApi[]
  | {
      data?: AvaliacaoApi[];
      dados?: AvaliacaoApi[];
      avaliacoes?: AvaliacaoApi[];
      media?: number | string;
      mediaNota?: number | string;
      media_nota?: number | string;
      totalAvaliacoes?: number | string;
      total_avaliacoes?: number | string;
      total?: number | string;
    };

type ContratoApi = {
  id?: number | string;
  status?: string | null;
};

type ChamadoApi = {
  id?: number | string;
  empresaId?: number | string;
  empresa_id?: number | string;
  idEmpresa?: number | string;
  id_empresa?: number | string;
  companyId?: number | string;
  company_id?: number | string;
  empresa?: string;
  company?: string;
  nomeEmpresa?: string;
  nome_empresa?: string;
  localServico?: string | null;
  local_servico?: string | null;
  cidade?: string | null;
  estado?: string | null;
  status?: string | null;
  empresaFotoUrl?: string | null;
  empresa_foto_url?: string | null;
  companyPhotoUrl?: string | null;
  company_photo_url?: string | null;
  logoUrl?: string | null;
  logo_url?: string | null;
};

const COMPANY_DATA_KEY_PREFIX = "@taskflow:company_data:";

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

function safeString(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function normalizeText(value: unknown) {
  return safeString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeImageUri(value?: string | null) {
  const uri = safeString(value);

  if (!uri) {
    return "";
  }

  if (/^(https?:|file:|data:|blob:|content:)/i.test(uri)) {
    return uri;
  }

  if (uri.startsWith("/")) {
    return `${API_BASE_URL}${uri}`;
  }

  return uri;
}


function getImageFromAnyObject(source: any, depth = 0): string | undefined {
  if (!source || typeof source !== "object" || depth > 3) {
    return undefined;
  }

  const directImage = resolveImageUrl(source);

  if (directImage) {
    return directImage;
  }

  for (const [key, value] of Object.entries(source)) {
    const normalizedKey = normalizeText(key);

    if (typeof value === "string") {
      const looksLikeImageKey =
        normalizedKey.includes("foto") ||
        normalizedKey.includes("photo") ||
        normalizedKey.includes("avatar") ||
        normalizedKey.includes("logo") ||
        normalizedKey.includes("imagem") ||
        normalizedKey.includes("image") ||
        normalizedKey.includes("picture");

      if (looksLikeImageKey) {
        const uri = normalizeImageUri(value);

        if (uri) {
          return uri;
        }
      }
    }

    if (value && typeof value === "object") {
      const nestedImage = getImageFromAnyObject(value, depth + 1);

      if (nestedImage) {
        return nestedImage;
      }
    }
  }

  return undefined;
}


function getMessagesFromAnyChatStorageValue(value: any) {
  if (Array.isArray(value)) {
    return value;
  }

  if (Array.isArray(value?.messages)) {
    return value.messages;
  }

  if (Array.isArray(value?.mensagens)) {
    return value.mensagens;
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  return [];
}

async function findImageFromChatStorage(params: {
  senderType?: "company" | "freelancer";
  ids?: unknown[];
  name?: unknown;
}) {
  try {
    const ids = getUniqueValues(params.ids ?? []);
    const normalizedName = normalizeText(params.name);
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter((key) => key.startsWith("@taskflow:chat"));
    let fallbackImage = "";

    for (const key of chatKeys) {
      const raw = await AsyncStorage.getItem(key);

      if (!raw) {
        continue;
      }

      let parsed: any;

      try {
        parsed = JSON.parse(raw);
      } catch {
        continue;
      }

      const messages = getMessagesFromAnyChatStorageValue(parsed).slice().reverse();

      for (const message of messages) {
        if (!message || typeof message !== "object") {
          continue;
        }

        const messageSenderType = normalizeText(
          message.senderType ?? message.sender ?? message.tipoRemetente
        );

        if (params.senderType && messageSenderType) {
          const wantedType = normalizeText(params.senderType);
          const isSameType =
            messageSenderType === wantedType ||
            (wantedType === "company" && messageSenderType === "empresa") ||
            (wantedType === "freelancer" && messageSenderType === "freelancer");

          if (!isSameType) {
            continue;
          }
        }

        const image = resolveImageUrl({
          photoUrl:
            message.senderPhotoUrl ??
            message.sender_photo_url ??
            message.photoUrl ??
            message.fotoUrl ??
            message.avatarUrl ??
            message.logoUrl ??
            message.imageUrl,
        });

        if (!image) {
          continue;
        }

        const messageSenderId = safeString(
          message.senderId ??
            message.sender_id ??
            message.remetenteId ??
            message.remetente_id ??
            message.userId ??
            message.usuarioId
        );
        const messageSenderName = normalizeText(
          message.senderName ??
            message.sender_name ??
            message.nomeRemetente ??
            message.nome_remetente ??
            message.name ??
            message.nome
        );

        const sameId = Boolean(messageSenderId && ids.includes(messageSenderId));
        const sameName =
          Boolean(normalizedName && messageSenderName) &&
          (messageSenderName.includes(normalizedName) ||
            normalizedName.includes(messageSenderName));

        if (sameId || sameName) {
          return image;
        }

        if (!fallbackImage) {
          fallbackImage = image;
        }
      }
    }

    return fallbackImage || undefined;
  } catch (error) {
    console.log("Erro ao buscar imagem no histórico do chat:", error);
    return undefined;
  }
}

function getNameFromAnyObject(source: any) {
  if (!source || typeof source !== "object") {
    return "";
  }

  return safeString(
    source.name ??
      source.nome ??
      source.nomeCompleto ??
      source.nome_completo ??
      source.nomeFantasia ??
      source.nome_fantasia ??
      source.razaoSocial ??
      source.razao_social ??
      source.companyName ??
      source.freelancerName ??
      source.freelancer_nome ??
      source.usuario?.nome ??
      source.user?.nome ??
      source.empresa?.nome ??
      source.freelancer?.nome
  );
}

function getIdFromAnyObject(source: any) {
  if (!source || typeof source !== "object") {
    return "";
  }

  return safeString(
    source.id ??
      source.userId ??
      source.user_id ??
      source.usuarioId ??
      source.usuario_id ??
      source.companyId ??
      source.company_id ??
      source.empresaId ??
      source.empresa_id ??
      source.freelancerId ??
      source.freelancer_id ??
      source.idFreelancer ??
      source.id_freelancer ??
      source.usuario?.id ??
      source.user?.id ??
      source.empresa?.id ??
      source.freelancer?.id
  );
}

async function findLocalImageByIdentity(params: {
  ids?: string[];
  name?: string;
  preferredPrefixes?: string[];
}) {
  try {
    const ids = getUniqueValues(params.ids ?? []);
    const normalizedName = normalizeText(params.name);
    const keys = await AsyncStorage.getAllKeys();

    const preferredPrefixes = params.preferredPrefixes ?? [];
    const preferredKeys = keys.filter((key) =>
      preferredPrefixes.some((prefix) => key.startsWith(prefix))
    );

    const orderedKeys = [...preferredKeys, ...keys.filter((key) => !preferredKeys.includes(key))];

    for (const key of orderedKeys) {
      const raw = await AsyncStorage.getItem(key);

      if (!raw) {
        continue;
      }

      let data: any;

      try {
        data = JSON.parse(raw);
      } catch {
        continue;
      }

      const dataId = getIdFromAnyObject(data) || key.split(":").pop() || "";
      const dataName = getNameFromAnyObject(data);

      const sameId = ids.length > 0 && dataId && ids.includes(dataId);
      const normalizedDataName = normalizeText(dataName);
      const sameName =
        Boolean(normalizedName && normalizedDataName) &&
        (normalizedDataName.includes(normalizedName) ||
          normalizedName.includes(normalizedDataName));

      if (sameId || sameName) {
        const image = getImageFromAnyObject(data);

        if (image) {
          return image;
        }
      }
    }
  } catch (error) {
    console.log("Erro ao buscar imagem local por identidade:", error);
  }

  return undefined;
}

function parseApiNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(String(value).replace(",", "."));

  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatRating(value?: number | null) {
  if (value === undefined || value === null || value <= 0) {
    return undefined;
  }

  return value.toFixed(1).replace(".", ",");
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Data não informada";
  }

  const parsedDate = new Date(value);

  if (!Number.isNaN(parsedDate.getTime())) {
    return parsedDate.toLocaleDateString("pt-BR");
  }

  return value;
}

function isFinishedStatus(status?: string | null) {
  const normalizedStatus = normalizeText(status);

  return (
    normalizedStatus === "finalizado" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluida" ||
    normalizedStatus === "finished" ||
    normalizedStatus === "completed"
  );
}

function getArrayFromResponse<T = any>(response: any, keys: string[] = []) {
  if (Array.isArray(response)) {
    return response as T[];
  }

  for (const key of keys) {
    if (Array.isArray(response?.[key])) {
      return response[key] as T[];
    }
  }

  return [] as T[];
}

async function tryApiGet<T = any>(endpoint: string) {
  try {
    return await apiGet<T>(endpoint);
  } catch (error) {
    console.log(`Perfil público empresa: rota não disponível ${endpoint}`, error);
    return null;
  }
}

function resolveImageUrl(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.logoUrl ??
      source.logo_url ??
      source.logoUri ??
      source.logo_uri ??
      source.logo ??
      source.companyLogoUrl ??
      source.company_logo_url ??
      source.companyLogoUri ??
      source.company_logo_uri ??
      source.photoUrl ??
      source.photo_url ??
      source.photoURL ??
      source.photoUri ??
      source.photo_uri ??
      source.fotoUrl ??
      source.foto_url ??
      source.fotoUri ??
      source.foto_uri ??
      source.foto ??
      source.urlFoto ??
      source.imagemPerfil ??
      source.profileImage ??
      source.profileImageUri ??
      source.profilePicture ??
      source.imageUri ??
      source.imageUrl ??
      source.image_url ??
      source.image ??
      source.picture ??
      source.avatarUrl ??
      source.avatar_url ??
      source.avatarUri ??
      source.avatar ??
      source.companyPhotoUrl ??
      source.company_photo_url ??
      source.companyPhotoUri ??
      source.company_photo_uri ??
      source.empresaFotoUrl ??
      source.empresa_foto_url ??
      source.empresaFotoUri ??
      source.empresa_foto_uri ??
      source.empresaPhotoUrl ??
      source.empresa_photo_url ??
      source.empresaPhotoUri ??
      source.empresa_photo_uri ??
      source.usuario?.fotoUrl ??
      source.usuario?.foto_url ??
      source.usuario?.photoUrl ??
      source.usuario?.photo_uri ??
      source.usuario?.logoUrl ??
      source.usuario?.logoUri ??
      source.empresa?.fotoUrl ??
      source.empresa?.foto_url ??
      source.empresa?.photoUrl ??
      source.empresa?.photoUri ??
      source.empresa?.logoUrl ??
      source.empresa?.logoUri;

    const uri = normalizeImageUri(value);

    if (uri) {
      return uri;
    }
  }

  return undefined;
}

function resolveCompanyAbout(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.about ??
      source.sobre ??
      source.sobreEmpresa ??
      source.sobre_empresa ??
      source.descricao ??
      source.description ??
      source.descricaoEmpresa ??
      source.descricao_empresa ??
      source.companyDescription ??
      source.bio ??
      source.empresa?.descricao ??
      source.empresa?.description ??
      source.usuario?.descricao;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function resolveCompanyName(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.name ??
      source.nome ??
      source.nomeFantasia ??
      source.nome_fantasia ??
      source.razaoSocial ??
      source.razao_social ??
      source.companyName ??
      source.empresa ??
      source.company ??
      source.nomeEmpresa ??
      source.nome_empresa ??
      source.usuario?.nome;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "Empresa não informada";
}

function resolveCompanyLocation(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.location ??
      source.localizacao ??
      source.endereco ??
      source.address ??
      source.localServico ??
      source.local_servico;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    const cidade = safeString(source.cidade ?? source.city);
    const estado = safeString(source.estado ?? source.state ?? source.uf);

    if (cidade || estado) {
      return [cidade, estado].filter(Boolean).join(" - ");
    }
  }

  return "Localização não informada";
}

function getCompanyIdFromSource(source: any) {
  return safeString(
    source?.empresaId ??
      source?.empresa_id ??
      source?.idEmpresa ??
      source?.id_empresa ??
      source?.companyId ??
      source?.company_id ??
      source?.id
  );
}

function getUniqueValues(values: unknown[]) {
  return Array.from(new Set(values.map(safeString).filter(Boolean)));
}

function getAvaliacoesFromResponse(response: AvaliacoesResponse | null) {
  if (!response) {
    return [] as AvaliacaoApi[];
  }

  return getArrayFromResponse<AvaliacaoApi>(response, [
    "data",
    "dados",
    "avaliacoes",
  ]);
}

function getRatingInfo(response: AvaliacoesResponse | null) {
  const avaliacoes = getAvaliacoesFromResponse(response);
  const notas = avaliacoes
    .map((avaliacao) => parseApiNumber(avaliacao.nota ?? avaliacao.rating, 0))
    .filter((nota) => nota > 0);

  let rating = notas.length
    ? notas.reduce((sum, nota) => sum + nota, 0) / notas.length
    : undefined;

  let reviewsCount = notas.length;

  if (response && !Array.isArray(response)) {
    const mediaFromApi = parseApiNumber(
      response.media ?? response.mediaNota ?? response.media_nota,
      0
    );

    const totalFromApi = parseApiNumber(
      response.totalAvaliacoes ?? response.total_avaliacoes ?? response.total,
      reviewsCount
    );

    if (mediaFromApi > 0) {
      rating = mediaFromApi;
    }

    if (totalFromApi > 0) {
      reviewsCount = totalFromApi;
    }
  }

  const satisfactionRate = notas.length
    ? Math.round((notas.filter((nota) => nota >= 4).length / notas.length) * 100)
    : undefined;

  const reviews = avaliacoes.slice(0, 6).map((avaliacao, index) => {
    const freelancerId = safeString(
      avaliacao.avaliadorId ??
        avaliacao.avaliador_id ??
        avaliacao.idAvaliador ??
        avaliacao.id_avaliador ??
        avaliacao.freelancerId ??
        avaliacao.freelancer_id ??
        avaliacao.idFreelancer ??
        avaliacao.id_freelancer ??
        avaliacao.usuarioAvaliador?.id ??
        avaliacao.avaliador?.id ??
        avaliacao.freelancer?.id
    );

    const freelancerName =
      safeString(
        avaliacao.avaliadorNome ??
          avaliacao.avaliador_nome ??
          avaliacao.freelancerNome ??
          avaliacao.freelancer_nome ??
          avaliacao.usuarioAvaliador?.nome ??
          avaliacao.avaliador?.nome ??
          avaliacao.freelancer?.nome
      ) || "Freelancer";

    return {
      id: safeString(avaliacao.id) || `${index}`,
      freelancer: freelancerName,
      freelancerId,
      photoUrl: resolveImageUrl(
        {
          photoUrl:
            avaliacao.avaliadorFotoUrl ??
            avaliacao.avaliador_foto_url ??
            avaliacao.freelancerFotoUrl ??
            avaliacao.freelancer_foto_url ??
            avaliacao.fotoUrl ??
            avaliacao.foto_url ??
            avaliacao.photoUrl ??
            avaliacao.photo_url ??
            avaliacao.avatarUrl ??
            avaliacao.avatar_url,
        },
        avaliacao.usuarioAvaliador,
        avaliacao.avaliador,
        avaliacao.freelancer
      ),
      rating: Math.max(
        1,
        Math.round(parseApiNumber(avaliacao.nota ?? avaliacao.rating, 5))
      ),
      comment:
        safeString(avaliacao.comentario ?? avaliacao.comment) ||
        "Avaliação registrada sem comentário.",
      date: formatDate(
        avaliacao.dataAvaliacao ??
          avaliacao.data_avaliacao ??
          avaliacao.criadaEm ??
          avaliacao.criada_em
      ),
    };
  });

  return {
    rating,
    reviewsCount,
    satisfactionRate,
    reviews,
  };
}

async function findLocalCompanyData(companyIds: string[], companyName: string) {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const companyKeys = keys.filter((key) =>
      key.startsWith(COMPANY_DATA_KEY_PREFIX)
    );

    for (const companyId of companyIds) {
      const exactKey = `${COMPANY_DATA_KEY_PREFIX}${companyId}`;
      const raw = await AsyncStorage.getItem(exactKey);

      if (raw) {
        return JSON.parse(raw);
      }
    }

    const normalizedCompanyName = normalizeText(companyName);

    const localCompanies: any[] = [];

    for (const key of companyKeys) {
      const raw = await AsyncStorage.getItem(key);

      if (!raw) {
        continue;
      }

      const data = JSON.parse(raw);
      localCompanies.push(data);

      const dataName = normalizeText(resolveCompanyName(data));

      if (
        normalizedCompanyName &&
        (dataName.includes(normalizedCompanyName) ||
          normalizedCompanyName.includes(dataName))
      ) {
        return data;
      }
    }

    if (localCompanies.length === 1) {
      return localCompanies[0];
    }
  } catch (error) {
    console.log("Erro ao buscar dados locais da empresa:", error);
  }

  return null;
}

export default function CompanyPublicProfileScreen() {
  const params = useLocalSearchParams<Record<string, string | string[]>>();

  const { isDark, theme } = useTheme();

  const companyId = firstParam(params.companyId) ||
    firstParam(params.empresaId) ||
    firstParam(params.idEmpresa) ||
    firstParam(params.id_empresa) ||
    firstParam(params.company_id) ||
    firstParam(params.id);

  const jobTitle = firstParam(params.jobTitle) ||
    firstParam(params.title) ||
    "Chamado selecionado";

  const [companyProfile, setCompanyProfile] =
    useState<CompanyPublicProfile | null>(null);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    loadCompanyProfile();
  }, [companyId, jobTitle]);

  async function loadCompanyProfile() {
    setLogoFailed(false);
    const companyNameFromParams =
      firstParam(params.companyName) ||
      firstParam(params.name) ||
      firstParam(params.empresa) ||
      firstParam(params.company) ||
      "Empresa não informada";

    const companyLocationFromParams =
      firstParam(params.companyLocation) ||
      firstParam(params.location) ||
      [firstParam(params.city), firstParam(params.state)].filter(Boolean).join(" - ");

    const logoUrlFromParams = resolveImageUrl({
      logoUrl: firstParam(params.logoUrl),
      photoUrl: firstParam(params.photoUrl),
      fotoUrl: firstParam(params.empresaFotoUrl),
      companyPhotoUrl: firstParam(params.companyPhotoUrl),
      avatarUrl: firstParam(params.avatarUrl),
    });

    const companyIds = getUniqueValues([
      companyId,
      firstParam(params.companyId),
      firstParam(params.empresaId),
      firstParam(params.idEmpresa),
      firstParam(params.id_empresa),
      firstParam(params.company_id),
      firstParam(params.id),
    ]);

    let profile: CompanyPublicProfile = {
      id: companyId,
      name: companyNameFromParams,
      location: companyLocationFromParams || "Localização não informada",
      rating: formatRating(parseApiNumber(firstParam(params.companyRating), 0)),
      reviewsCount: undefined,
      totalJobs: undefined,
      completedJobs: undefined,
      satisfactionRate: undefined,
      about: resolveCompanyAbout({
        about: firstParam(params.about),
        descricao: firstParam(params.descricao),
        description: firstParam(params.description),
        companyDescription: firstParam(params.companyDescription),
      }),
      tags: [],
      isVerified: false,
      averageResponseTime: undefined,
      reviews: [],
      logoUrl: logoUrlFromParams,
    };

    const localCompanyData = await findLocalCompanyData(
      companyIds,
      companyNameFromParams
    );

    if (localCompanyData) {
      profile = {
        ...profile,
        name: resolveCompanyName(localCompanyData, profile),
        location: resolveCompanyLocation(localCompanyData, profile),
        about: resolveCompanyAbout(localCompanyData, profile) ?? profile.about,
        tags: Array.isArray(localCompanyData.tags) ? localCompanyData.tags : profile.tags,
        isVerified: Boolean(localCompanyData.isVerified ?? profile.isVerified),
        logoUrl:
          getImageFromAnyObject(localCompanyData) ??
          resolveImageUrl(localCompanyData, profile) ??
          profile.logoUrl,
      };
    }

    if (!profile.logoUrl) {
      const localCompanyImage = await findLocalImageByIdentity({
        ids: companyIds,
        name: profile.name,
        preferredPrefixes: [COMPANY_DATA_KEY_PREFIX],
      });

      if (localCompanyImage) {
        profile = {
          ...profile,
          logoUrl: localCompanyImage,
        };
      }
    }

    let apiCompany: any = null;

    for (const id of companyIds) {
      apiCompany =
        (await tryApiGet(`/api/Empresas/${id}`)) ??
        (await tryApiGet(`/api/Usuarios/${id}`));

      if (apiCompany) {
        break;
      }
    }

    if (!apiCompany) {
      const empresasResponse = await tryApiGet<any>("/api/Empresas");
      const empresas = getArrayFromResponse<any>(empresasResponse, [
        "data",
        "dados",
        "empresas",
      ]);

      const normalizedName = normalizeText(profile.name);

      apiCompany = empresas.find((empresa) => {
        const apiId = getCompanyIdFromSource(empresa);
        const sameId = apiId && companyIds.includes(apiId);
        const sameName =
          normalizedName &&
          normalizeText(resolveCompanyName(empresa)).includes(normalizedName);

        return sameId || sameName;
      });
    }

    if (apiCompany) {
      profile = {
        ...profile,
        id: getCompanyIdFromSource(apiCompany) || profile.id,
        name: resolveCompanyName(apiCompany, profile),
        location: resolveCompanyLocation(apiCompany, profile),
        about: resolveCompanyAbout(apiCompany, profile) ?? profile.about,
        tags: Array.isArray(apiCompany.tags)
          ? apiCompany.tags
          : Array.isArray(apiCompany.categorias)
          ? apiCompany.categorias
          : profile.tags,
        isVerified: Boolean(
          apiCompany.verificada ??
            apiCompany.verificado ??
            apiCompany.isVerified ??
            profile.isVerified
        ),
        logoUrl:
          getImageFromAnyObject(apiCompany) ??
          resolveImageUrl(apiCompany, profile) ??
          profile.logoUrl,
      };
    }

    try {
      const chamadosResponse = await apiGet<any>("/api/Chamados");
      const chamados = getArrayFromResponse<ChamadoApi>(chamadosResponse, [
        "data",
        "dados",
        "chamados",
      ]);

      const normalizedName = normalizeText(profile.name);

      const chamadosDaEmpresa = chamados.filter((chamado) => {
        const chamadoCompanyId = getCompanyIdFromSource(chamado);
        const sameId = chamadoCompanyId && companyIds.includes(chamadoCompanyId);
        const sameName =
          normalizedName &&
          normalizeText(resolveCompanyName(chamado)).includes(normalizedName);

        return sameId || sameName;
      });

      if (chamadosDaEmpresa.length > 0) {
        const firstJob = chamadosDaEmpresa[0];
        profile = {
          ...profile,
          name: resolveCompanyName(firstJob, profile),
          location: resolveCompanyLocation(firstJob, profile),
          totalJobs: chamadosDaEmpresa.length,
          completedJobs: chamadosDaEmpresa.filter((chamado) =>
            isFinishedStatus(chamado.status)
          ).length,
          about: resolveCompanyAbout(firstJob, profile) ?? profile.about,
          logoUrl:
            getImageFromAnyObject(firstJob) ??
            resolveImageUrl(firstJob, profile) ??
            profile.logoUrl,
        };
      }
    } catch (error) {
      console.log("Erro ao carregar chamados da empresa:", error);
    }

    for (const id of companyIds) {
      const contratosResponse = await tryApiGet<any>(`/api/Contratos/empresa/${id}`);
      const contratos = getArrayFromResponse<ContratoApi>(contratosResponse, [
        "data",
        "dados",
        "contratos",
      ]);

      if (contratos.length > 0) {
        profile = {
          ...profile,
          totalJobs: contratos.length,
          completedJobs: contratos.filter((contrato) =>
            isFinishedStatus(contrato.status)
          ).length,
        };
        break;
      }
    }

    let reviewsResponse: AvaliacoesResponse | null = null;

    for (const id of companyIds) {
      reviewsResponse =
        (await tryApiGet<AvaliacoesResponse>(`/api/Avaliacoes/usuario/${id}`)) ??
        (await tryApiGet<AvaliacoesResponse>(`/api/Avaliacoes/empresa/${id}`));

      if (reviewsResponse) {
        break;
      }
    }

    const ratingInfo = getRatingInfo(reviewsResponse);

    if (
      ratingInfo.rating ||
      ratingInfo.reviewsCount ||
      ratingInfo.reviews.length > 0
    ) {
      const enrichedReviews = await Promise.all(
        ratingInfo.reviews.map(async (review) => {
          if (review.photoUrl) {
            return review;
          }

          const localReviewerImage = await findLocalImageByIdentity({
            ids: [review.freelancerId],
            name: review.freelancer,
            preferredPrefixes: ["@taskflow:freelancer_data:"],
          });

          const chatReviewerImage = !localReviewerImage
            ? await findImageFromChatStorage({
                senderType: "freelancer",
                ids: [review.freelancerId],
                name: review.freelancer,
              })
            : undefined;

          return {
            ...review,
            photoUrl: localReviewerImage ?? chatReviewerImage,
          };
        })
      );

      profile = {
        ...profile,
        rating: formatRating(ratingInfo.rating),
        reviewsCount: ratingInfo.reviewsCount,
        satisfactionRate: ratingInfo.satisfactionRate !== undefined
          ? `${ratingInfo.satisfactionRate}%`
          : profile.satisfactionRate,
        reviews: enrichedReviews,
      };
    }

    if (!profile.logoUrl) {
      const lastCompanyImageAttempt = await findLocalImageByIdentity({
        ids: companyIds,
        name: profile.name,
        preferredPrefixes: [COMPANY_DATA_KEY_PREFIX],
      });

      const chatCompanyImage = !lastCompanyImageAttempt
        ? await findImageFromChatStorage({
            senderType: "company",
            ids: companyIds,
            name: profile.name,
          })
        : undefined;

      const finalCompanyImage = lastCompanyImageAttempt ?? chatCompanyImage;

      if (finalCompanyImage) {
        profile = {
          ...profile,
          logoUrl: finalCompanyImage,
        };
      }
    }

    setCompanyProfile(profile);
  }

  const companyName = companyProfile?.name ?? "Empresa não informada";
  const companyRating = companyProfile?.rating ?? "Sem nota";
  const reviewsCount = companyProfile?.reviewsCount;
  const totalJobs = companyProfile?.totalJobs;
  const completedJobs = companyProfile?.completedJobs;
  const satisfactionRate = companyProfile?.satisfactionRate;
  const about = companyProfile?.about;
  const tags = companyProfile?.tags ?? [];
  const isVerified = companyProfile?.isVerified ?? false;
  const reviews = companyProfile?.reviews ?? [];
  const logoUrl = companyProfile?.logoUrl;

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

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Perfil da empresa
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: theme.background }}
      >
        <View
          style={[
            styles.companyCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.logoArea}>
            {logoUrl && !logoFailed ? (
              <Image
                source={{ uri: logoUrl }}
                style={styles.logo}
                resizeMode="cover"
                onError={() => setLogoFailed(true)}
              />
            ) : (
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            )}

            {isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckIcon width={13} height={13} color={colors.white} />
              </View>
            )}
          </View>

          <Text style={[styles.companyName, { color: theme.text }]}>
            {companyName}
          </Text>


          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>

            <Text style={[styles.ratingText, { color: theme.text }]}>
              {companyRating}
            </Text>

            <Text style={[styles.ratingSubtext, { color: theme.textSecondary }]}>
              {reviewsCount !== undefined
                ? `• ${reviewsCount} avaliações`
                : "• avaliações via API"}
            </Text>
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
                {totalJobs ?? "—"}
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Chamados
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
                {completedJobs ?? "—"}
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Concluídos
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
                {satisfactionRate ?? "—"}
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Satisfação
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.jobCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.primary }]}>
            Chamado relacionado
          </Text>

          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          <Text style={[styles.jobText, { color: theme.textSecondary }]}>
            Este é o chamado publicado pela empresa que você está visualizando.
          </Text>
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Sobre a empresa
          </Text>

          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            {about ?? "A empresa ainda não preencheu a descrição pública."}
          </Text>

          {tags.length > 0 && (
            <View style={styles.tagsArea}>
              {tags.map((tag) => (
                <View
                  key={tag}
                  style={[
                    styles.tag,
                    {
                      backgroundColor: theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.tagText, { color: theme.text }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Avaliações de freelancers
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Comentários feitos por profissionais que já prestaram serviços para
            esta empresa.
          </Text>

          <View style={styles.reviewsList}>
            {reviews.length === 0 ? (
              <View
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.reviewComment, { color: theme.textSecondary }]}>
                  Nenhuma avaliação pública disponível no momento.
                </Text>
              </View>
            ) : (
              reviews.map((review) => (
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
                    {review.photoUrl ? (
                      <Image
                        source={{ uri: review.photoUrl }}
                        style={styles.avatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {review.freelancer.charAt(0)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.reviewHeaderText}>
                      <Text
                        style={[styles.freelancerName, { color: theme.text }]}
                      >
                        {review.freelancer}
                      </Text>

                      <Text
                        style={[
                          styles.reviewDate,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {review.date}
                      </Text>
                    </View>

                    <Text style={styles.reviewRating}>
                      ⭐ {review.rating},0
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.reviewComment,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {review.comment}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        <View
          style={[
            styles.securityBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.securityTitle, { color: theme.text }]}>
            Contratação segura
          </Text>

          <Text style={[styles.securityText, { color: theme.textSecondary }]}>
            O chat só será liberado após aceite da empresa e confirmação do
            fluxo. Ao final do serviço, as duas partes poderão se avaliar.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Voltar ao chamado</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
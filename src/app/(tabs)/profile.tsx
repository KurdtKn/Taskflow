import { getFreelancerData, getLoggedUser } from "@/services/storage";
import { logout } from "@/services/authService";
import type { ComponentType } from "react";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";

import { styles } from "@/app/styles/profile";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";
import { apiGet } from "@/services/api";

import EditIcon from "../../../assets/icons/edit.svg";
import BadgeIcon from "../../../assets/icons/badge.svg";
import AssignmentIcon from "../../../assets/icons/assignment.svg";
import StarIcon from "../../../assets/icons/star_border.svg";
import SettingsIcon from "../../../assets/icons/settings.svg";
import HelpIcon from "../../../assets/icons/help_outline.svg";

type MenuOption = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
  action: () => void;
};

type FreelancerProfile = {
  id: string;
  name: string;
  userType: string;
  photoUrl?: string;
  rating?: number;
  reviewsCount?: number;
  completedServices?: number;
  acceptanceRate?: number;
  punctuality?: number;
  about?: string;
  tags?: string[];
};

type AvaliacaoApi = {
  id?: number;
  contratoId?: number;
  contrato_id?: number;
  avaliadorId?: number;
  avaliador_id?: number;
  avaliadoId?: number;
  avaliado_id?: number;
  nota?: number;
  rating?: number;
  comentario?: string | null;
  dataAvaliacao?: string;
  data_avaliacao?: string;
};

type AvaliacoesResponse =
  | AvaliacaoApi[]
  | {
      data?: AvaliacaoApi[];
      dados?: AvaliacaoApi[];
      avaliacoes?: AvaliacaoApi[];
      media?: number;
      totalAvaliacoes?: number;
      total?: number;
    };

type ContratoApi = {
  id?: number;
  status?: string;
};

type ContratosResponse =
  | ContratoApi[]
  | {
      data?: ContratoApi[];
      dados?: ContratoApi[];
      contratos?: ContratoApi[];
    };

function getAvaliacoesFromResponse(response: AvaliacoesResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.avaliacoes ?? [];
}

function getContratosFromResponse(response: ContratosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.contratos ?? [];
}

function isFinishedStatus(status?: string | null) {
  const normalizedStatus = status?.toLowerCase().trim();

  return (
    normalizedStatus === "finalizado" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluído" ||
    normalizedStatus === "finished" ||
    normalizedStatus === "completed"
  );
}

function calculateRating(avaliacoes: AvaliacaoApi[]) {
  const notas = avaliacoes
    .map((avaliacao) => Number(avaliacao.nota ?? avaliacao.rating ?? 0))
    .filter((nota) => nota > 0);

  if (notas.length === 0) {
    return {
      rating: undefined,
      reviewsCount: 0,
    };
  }

  const total = notas.reduce((sum, nota) => sum + nota, 0);

  return {
    rating: total / notas.length,
    reviewsCount: notas.length,
  };
}

function parseApiNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(String(value).replace(",", "."));

  return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateRatingFromResponse(response: AvaliacoesResponse) {
  const avaliacoes = getAvaliacoesFromResponse(response);
  const ratingData = calculateRating(avaliacoes);

  if (!Array.isArray(response)) {
    const mediaFromApi = parseApiNumber(response.media, 0);
    const totalFromApi = parseApiNumber(
      response.totalAvaliacoes ?? response.total,
      ratingData.reviewsCount
    );

    if (mediaFromApi > 0 || totalFromApi > 0) {
      return {
        rating: mediaFromApi > 0 ? mediaFromApi : ratingData.rating,
        reviewsCount: totalFromApi,
      };
    }
  }

  return ratingData;
}

function getUniquePositiveIds(values: unknown[]) {
  const ids = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > 0)
    .map((value) => String(value));

  return [...new Set(ids)];
}

function resolveImageUrl(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.photoUrl ??
      source.photo_url ??
      source.photoURL ??
      source.fotoUrl ??
      source.foto_url ??
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
      source.usuario?.fotoUrl ??
      source.usuario?.foto_url ??
      source.usuario?.photoUrl ??
      source.freelancer?.fotoUrl ??
      source.freelancer?.foto_url ??
      source.freelancer?.photoUrl;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export default function ProfileScreen() {
  const { isDark, theme } = useTheme();

  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhotoFailed, setProfilePhotoFailed] = useState(false);

  const profileCardBackground = isDark ? colors.blue[700] : colors.primary;
  const profileCardBorder = isDark ? colors.blue[600] : colors.primary;

  const iconColor = colors.black;
  const iconBoxBackground = isDark ? colors.white : colors.lightGray;
  const iconBoxBorder = isDark ? colors.white : colors.border;

  const actionButtonBackground = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(11,87,208,0.10)";

  const actionButtonBorder = isDark
    ? "rgba(255,255,255,0.18)"
    : "rgba(11,87,208,0.18)";

  const actionButtonTextColor = isDark ? colors.white : colors.primary;

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  async function loadProfile() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        setProfile(null);
        router.replace("/login");
        return;
      }

      const savedFreelancerData = await getFreelancerData(loggedUser.id);
      setProfilePhotoFailed(false);

      let rating: number | undefined;
      let reviewsCount: number | undefined;
      let completedServices: number | undefined;
      let acceptanceRate: number | undefined;
      let punctuality: number | undefined;

      try {
        const avaliacaoIds = getUniquePositiveIds([
          loggedUser.id,
          loggedUser.perfilId,
          savedFreelancerData?.id,
          savedFreelancerData?.idFreelancer,
          savedFreelancerData?.id_freelancer,
          savedFreelancerData?.usuarioId,
          savedFreelancerData?.userId,
        ]);

        const endpoints = [
          ...avaliacaoIds.map((id) => `/api/Avaliacoes/usuario/${id}`),
          ...avaliacaoIds.map((id) => `/api/Avaliacoes/freelancer/${id}`),
        ];

        for (const endpoint of endpoints) {
          try {
            const avaliacoesResponse = await apiGet<AvaliacoesResponse>(endpoint);
            const ratingData = calculateRatingFromResponse(avaliacoesResponse);

            if (ratingData.rating || ratingData.reviewsCount > 0) {
              rating = ratingData.rating;
              reviewsCount = ratingData.reviewsCount;
              break;
            }
          } catch (endpointError) {
            console.log(`Erro ao carregar avaliações em ${endpoint}:`, endpointError);
          }
        }
      } catch (error) {
        console.log("Erro ao carregar avaliações do freelancer:", error);
      }

      try {
        const freelancerId = loggedUser.perfilId ?? loggedUser.id;

        const contratosResponse = await apiGet<ContratosResponse>(
          `/api/Contratos/freelancer/${freelancerId}`
        );

        const contratos = getContratosFromResponse(contratosResponse);
        const finalizados = contratos.filter((contrato) =>
          isFinishedStatus(contrato.status)
        );

        completedServices = finalizados.length;

        if (contratos.length > 0) {
          acceptanceRate = Math.round(
            (finalizados.length / contratos.length) * 100
          );
        }
      } catch (error) {
        console.log("Erro ao carregar contratos do freelancer:", error);
      }

      setProfile({
        id: String(loggedUser.perfilId ?? loggedUser.id),
        name:
          savedFreelancerData?.name ||
          savedFreelancerData?.nome ||
          savedFreelancerData?.nomeCompleto ||
          loggedUser.nome ||
          loggedUser.name ||
          "Freelancer",
        userType: "Freelancer",
        photoUrl: resolveImageUrl(savedFreelancerData, loggedUser),
        rating,
        reviewsCount,
        completedServices,
        acceptanceRate,
        punctuality,
        about:
          savedFreelancerData?.about ||
          savedFreelancerData?.sobre ||
          savedFreelancerData?.bio ||
          savedFreelancerData?.descricao ||
          "Quando você preencher a descrição do perfil, ela aparecerá aqui.",
        tags:
          savedFreelancerData?.tags ??
          savedFreelancerData?.skills ??
          savedFreelancerData?.habilidades ??
          [],
      });
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  const menuOptions: MenuOption[] = [
    {
      id: "1",
      title: "Minhas solicitações",
      subtitle: "Acompanhe serviços aceitos e em andamento",
      Icon: AssignmentIcon,
      action: () => router.push("/requests"),
    },
    {
      id: "2",
      title: "Avaliações recebidas",
      subtitle: "Veja sua reputação dentro da plataforma",
      Icon: StarIcon,
      action: () => router.push("/reviews"),
    },
    {
      id: "3",
      title: "Configurações",
      subtitle: "Preferências, segurança e privacidade",
      Icon: SettingsIcon,
      action: () => router.push("/freelancer-settings"),
    },
    {
      id: "4",
      title: "Ajuda e suporte",
      subtitle: "Central de dúvidas e atendimento",
      Icon: HelpIcon,
      action: () => router.push("/support-contact"),
    },
  ];

  async function confirmLogout() {
    try {
      await logout();
      router.replace("/welcome");
    } catch (error) {
      console.log("Erro ao sair:", error);
      router.replace("/welcome");
    }
  }

  function handleLogout() {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Tem certeza que deseja sair da sua conta?"
      );

      if (confirmed) {
        confirmLogout();
      }

      return;
    }

    Alert.alert(
      "Desconectar-se",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          style: "destructive",
          onPress: confirmLogout,
        },
      ]
    );
  }

  function handleOpenSettings() {
    router.push("/freelancer-settings");
  }

  function getProfileInitial() {
    if (!profile?.name) {
      return "?";
    }

    return profile.name.charAt(0).toUpperCase();
  }

  function formatRating(value?: number) {
    if (value === undefined || value === null) {
      return "—";
    }

    return value.toFixed(1).replace(".", ",");
  }

  function formatStat(value?: number, suffix = "") {
    if (value === undefined || value === null) {
      return "—";
    }

    return `${value}${suffix}`;
  }

  function hasRatingData() {
    return profile?.rating !== undefined && profile?.rating !== null;
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
      >
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Perfil
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.settingsButton,
              {
                backgroundColor: iconBoxBackground,
                borderColor: iconBoxBorder,
                borderWidth: 1,
              },
              pressed && {
                opacity: 0.75,
                transform: [{ scale: 0.96 }],
              },
            ]}
            onPress={handleOpenSettings}
          >
            <SettingsIcon width={24} height={24} color={iconColor} />
          </Pressable>
        </View>

        {isLoading ? (
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: profileCardBackground,
                borderColor: profileCardBorder,
              },
            ]}
          >
            <Text style={styles.userName}>Carregando perfil...</Text>

            <Text style={styles.userType}>
              Buscando dados da sua conta.
            </Text>
          </View>
        ) : !profile ? (
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: profileCardBackground,
                borderColor: profileCardBorder,
              },
            ]}
          >
            <View style={styles.avatarArea}>
              <View
                style={[
                  styles.avatar,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.white,
                  },
                ]}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontSize: 32,
                    fontWeight: "900",
                  }}
                >
                  ?
                </Text>
              </View>
            </View>

            <Text style={styles.userName}>Perfil não carregado</Text>

            <Text
              style={[
                styles.userType,
                {
                  textAlign: "center",
                  lineHeight: 20,
                },
              ]}
            >
              Faça login novamente para carregar os dados do seu perfil.
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.profileCard,
                {
                  backgroundColor: profileCardBackground,
                  borderColor: profileCardBorder,
                },
              ]}
            >
              <View style={styles.avatarArea}>
                {profile.photoUrl && !profilePhotoFailed ? (
                  <Image
                    source={{ uri: profile.photoUrl }}
                    style={styles.avatar}
                    resizeMode="cover"
                    onError={() => setProfilePhotoFailed(true)}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: colors.white,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: 34,
                        fontWeight: "900",
                      }}
                    >
                      {getProfileInitial()}
                    </Text>
                  </View>
                )}

                <View style={styles.onlineBadge} />
              </View>

              <Text style={styles.userName}>{profile.name}</Text>

              <Text style={styles.userType}>{profile.userType}</Text>

              <View style={styles.ratingArea}>
                <Text style={styles.ratingIcon}>⭐</Text>

                {hasRatingData() ? (
                  <>
                    <Text style={styles.ratingText}>
                      {formatRating(profile.rating)}
                    </Text>

                    <Text style={styles.ratingSubtext}>
                      {" "}
                      ({profile.reviewsCount ?? 0} avaliações)
                    </Text>
                  </>
                ) : (
                  <Text style={styles.ratingSubtext}>
                    Sem avaliações ainda
                  </Text>
                )}
              </View>

              <View
                style={[
                  styles.statsArea,
                  {
                    backgroundColor: isDark
                      ? colors.white
                      : "rgba(255,255,255,0.96)",
                    borderColor: isDark
                      ? colors.white
                      : "rgba(255,255,255,0.75)",
                    borderWidth: 1,
                  },
                ]}
              >
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.black }]}>
                    {formatStat(profile.completedServices)}
                  </Text>

                  <Text style={[styles.statLabel, { color: colors.gray }]}>
                    Serviços
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.black }]}>
                    {formatStat(profile.acceptanceRate, "%")}
                  </Text>

                  <Text style={[styles.statLabel, { color: colors.gray }]}>
                    Concluídos
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    {
                      backgroundColor: colors.border,
                    },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.black }]}>
                    {formatRating(profile.rating)}
                  </Text>

                  <Text style={[styles.statLabel, { color: colors.gray }]}>
                    Avaliação
                  </Text>
                </View>
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
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Minhas habilidades
              </Text>

              {profile.tags && profile.tags.length > 0 ? (
                <View style={styles.tagsArea}>
                  {profile.tags.map((tag) => (
                    <View
                      key={tag}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: theme.inputBackground,
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
              ) : (
                <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
                  Nenhuma habilidade cadastrada ainda.
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 18,
                }}
              >
                <Pressable
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      minHeight: 48,
                      borderRadius: 14,
                      backgroundColor: actionButtonBackground,
                      borderWidth: 1,
                      borderColor: actionButtonBorder,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    },
                    pressed && {
                      opacity: 0.8,
                      transform: [{ scale: 0.98 }],
                    },
                  ]}
                  onPress={() => router.push("/portfolio")}
                >
                  <BadgeIcon width={22} height={22} color={actionButtonTextColor} />

                  <Text
                    style={{
                      color: actionButtonTextColor,
                      fontSize: 15,
                      fontWeight: "900",
                    }}
                  >
                    Portfólio
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      minHeight: 48,
                      borderRadius: 14,
                      backgroundColor: actionButtonBackground,
                      borderWidth: 1,
                      borderColor: actionButtonBorder,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    },
                    pressed && {
                      opacity: 0.8,
                      transform: [{ scale: 0.98 }],
                    },
                  ]}
                  onPress={() => router.push("/edit-profile")}
                >
                  <EditIcon width={22} height={22} color={actionButtonTextColor} />

                  <Text
                    style={{
                      color: actionButtonTextColor,
                      fontSize: 15,
                      fontWeight: "900",
                    }}
                  >
                    Editar perfil
                  </Text>
                </Pressable>
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
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Sobre mim
              </Text>

              <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
                {profile.about}
              </Text>
            </View>
          </>
        )}

        <View style={styles.menuArea}>
          {menuOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.menuItem,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
                pressed && styles.menuItemPressed,
              ]}
              onPress={option.action}
            >
              <View
                style={[
                  styles.menuIconBox,
                  {
                    backgroundColor: iconBoxBackground,
                    borderColor: iconBoxBorder,
                    borderWidth: 1,
                  },
                ]}
              >
                <option.Icon width={24} height={24} color={iconColor} />
              </View>

              <View style={styles.menuTextArea}>
                <Text style={[styles.menuTitle, { color: theme.text }]}>
                  {option.title}
                </Text>

                <Text
                  style={[
                    styles.menuSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  {option.subtitle}
                </Text>
              </View>

              <Text style={[styles.menuArrow, { color: theme.textSecondary }]}>
                ›
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Desconectar-se</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
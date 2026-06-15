import { getCompanyData, getLoggedUser } from "@/services/storage";
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

import BadgeIcon from "../../../assets/icons/badge.svg";
import StarIcon from "../../../assets/icons/star_border.svg";
import SettingsIcon from "../../../assets/icons/settings.svg";
import HelpIcon from "../../../assets/icons/help_outline.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import SupportIcon from "../../../assets/icons/support_agent.svg";
import SendIcon from "../../../assets/icons/send.svg";
import CheckIcon from "../../../assets/icons/check.svg";

import { styles } from "@/app/styles/companyProfile";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiGet } from "@/services/api";

type MenuOption = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
  action: () => void;
};

type CompanyProfile = {
  id: string;
  name: string;
  type: string;
  logoUrl?: string;
  isVerified: boolean;
  rating?: number;
  reviewsCount?: number;
  totalJobs: number;
  completedJobs: number;
  satisfactionRate: number;
  about?: string;
  tags: string[];
  location?: string;
  phone?: string;
  email?: string;
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
  status?: string | null;
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
      satisfactionRate: 0,
    };
  }

  const total = notas.reduce((sum, nota) => sum + nota, 0);

  const satisfactionRate = Math.round(
    (notas.filter((nota) => nota >= 4).length / notas.length) * 100
  );

  return {
    rating: total / notas.length,
    reviewsCount: notas.length,
    satisfactionRate,
  };
}

function removeDuplicateReviews(avaliacoes: AvaliacaoApi[]) {
  return avaliacoes.filter((avaliacao, index, array) => {
    if (!avaliacao.id) {
      return true;
    }

    return array.findIndex((item) => item.id === avaliacao.id) === index;
  });
}

function resolveImageUrl(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.logoUrl ??
      source.logo_url ??
      source.photoUrl ??
      source.photo_url ??
      source.fotoUrl ??
      source.foto_url ??
      source.imageUrl ??
      source.image_url ??
      source.avatarUrl ??
      source.avatar_url;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export default function CompanyProfileScreen() {
  const { isDark, theme } = useTheme();

  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      loadCompanyProfile();
    }, [])
  );

  async function loadCompanyProfile() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        setCompany(null);
        router.replace("/login");
        return;
      }

      const savedCompanyData = await getCompanyData(loggedUser.id);

      const userId = String(loggedUser.id);
      const perfilId = String(loggedUser.perfilId ?? loggedUser.id);

      let rating: number | undefined;
      let reviewsCount: number | undefined;
      let totalJobs = 0;
      let completedJobs = 0;
      let satisfactionRate = 0;

      try {
        const idsParaBuscar = Array.from(
          new Set([userId, perfilId].filter(Boolean))
        );

        const avaliacoesRecebidas: AvaliacaoApi[] = [];

        for (const idParaBuscar of idsParaBuscar) {
          try {
            const avaliacoesResponse = await apiGet<AvaliacoesResponse>(
              `/api/Avaliacoes/usuario/${idParaBuscar}`
            );

            const avaliacoes = getAvaliacoesFromResponse(avaliacoesResponse);

            avaliacoesRecebidas.push(...avaliacoes);
          } catch (error) {
            console.log(
              `Erro ao buscar avaliações da empresa ${idParaBuscar}:`,
              error
            );
          }
        }

        const avaliacoesSemDuplicar =
          removeDuplicateReviews(avaliacoesRecebidas);

        const ratingData = calculateRating(avaliacoesSemDuplicar);

        rating = ratingData.rating;
        reviewsCount = ratingData.reviewsCount;
        satisfactionRate = ratingData.satisfactionRate;
      } catch (error) {
        console.log("Erro ao carregar avaliações da empresa:", error);
      }

      try {
        const contratosResponse = await apiGet<ContratosResponse>(
          `/api/Contratos/empresa/${perfilId}`
        );

        const contratos = getContratosFromResponse(contratosResponse);
        const finalizados = contratos.filter((contrato) =>
          isFinishedStatus(contrato.status)
        );

        totalJobs = contratos.length;
        completedJobs = finalizados.length;
      } catch (error) {
        console.log("Erro ao carregar contratos da empresa:", error);
      }

      setCompany({
        id: perfilId,
        name: savedCompanyData?.name || loggedUser.nome,
        type: "Empresa contratante",
        logoUrl: resolveImageUrl(savedCompanyData, loggedUser),
        isVerified: savedCompanyData?.isVerified ?? false,
        rating,
        reviewsCount,
        totalJobs,
        completedJobs,
        satisfactionRate,
        about:
          savedCompanyData?.about ||
          "Quando a empresa preencher a descrição, ela aparecerá aqui.",
        tags: savedCompanyData?.tags ?? [],
        location: savedCompanyData?.location || "Não informado",
        phone: savedCompanyData?.phone || loggedUser.telefone || "Não informado",
        email: savedCompanyData?.email || loggedUser.email,
      });
    } catch (error) {
      console.log("Erro ao carregar perfil da empresa:", error);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  }

  const menuOptions: MenuOption[] = [
    {
      id: "1",
      title: "Dados da empresa",
      subtitle: "Nome, CNPJ, telefone e endereço",
      Icon: BadgeIcon,
      action: () => router.push("/company-data"),
    },
    {
      id: "2",
      title: "Avaliações da empresa",
      subtitle: "Veja a reputação da sua empresa",
      Icon: StarIcon,
      action: () => router.push("/company-reviews"),
    },
    {
      id: "3",
      title: "Configurações",
      subtitle: "Notificações, privacidade e segurança",
      Icon: SettingsIcon,
      action: () => router.push("/company-settings"),
    },
    {
      id: "4",
      title: "Ajuda e suporte",
      subtitle: "E-mail e telefone de atendimento",
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
    router.push("/company-settings");
  }

  function getCompanyInitial() {
    if (!company?.name) {
      return "?";
    }

    return company.name.charAt(0).toUpperCase();
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
    return company?.rating !== undefined && company?.rating !== null;
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
              styles.companyCard,
              {
                backgroundColor: profileCardBackground,
                borderColor: profileCardBorder,
              },
            ]}
          >
            <Text style={styles.companyNameInverted}>
              Carregando perfil...
            </Text>

            <Text style={styles.companyTypeInverted}>
              Buscando dados da sua empresa.
            </Text>
          </View>
        ) : !company ? (
          <View
            style={[
              styles.companyCard,
              {
                backgroundColor: profileCardBackground,
                borderColor: profileCardBorder,
              },
            ]}
          >
            <View style={styles.logoArea}>
              <View style={styles.logoFallback}>
                <Text style={styles.logoInitialSmall}>?</Text>
              </View>
            </View>

            <Text style={styles.companyNameInverted}>
              Perfil não carregado
            </Text>

            <Text style={styles.companyTypeCentered}>
              Faça login novamente para carregar os dados da empresa.
            </Text>
          </View>
        ) : (
          <>
            <View
              style={[
                styles.companyCard,
                {
                  backgroundColor: profileCardBackground,
                  borderColor: profileCardBorder,
                },
              ]}
            >
              <View style={styles.logoArea}>
                {company.logoUrl ? (
                  <Image
                    source={{ uri: company.logoUrl }}
                    style={styles.logo}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.logoFallback}>
                    <Text style={styles.logoInitial}>
                      {getCompanyInitial()}
                    </Text>
                  </View>
                )}

                {company.isVerified && (
                  <View style={styles.verifiedBadge}>
                    <CheckIcon width={13} height={13} color={colors.white} />
                  </View>
                )}
              </View>

              <Text style={styles.companyNameInverted}>{company.name}</Text>

              <Text style={styles.companyTypeInverted}>{company.type}</Text>

              <View style={styles.ratingArea}>
                <Text style={styles.ratingIcon}>⭐</Text>

                {hasRatingData() ? (
                  <>
                    <Text style={styles.ratingTextInverted}>
                      {formatRating(company.rating)}
                    </Text>

                    <Text style={styles.ratingSubtextInverted}>
                      {" "}
                      ({company.reviewsCount ?? 0} avaliações)
                    </Text>
                  </>
                ) : (
                  <Text style={styles.ratingSubtextInverted}>
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
                    {formatStat(company.totalJobs)}
                  </Text>

                  <Text style={[styles.statLabel, { color: colors.gray }]}>
                    Chamados
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    { backgroundColor: colors.border },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.black }]}>
                    {formatStat(company.completedJobs)}
                  </Text>

                  <Text style={[styles.statLabel, { color: colors.gray }]}>
                    Concluídos
                  </Text>
                </View>

                <View
                  style={[
                    styles.statDivider,
                    { backgroundColor: colors.border },
                  ]}
                />

                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.black }]}>
                    {formatStat(company.satisfactionRate, "%")}
                  </Text>

                  <Text style={[styles.statLabel, { color: colors.gray }]}>
                    Satisfação
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
                Áreas de atuação
              </Text>

              {company.tags && company.tags.length > 0 ? (
                <View style={styles.tagsArea}>
                  {company.tags.map((tag) => (
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
                  Nenhuma área de atuação cadastrada ainda.
                </Text>
              )}

              <View style={styles.quickActionsRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.quickActionButton,
                    {
                      backgroundColor: actionButtonBackground,
                      borderColor: actionButtonBorder,
                    },
                    pressed && styles.quickActionButtonPressed,
                  ]}
                  onPress={() => router.push("/company-data")}
                >
                  <BadgeIcon
                    width={22}
                    height={22}
                    color={actionButtonTextColor}
                  />

                  <Text
                    style={[
                      styles.quickActionText,
                      { color: actionButtonTextColor },
                    ]}
                  >
                    Dados
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.quickActionButton,
                    {
                      backgroundColor: actionButtonBackground,
                      borderColor: actionButtonBorder,
                    },
                    pressed && styles.quickActionButtonPressed,
                  ]}
                  onPress={() => router.push("/company-settings")}
                >
                  <SettingsIcon
                    width={22}
                    height={22}
                    color={actionButtonTextColor}
                  />

                  <Text
                    style={[
                      styles.quickActionText,
                      { color: actionButtonTextColor },
                    ]}
                  >
                    Configurar
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
                Sobre a empresa
              </Text>

              <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
                {company.about}
              </Text>
            </View>

            <View
              style={[
                styles.contactCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Informações principais
              </Text>

              <View style={styles.contactRow}>
                <View
                  style={[
                    styles.contactIconBox,
                    {
                      backgroundColor: iconBoxBackground,
                      borderColor: iconBoxBorder,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <LocationIcon width={22} height={22} color={iconColor} />
                </View>

                <View style={styles.contactTextArea}>
                  <Text
                    style={[
                      styles.contactLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Localização
                  </Text>

                  <Text style={[styles.contactValue, { color: theme.text }]}>
                    {company.location ?? "Não informado"}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.border },
                ]}
              />

              <View style={styles.contactRow}>
                <View
                  style={[
                    styles.contactIconBox,
                    {
                      backgroundColor: iconBoxBackground,
                      borderColor: iconBoxBorder,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <SupportIcon width={22} height={22} color={iconColor} />
                </View>

                <View style={styles.contactTextArea}>
                  <Text
                    style={[
                      styles.contactLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Telefone
                  </Text>

                  <Text style={[styles.contactValue, { color: theme.text }]}>
                    {company.phone ?? "Não informado"}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.border },
                ]}
              />

              <View style={styles.contactRow}>
                <View
                  style={[
                    styles.contactIconBox,
                    {
                      backgroundColor: iconBoxBackground,
                      borderColor: iconBoxBorder,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <SendIcon width={22} height={22} color={iconColor} />
                </View>

                <View style={styles.contactTextArea}>
                  <Text
                    style={[
                      styles.contactLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    E-mail
                  </Text>

                  <Text style={[styles.contactValue, { color: theme.text }]}>
                    {company.email ?? "Não informado"}
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}

        <View style={styles.menuArea}>
          {menuOptions.map((option) => {
            const Icon = option.Icon;

            return (
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
                  <Icon width={24} height={24} color={iconColor} />
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
            );
          })}
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
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

export default function CompanyProfileScreen() {
  const { isDark, theme } = useTheme();

  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

      setCompany({
        id: loggedUser.perfilId ?? loggedUser.id,
        name: savedCompanyData?.name || loggedUser.nome,
        type: "Empresa contratante",
        logoUrl: savedCompanyData?.logoUrl,
        isVerified: savedCompanyData?.isVerified ?? false,
        reviewsCount: 0,
        totalJobs: 0,
        completedJobs: 0,
        satisfactionRate: 0,
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

  const iconColor = colors.black;
  const iconBoxBackground = isDark ? colors.white : colors.lightGray;
  const iconBoxBorder = isDark ? colors.white : colors.border;

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

  async function handleLogout() {
    try {
      await logout();
      router.replace("/welcome");
    } catch (error) {
      console.log("Erro ao sair da conta:", error);
      router.replace("/welcome");
    }
  }

  function getCompanyInitial() {
    if (!company?.name) {
      return "?";
    }

    return company.name.charAt(0).toUpperCase();
  }

  function getRatingText() {
    if (!company?.rating) {
      return "Sem avaliações";
    }

    return company.rating.toFixed(1).replace(".", ",");
  }

  function getReviewsText() {
    const reviewsCount = company?.reviewsCount ?? 0;

    if (reviewsCount === 0) {
      return "";
    }

    return `• ${reviewsCount} avaliações`;
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
          <View style={styles.headerPlaceholder} />

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Perfil da empresa
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

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
            {company?.logoUrl ? (
              <Image
                source={{ uri: company.logoUrl }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.logo,
                  {
                    backgroundColor: theme.inputBackground,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 28,
                    fontWeight: "900",
                  }}
                >
                  {getCompanyInitial()}
                </Text>
              </View>
            )}

            {company?.isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckIcon width={13} height={13} color={colors.white} />
              </View>
            )}
          </View>

          <Text style={[styles.companyName, { color: theme.text }]}>
            {isLoading
              ? "Carregando..."
              : company?.name ?? "Perfil não carregado"}
          </Text>

          <Text style={[styles.companyType, { color: theme.textSecondary }]}>
            {company?.type ?? "Empresa contratante"}
          </Text>

          <View style={styles.ratingArea}>
            <StarIcon width={17} height={17} color={colors.warning} />

            <Text style={[styles.ratingText, { color: theme.text }]}>
              {getRatingText()}
            </Text>

            {getReviewsText() !== "" && (
              <Text
                style={[
                  styles.ratingSubtext,
                  { color: theme.textSecondary },
                ]}
              >
                {getReviewsText()}
              </Text>
            )}
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
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {company?.totalJobs ?? 0}
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
                {company?.completedJobs ?? 0}
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
                {company?.satisfactionRate ?? 0}%
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
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
            Sobre a empresa
          </Text>

          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            {company?.about ??
              "Quando a empresa preencher a descrição, ela aparecerá aqui."}
          </Text>

          {company?.tags && company.tags.length > 0 && (
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
          )}
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
            <View style={styles.contactIconBox}>
              <LocationIcon width={22} height={22} color={colors.black} />
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
                {company?.location ?? "Não informado"}
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
            <View style={styles.contactIconBox}>
              <SupportIcon width={22} height={22} color={colors.black} />
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
                {company?.phone ?? "Não informado"}
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
            <View style={styles.contactIconBox}>
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
                {company?.email ?? "Não informado"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuArea}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Opções da empresa
          </Text>

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
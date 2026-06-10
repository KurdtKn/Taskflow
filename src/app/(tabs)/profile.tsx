import { getLoggedUser } from "@/services/storage";
import { logout } from "@/services/authService";
import type { ComponentType } from "react";
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
import { router } from "expo-router";

import { styles } from "@/app/styles/profile";
import { useTheme } from "@/app/context/ThemeContext";

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

export default function ProfileScreen() {
  const { isDark, theme } = useTheme();

  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        setProfile(null);
        router.replace("/login");
        return;
      }

      setProfile({
        id: loggedUser.perfilId ?? loggedUser.id,
        name: loggedUser.nome,
        userType: "Freelancer",
        photoUrl: "",
        rating: undefined,
        reviewsCount: undefined,
        completedServices: undefined,
        acceptanceRate: undefined,
        punctuality: undefined,
        about:
          "Quando você preencher a descrição do perfil, ela aparecerá aqui.",
        tags: [],
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

  async function handleLogout() {
    try {
      await logout();
      router.replace("/welcome");
    } catch (error) {
      console.log("Erro ao sair da conta:", error);
      router.replace("/welcome");
    }
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
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && {
                opacity: 0.75,
                transform: [{ scale: 0.96 }],
              },
            ]}
            onPress={handleOpenSettings}
          >
            <SettingsIcon width={24} height={24} />
          </Pressable>
        </View>

        {isLoading ? (
          <View style={styles.profileCard}>
            <Text style={styles.userName}>Carregando perfil...</Text>

            <Text style={styles.userType}>
              Buscando dados da sua conta.
            </Text>
          </View>
        ) : !profile ? (
          <View style={styles.profileCard}>
            <View style={styles.avatarArea}>
              <View
                style={[
                  styles.avatar,
                  {
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#0B57D0",
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
            <View style={styles.profileCard}>
              <View style={styles.avatarArea}>
                {profile.photoUrl ? (
                  <Image
                    source={{ uri: profile.photoUrl }}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      {
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#FFFFFF",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: "#0B57D0",
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

              <View style={styles.statsArea}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {formatStat(profile.completedServices)}
                  </Text>

                  <Text style={styles.statLabel}>Serviços</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {formatStat(profile.acceptanceRate, "%")}
                  </Text>

                  <Text style={styles.statLabel}>Concluídos</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {formatRating(profile.punctuality)}
                  </Text>

                  <Text style={styles.statLabel}>Pontualidade</Text>
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
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
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
                      backgroundColor: "rgba(11,87,208,0.10)",
                      borderWidth: 1,
                      borderColor: "rgba(11,87,208,0.18)",
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
                  <BadgeIcon width={22} height={22} />

                  <Text
                    style={{
                      color: "#0B57D0",
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
                      backgroundColor: "rgba(11,87,208,0.10)",
                      borderWidth: 1,
                      borderColor: "rgba(11,87,208,0.18)",
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
                  <EditIcon width={22} height={22} />

                  <Text
                    style={{
                      color: "#0B57D0",
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
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <option.Icon width={24} height={24} />
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
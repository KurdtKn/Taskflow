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
  activeServices?: number;
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
        reviewsCount: 0,
        completedServices: 0,
        acceptanceRate: 0,
        activeServices: 0,
        about: "Quando você preencher a descrição do perfil, ela aparecerá aqui.",
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
      title: "Editar perfil",
      subtitle: "Nome, telefone, foto e dados pessoais",
      Icon: EditIcon,
      action: () => router.push("/edit-profile"),
    },
    {
      id: "2",
      title: "Portfólio",
      subtitle: "Experiências, habilidades e trabalhos",
      Icon: BadgeIcon,
      action: () => router.push("/portfolio"),
    },
    {
      id: "3",
      title: "Minhas solicitações",
      subtitle: "Acompanhe serviços solicitados",
      Icon: AssignmentIcon,
      action: () => router.push("/requests"),
    },
    {
      id: "4",
      title: "Avaliações",
      subtitle: "Veja sua reputação no TaskFlow",
      Icon: StarIcon,
      action: () => router.push("/reviews"),
    },
    {
      id: "5",
      title: "Configurações",
      subtitle: "Preferências, segurança e privacidade",
      Icon: SettingsIcon,
      action: () => router.push("/freelancer-settings"),
    },
    {
      id: "6",
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
            Meu perfil
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.settingsButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
            onPress={handleOpenSettings}
          >
            <SettingsIcon width={24} height={24} />
          </Pressable>
        </View>

        {isLoading ? (
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.userName, { color: theme.text }]}>
              Carregando perfil...
            </Text>

            <Text style={[styles.userType, { color: theme.textSecondary }]}>
              Buscando dados da sua conta.
            </Text>
          </View>
        ) : !profile ? (
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.avatarArea}>
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: theme.inputBackground,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 28,
                    fontWeight: "900",
                  }}
                >
                  ?
                </Text>
              </View>
            </View>

            <Text style={[styles.userName, { color: theme.text }]}>
              Perfil não carregado
            </Text>

            <Text
              style={[
                styles.userType,
                {
                  color: theme.textSecondary,
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
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
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
                        backgroundColor: theme.inputBackground,
                        alignItems: "center",
                        justifyContent: "center",
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
                      {getProfileInitial()}
                    </Text>
                  </View>
                )}

                <View style={styles.onlineBadge} />
              </View>

              <Text style={[styles.userName, { color: theme.text }]}>
                {profile.name}
              </Text>

              <Text style={[styles.userType, { color: theme.textSecondary }]}>
                {profile.userType}
              </Text>

              {profile.rating !== undefined && (
                <View style={styles.ratingArea}>
                  <Text style={{ fontSize: 16 }}>⭐</Text>

                  <Text style={[styles.ratingText, { color: theme.text }]}>
                    {profile.rating.toFixed(1).replace(".", ",")}
                  </Text>

                  <Text
                    style={[
                      styles.ratingSubtext,
                      { color: theme.textSecondary },
                    ]}
                  >
                    • {profile.reviewsCount ?? 0} avaliações
                  </Text>
                </View>
              )}

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
                    {profile.completedServices ?? 0}
                  </Text>

                  <Text
                    style={[styles.statLabel, { color: theme.textSecondary }]}
                  >
                    Serviços
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
                    {profile.acceptanceRate ?? 0}%
                  </Text>

                  <Text
                    style={[styles.statLabel, { color: theme.textSecondary }]}
                  >
                    Aceitação
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
                    {profile.activeServices ?? 0}
                  </Text>

                  <Text
                    style={[styles.statLabel, { color: theme.textSecondary }]}
                  >
                    Ativos
                  </Text>
                </View>
              </View>
            </View>

            {(profile.about || profile.tags?.length) && (
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
                  Sobre
                </Text>

                {profile.about && (
                  <Text
                    style={[styles.aboutText, { color: theme.textSecondary }]}
                  >
                    {profile.about}
                  </Text>
                )}

                {profile.tags && profile.tags.length > 0 && (
                  <View style={styles.tagsArea}>
                    {profile.tags.map((tag) => (
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
            )}
          </>
        )}

        <View style={styles.menuArea}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Opções da conta
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
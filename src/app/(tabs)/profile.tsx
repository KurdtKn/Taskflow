import type { ComponentType } from "react";
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

export default function ProfileScreen() {
  const { isDark, theme } = useTheme();

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
      action: () => router.push("/freelancer-support"),
    },
  ];

  function handleLogout() {
    router.replace("/welcome");
  }

  function handleOpenSettings() {
    router.push("/freelancer-settings");
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
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.avatar}
              resizeMode="contain"
            />

            <View style={styles.onlineBadge} />
          </View>

          <Text style={[styles.userName, { color: theme.text }]}>
            Usuário TaskFlow
          </Text>

          <Text style={[styles.userType, { color: theme.textSecondary }]}>
            Freelancer
          </Text>

          <View style={styles.ratingArea}>
            <Text style={{ fontSize: 16 }}>⭐</Text>

            <Text style={[styles.ratingText, { color: theme.text }]}>
              4,8
            </Text>

            <Text style={[styles.ratingSubtext, { color: theme.textSecondary }]}>
              • 24 avaliações
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
                18
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
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
                92%
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
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
                4
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Ativos
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
            Sobre
          </Text>

          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Profissional disponível para serviços sob demanda, eventos e
            atividades rápidas. Perfil em desenvolvimento para o protótipo do
            TaskFlow.
          </Text>

          <View style={styles.tagsArea}>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.text }]}>
                Eventos
              </Text>
            </View>

            <View
              style={[
                styles.tag,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.text }]}>
                Serviços gerais
              </Text>
            </View>

            <View
              style={[
                styles.tag,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.text }]}>
                Disponível
              </Text>
            </View>
          </View>
        </View>

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

                <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>
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
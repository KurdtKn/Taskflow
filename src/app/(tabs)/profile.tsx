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

type MenuOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
};

export default function ProfileScreen() {
  const menuOptions: MenuOption[] = [
    {
      id: "1",
      title: "Editar perfil",
      subtitle: "Nome, telefone, foto e dados pessoais",
      icon: "✏️",
      action: () => router.push("/edit-profile"),
    },
    {
      id: "2",
      title: "Portfólio",
      subtitle: "Experiências, habilidades e trabalhos",
      icon: "💼",
      action: () => router.push("/portfolio"),
    },
    {
      id: "3",
      title: "Minhas solicitações",
      subtitle: "Acompanhe serviços solicitados",
      icon: "📋",
      action: () => router.push("/requests"),
    },
    {
      id: "4",
      title: "Avaliações",
      subtitle: "Veja sua reputação no TaskFlow",
      icon: "⭐",
      action: () => router.push("/reviews"),
    },
    {
      id: "5",
      title: "Configurações",
      subtitle: "Preferências, segurança e privacidade",
      icon: "⚙️",
      action: () => console.log("Abrir configurações"),
    },
    {
      id: "6",
      title: "Ajuda e suporte",
      subtitle: "Central de dúvidas e atendimento",
      icon: "❔",
      action: () => router.push("/freelancer-support"),
    },
  ];

  function handleLogout() {
    router.replace("/welcome");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu perfil</Text>

          <Pressable style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </Pressable>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarArea}>
            <Image
              source={require("../../../assets/images/icon.png")}
              style={styles.avatar}
              resizeMode="contain"
            />

            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.userName}>Usuário TaskFlow</Text>
          <Text style={styles.userType}>Freelancer</Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingText}>4,8</Text>
            <Text style={styles.ratingSubtext}>• 24 avaliações</Text>
          </View>

          <View style={styles.statsArea}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>18</Text>
              <Text style={styles.statLabel}>Serviços</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>92%</Text>
              <Text style={styles.statLabel}>Aceitação</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Ativos</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Sobre</Text>

          <Text style={styles.aboutText}>
            Profissional disponível para serviços sob demanda, eventos e
            atividades rápidas. Perfil em desenvolvimento para o protótipo do
            TaskFlow.
          </Text>

          <View style={styles.tagsArea}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Eventos</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>Serviços gerais</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>Disponível</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuArea}>
          <Text style={styles.sectionTitle}>Opções da conta</Text>

          {menuOptions.map((option) => (
            <Pressable
              key={option.id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={option.action}
            >
              <View style={styles.menuIconBox}>
                <Text style={styles.menuIcon}>{option.icon}</Text>
              </View>

              <View style={styles.menuTextArea}>
                <Text style={styles.menuTitle}>{option.title}</Text>
                <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
              </View>

              <Text style={styles.menuArrow}>›</Text>
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
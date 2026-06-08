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

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/companyProfile";

type MenuOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
};

export default function CompanyProfileScreen() {
  const menuOptions: MenuOption[] = [
    {
      id: "1",
      title: "Dados da empresa",
      subtitle: "Nome, CNPJ, telefone e endereço",
      icon: "🏢",
      action: () => router.push("/company-data"),
    },
    {
      id: "2",
      title: "Chamados publicados",
      subtitle: "Gerencie suas demandas abertas",
      icon: "📋",
      action: () => router.replace("/company-dashboard"),
    },
    {
      id: "3",
      title: "Pagamentos",
      subtitle: "Taxas, histórico e transações",
      icon: "💳",
      action: () => router.push("/company-reviews"),
    },
    {
      id: "4",
      title: "Avaliações da empresa",
      subtitle: "Veja a reputação da sua empresa",
      icon: "⭐",
      action: () => router.push("/company-reviews"),
    },
    {
      id: "5",
      title: "Notificações",
      subtitle: "Candidaturas, pagamentos e mensagens",
      icon: "🔔",
      action: () => router.push("/company-notifications"),
    },
    {
       id: "6",
       title: "Configurações",
       subtitle: "Notificações, privacidade e segurança",
       icon: "⚙️",
       action: () => router.push("/company-settings"),
    },
    {
      id: "7",
      title: "Ajuda e suporte",
      subtitle: "Central de dúvidas e atendimento",
      icon: "❔",
      action: () => router.push("/company-support"),
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
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <Text style={styles.headerTitle}>Perfil da empresa</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.companyCard}>
          <View style={styles.logoArea}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          </View>

          <Text style={styles.companyName}>TaskFlow Eventos</Text>

          <Text style={styles.companyType}>Empresa contratante</Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingText}>4,9</Text>
            <Text style={styles.ratingSubtext}>• 32 avaliações</Text>
          </View>

          <View style={styles.statsArea}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Chamados</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>96%</Text>
              <Text style={styles.statLabel}>Satisfação</Text>
            </View>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Sobre a empresa</Text>

          <Text style={styles.aboutText}>
            Empresa focada na organização de eventos, contratação de profissionais
            temporários e serviços sob demanda. Utiliza o TaskFlow para encontrar
            freelancers qualificados de forma rápida, segura e organizada.
          </Text>

          <View style={styles.tagsArea}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Eventos</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>Contratação rápida</Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>Empresa verificada</Text>
            </View>
          </View>
        </View>

        <View style={styles.contactCard}>
          <Text style={styles.sectionTitle}>Informações principais</Text>

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📍</Text>

            <View style={styles.contactTextArea}>
              <Text style={styles.contactLabel}>Localização</Text>
              <Text style={styles.contactValue}>Sorocaba - SP</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>📞</Text>

            <View style={styles.contactTextArea}>
              <Text style={styles.contactLabel}>Telefone</Text>
              <Text style={styles.contactValue}>(15) 99999-9999</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <Text style={styles.contactIcon}>✉️</Text>

            <View style={styles.contactTextArea}>
              <Text style={styles.contactLabel}>E-mail</Text>
              <Text style={styles.contactValue}>empresa@taskflow.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuArea}>
          <Text style={styles.sectionTitle}>Opções da empresa</Text>

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
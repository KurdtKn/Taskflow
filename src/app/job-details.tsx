import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/jobDetails";
import { useTheme } from "@/app/context/ThemeContext";

export default function JobDetailsScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    category?: string;
    price?: string;
    distance?: string;
    location?: string;
    time?: string;
  }>();

  const { isDark, theme } = useTheme();

  const title = params.title ?? "Garçom para Evento";
  const category = params.category ?? "Evento";
  const price = params.price ?? "R$200,00";
  const distance = params.distance ?? "1,5 km";
  const location = params.location ?? "Centro";
  const time = params.time ?? "Hoje, 18:00";

  function handleRequestService() {
    console.log("Solicitar atendimento:", title);

    router.push({
      pathname: "/request-confirmation",
      params: {
        title,
        price,
        location,
        time,
      },
    });
  }

  function handleViewCompanyProfile() {
    router.push({
      pathname: "/company-public-profile",
      params: {
        companyName: "TaskFlow Eventos",
        companyLocation: location,
        companyRating: "4,9",
        jobTitle: title,
      },
    });
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
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Detalhes do chamado
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View
          style={[
            styles.imagePlaceholder,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <SettingsIcon width={46} height={46} />
        </View>

        <View style={styles.titleArea}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>
            {title}
          </Text>

          <Text style={styles.price}>{price}</Text>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LocationIcon width={22} height={22} color="#e62727"/>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Localização
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {distance} - {location}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <TimeIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Data e horário
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {time}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Descrição do serviço
          </Text>

          <Text style={[styles.description, { color: theme.textSecondary }]}>
            A empresa está procurando um profissional disponível para atender
            este chamado de forma pontual, com responsabilidade, boa comunicação
            e experiência na categoria informada. O freelancer deverá comparecer
            no local indicado e realizar o serviço conforme os detalhes
            combinados após a aprovação da solicitação.
          </Text>
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
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>TF</Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={[styles.companyName, { color: theme.text }]}>
              TaskFlow Eventos
            </Text>

            <Text style={[styles.companyRating, { color: theme.textSecondary }]}>
              ⭐ 4,8 • Empresa verificada
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.companyProfileButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.companyProfileButtonPressed,
          ]}
          onPress={handleViewCompanyProfile}
        >
          <Text style={[styles.companyProfileButtonText, { color: theme.text }]}>
            Ver perfil da empresa
          </Text>
        </Pressable>

        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            O chat será liberado somente após a empresa aceitar sua solicitação e
            confirmar o fluxo do chamado.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRequestService}
        >
          <Text style={styles.buttonText}>Solicitar atendimento</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
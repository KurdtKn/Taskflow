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

import ArrowBack from "../../assets/icons/arrow_back.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/jobDetails";
import { useTheme } from "@/app/context/ThemeContext";

export default function JobDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
    description?: string | string[];
    company?: string | string[];
    category?: string | string[];
    price?: string | string[];
    distance?: string | string[];
    location?: string | string[];
    time?: string | string[];
    imageUrl?: string | string[];
  }>();

  const { isDark, theme } = useTheme();

  function getParamValue(value?: string | string[], fallback = "") {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }

    return value ?? fallback;
  }

  const id = getParamValue(params.id);
  const title = getParamValue(params.title, "Chamado disponível");
  const description = getParamValue(
    params.description,
    "A empresa está procurando um profissional disponível para atender este chamado de forma pontual, com responsabilidade, boa comunicação e experiência na categoria informada."
  );
  const company = getParamValue(params.company, "Empresa não informada");
  const category = getParamValue(params.category, "Categoria");
  const price = getParamValue(params.price, "A combinar");
  const distance = getParamValue(params.distance, "Perto de você");
  const location = getParamValue(params.location, "Local não informado");
  const time = getParamValue(params.time, "Data a combinar");
  const imageUrl = getParamValue(params.imageUrl);

  function getCompanyInitials() {
    const words = company.trim().split(" ").filter(Boolean);

    if (words.length === 0) {
      return "TF";
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }

  function handleRequestService() {
    console.log("Solicitar atendimento:", {
      id,
      title,
      company,
    });

    router.push({
      pathname: "/request-confirmation",
      params: {
        id,
        title,
        description,
        company,
        category,
        price,
        location,
        time,
        imageUrl,
      },
    });
  }

  function handleViewCompanyProfile() {
    router.push({
      pathname: "/company-public-profile",
      params: {
        companyName: company,
        companyLocation: location,
        companyRating: "4,8",
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
              overflow: "hidden",
            },
          ]}
        >
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={{
                width: "100%",
                height: "100%",
              }}
              resizeMode="cover"
            />
          ) : (
            <SettingsIcon width={46} height={46} />
          )}
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
              <LocationIcon width={22} height={22} color="#e62727" />
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
            {description}
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
            <Text style={styles.companyAvatarText}>
              {getCompanyInitials()}
            </Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={[styles.companyName, { color: theme.text }]}>
              {company}
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
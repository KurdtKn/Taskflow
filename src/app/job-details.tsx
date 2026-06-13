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
import { colors } from "@/styles/colors";

export default function JobDetailsScreen() {
  const params = useLocalSearchParams<{
    id?: string | string[];
    title?: string | string[];
    description?: string | string[];
    company?: string | string[];
    category?: string | string[];
    price?: string | string[];
    pricePerProfessional?: string | string[];
    paymentInfoText?: string | string[];
    distance?: string | string[];
    location?: string | string[];
    time?: string | string[];
    imageUrl?: string | string[];
    totalProfessionals?: string | string[];
    acceptedProfessionals?: string | string[];
    availableSpots?: string | string[];
  }>();

  const { isDark, theme } = useTheme();

  const infoIconColor = colors.black;
  const fallbackIconColor = isDark ? colors.white : colors.black;

  function getParamValue(value?: string | string[], fallback = "") {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }

    return value ?? fallback;
  }

  function getParamNumber(value?: string | string[], fallback = 0) {
    const paramValue = getParamValue(value);
    const parsedValue = Number(paramValue);

    if (Number.isNaN(parsedValue)) {
      return fallback;
    }

    return parsedValue;
  }

  function getVacanciesText(value: number) {
    if (value <= 0) {
      return "Sem vagas disponíveis";
    }

    if (value === 1) {
      return "1 vaga disponível";
    }

    return `${value} vagas disponíveis`;
  }

  function parsePriceToNumber(value: string) {
    if (!value || value === "A combinar") {
      return 0;
    }

    const numbersOnly = value.replace(/\D/g, "");

    if (!numbersOnly) {
      return 0;
    }

    return Number(numbersOnly) / 100;
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function calculatePricePerProfessionalText(
    totalValueText: string,
    totalProfessionalsValue: number
  ) {
    const totalValue = parsePriceToNumber(totalValueText);
    const safeTotalProfessionals =
      totalProfessionalsValue > 0 ? totalProfessionalsValue : 1;

    if (!totalValue || totalValue <= 0) {
      return "A combinar";
    }

    return formatCurrency(totalValue / safeTotalProfessionals);
  }

  function calculatePaymentInfoText(
    totalValueText: string,
    totalProfessionalsValue: number
  ) {
    const totalValue = parsePriceToNumber(totalValueText);
    const safeTotalProfessionals =
      totalProfessionalsValue > 0 ? totalProfessionalsValue : 1;

    if (!totalValue || totalValue <= 0) {
      if (safeTotalProfessionals > 1) {
        return `Valor a combinar • ${safeTotalProfessionals} profissionais`;
      }

      return "Valor a combinar";
    }

    if (safeTotalProfessionals > 1) {
      const valuePerProfessional = totalValue / safeTotalProfessionals;

      return `${formatCurrency(
        valuePerProfessional
      )} por freelancer • total ${formatCurrency(totalValue)}`;
    }

    return `${formatCurrency(totalValue)} para 1 profissional`;
  }

  const id = getParamValue(params.id);
  const title = getParamValue(params.title, "Chamado disponível");
  const description = getParamValue(
    params.description,
    "A descrição deste chamado será carregada conforme os dados cadastrados pela empresa."
  );
  const company = getParamValue(params.company, "Empresa não informada");
  const category = getParamValue(params.category, "Categoria");
  const price = getParamValue(params.price, "A combinar");
  const distance = getParamValue(params.distance, "Perto de você");
  const location = getParamValue(params.location, "Local não informado");
  const time = getParamValue(params.time, "Data a combinar");
  const imageUrl = getParamValue(params.imageUrl);

  const totalProfessionals = getParamNumber(params.totalProfessionals, 1);
  const acceptedProfessionals = getParamNumber(params.acceptedProfessionals, 0);
  const availableSpotsFromParams = getParamNumber(params.availableSpots, -1);

  const availableSpots =
    availableSpotsFromParams >= 0
      ? availableSpotsFromParams
      : Math.max(totalProfessionals - acceptedProfessionals, 0);

  const hasAvailableSpots = availableSpots > 0;
  const vacanciesText = getVacanciesText(availableSpots);

  const pricePerProfessional = getParamValue(
    params.pricePerProfessional,
    calculatePricePerProfessionalText(price, totalProfessionals)
  );

  const paymentInfoText = getParamValue(
    params.paymentInfoText,
    calculatePaymentInfoText(price, totalProfessionals)
  );

  const isMultipleProfessionals = totalProfessionals > 1;

  function getCompanyInitials() {
    const words = company.trim().split(" ").filter(Boolean);

    if (words.length === 0 || company === "Empresa não informada") {
      return "API";
    }

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
  }

  function handleRequestService() {
    if (!hasAvailableSpots) {
      return;
    }

    console.log("Solicitar atendimento:", {
      id,
      title,
      company,
      price,
      pricePerProfessional,
      paymentInfoText,
      totalProfessionals,
      acceptedProfessionals,
      availableSpots,
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
        pricePerProfessional,
        paymentInfoText,
        location,
        time,
        imageUrl,
        totalProfessionals: String(totalProfessionals),
        acceptedProfessionals: String(acceptedProfessionals),
        availableSpots: String(availableSpots),
      },
    });
  }

  function handleViewCompanyProfile() {
    router.push({
      pathname: "/company-public-profile",
      params: {
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
        style={{ backgroundColor: theme.background }}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} color={theme.text} />
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
            <SettingsIcon
              width={46}
              height={46}
              color={fallbackIconColor}
              fill={fallbackIconColor}
            />
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

          <View
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(11,87,208,0.08)",
              borderWidth: 1,
              borderColor: isDark
                ? "rgba(255,255,255,0.16)"
                : "rgba(11,87,208,0.18)",
              marginTop: 8,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              {paymentInfoText}
            </Text>
          </View>

          {isMultipleProfessionals && (
            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                fontWeight: "700",
                lineHeight: 19,
                marginBottom: 10,
              }}
            >
              Este chamado precisa de {totalProfessionals} freelancers. O valor
              total será dividido entre os profissionais aceitos. Cada freelancer
              recebe aproximadamente {pricePerProfessional}.
            </Text>
          )}

          <View
            style={[
              styles.vacancyBadge,
              hasAvailableSpots
                ? styles.vacancyBadgeOpen
                : styles.vacancyBadgeClosed,
            ]}
          >
            <View
              style={[
                styles.vacancyDot,
                hasAvailableSpots
                  ? styles.vacancyDotOpen
                  : styles.vacancyDotClosed,
              ]}
            />

            <Text
              style={[
                styles.vacancyText,
                hasAvailableSpots
                  ? styles.vacancyTextOpen
                  : styles.vacancyTextClosed,
              ]}
            >
              {vacanciesText}
            </Text>
          </View>
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
              <LocationIcon
                width={22}
                height={22}
                color={infoIconColor}
                fill={infoIconColor}
              />
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
              <TimeIcon
                width={22}
                height={22}
                color={infoIconColor}
                fill={infoIconColor}
              />
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

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Text
                style={{
                  color: infoIconColor,
                  fontSize: 18,
                  fontWeight: "900",
                }}
              >
                R$
              </Text>
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Valor por freelancer
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {pricePerProfessional}
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
              Nota e verificação via API
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
            {hasAvailableSpots
              ? isMultipleProfessionals
                ? `O chat será liberado somente após a empresa aceitar sua solicitação. O valor total do chamado será dividido entre ${totalProfessionals} freelancers.`
                : "O chat será liberado somente após a empresa aceitar sua solicitação e confirmar o fluxo do chamado."
              : "Este chamado não possui vagas disponíveis no momento."}
          </Text>
        </View>

        <Pressable
          disabled={!hasAvailableSpots}
          style={({ pressed }) => [
            styles.button,
            !hasAvailableSpots && styles.buttonDisabled,
            pressed && hasAvailableSpots && styles.buttonPressed,
          ]}
          onPress={handleRequestService}
        >
          <Text style={styles.buttonText}>
            {hasAvailableSpots
              ? "Solicitar atendimento"
              : "Sem vagas disponíveis"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
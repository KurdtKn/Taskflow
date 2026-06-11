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

export default function JobSummaryScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    category?: string;
    price?: string;
    distance?: string;
    location?: string;
    time?: string;
  }>();

  const title = params.title ?? "Chamado disponível";
  const category = params.category ?? "Categoria";
  const price = params.price ?? "A combinar";
  const distance = params.distance ?? "Perto de você";
  const location = params.location ?? "Local não informado";
  const time = params.time ?? "Data a combinar";

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
        jobTitle: title,

        /*
          Futuramente, quando a API retornar o ID da empresa no chamado,
          enviar aqui:

          companyId: empresaId,
        */
      },
    });
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

          <Text style={styles.headerTitle}>Detalhes do chamado</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <View style={styles.imagePlaceholder}>
          <SettingsIcon width={46} height={46} />
        </View>

        <View style={styles.titleArea}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          <Text style={styles.price}>{price}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LocationIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoLabel}>Localização</Text>

              <Text style={styles.infoValue}>
                {distance} - {location}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <TimeIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoLabel}>Data e horário</Text>

              <Text style={styles.infoValue}>{time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do serviço</Text>

          <Text style={styles.description}>
            A descrição deste chamado será carregada conforme os dados
            cadastrados pela empresa na API.
          </Text>
        </View>

        <View style={styles.companyCard}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>API</Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Empresa via API</Text>

            <Text style={styles.companyRating}>
              Nota e verificação via API
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.companyProfileButton,
            pressed && styles.companyProfileButtonPressed,
          ]}
          onPress={handleViewCompanyProfile}
        >
          <Text style={styles.companyProfileButtonText}>
            Ver perfil da empresa
          </Text>
        </Pressable>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
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
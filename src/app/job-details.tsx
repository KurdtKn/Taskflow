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
import { styles } from "@/app/styles/jobDetails";

export default function JobDetailsScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    category?: string;
    price?: string;
    distance?: string;
    location?: string;
    time?: string;
  }>();

  const title = params.title ?? "Garçom para Evento";
  const category = params.category ?? "Evento";
  const price = params.price ?? "R$200,00";
  const distance = params.distance ?? "1,5 km";
  const location = params.location ?? "Centro";
  const time = params.time ?? "Hoje, 18:00";

  function handleRequestService() {
    console.log("Solicitar atendimento:", title);

    // Próxima etapa: criar tela de confirmação da solicitação
    // router.push("/request-confirmation");
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
          <Text style={styles.imageIcon}>🛠️</Text>
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
              <Text style={styles.infoIcon}>📍</Text>
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
              <Text style={styles.infoIcon}>🕒</Text>
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
            A empresa está procurando um profissional disponível para atender este
            chamado de forma pontual, com responsabilidade, boa comunicação e
            experiência na categoria informada. O freelancer deverá comparecer no
            local indicado e realizar o serviço conforme os detalhes combinados após
            a aprovação da solicitação.
          </Text>
        </View>

        <View style={styles.companyCard}>
          <View style={styles.companyAvatar}>
            <Text style={styles.companyAvatarText}>TF</Text>
          </View>

          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>TaskFlow Eventos</Text>
            <Text style={styles.companyRating}>⭐ 4,8 • Empresa verificada</Text>
          </View>
        </View>

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
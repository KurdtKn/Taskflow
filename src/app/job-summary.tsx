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
import { styles } from "@/app/styles/jobSummary";

function parseCurrency(value: string) {
  const cleanedValue = value
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const parsedValue = Number(cleanedValue);

  if (Number.isNaN(parsedValue)) {
    return 0;
  }

  return parsedValue;
}

function formatCurrency(value: number) {
  return `R$${value.toFixed(2).replace(".", ",")}`;
}

export default function JobSummaryScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    jobCategory?: string;
    jobPrice?: string;
    jobLocation?: string;
    jobTime?: string;
    candidateName?: string;
    candidateRating?: string;
    candidatePrice?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const jobCategory = params.jobCategory ?? "Eventos";
  const jobPrice = params.jobPrice ?? "R$200,00";
  const jobLocation = params.jobLocation ?? "Centro";
  const jobTime = params.jobTime ?? "Hoje, 18:00";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";
  const candidateRating = params.candidateRating ?? "4.8";
  const candidatePrice = params.candidatePrice ?? jobPrice;

  const serviceValue = parseCurrency(candidatePrice);
  const platformFee = serviceValue * 0.1;
  const totalValue = serviceValue + platformFee;

  function handleConfirmAcceptance() {
    router.push({
      pathname: "/payment",
      params: {
        jobTitle,
        candidateName,
        serviceValue: formatCurrency(serviceValue),
        platformFee: formatCurrency(platformFee),
        totalValue: formatCurrency(totalValue),
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Resumo do chamado</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.successCard}>
          <View style={styles.successIconBox}>
            <Text style={styles.successIcon}>✓</Text>
          </View>

          <Text style={styles.successTitle}>Candidato selecionado</Text>

          <Text style={styles.successText}>
            Revise as informações antes de confirmar o aceite do freelancer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados do chamado</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serviço</Text>
              <Text style={styles.infoValue}>{jobTitle}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValue}>{jobCategory}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Local</Text>
              <Text style={styles.infoValue}>{jobLocation}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Horário</Text>
              <Text style={styles.infoValue}>{jobTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Freelancer escolhido</Text>

          <View style={styles.candidateCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {candidateName.charAt(0).toUpperCase()}
              </Text>
            </View>

            <View style={styles.candidateInfo}>
              <Text style={styles.candidateName}>{candidateName}</Text>
              <Text style={styles.candidateType}>Freelancer</Text>

              <View style={styles.ratingArea}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>
                  {candidateRating} • Perfil avaliado
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo financeiro</Text>

          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Valor do serviço</Text>
              <Text style={styles.paymentValue}>
                {formatCurrency(serviceValue)}
              </Text>
            </View>

            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Taxa da plataforma</Text>
              <Text style={styles.paymentValue}>
                {formatCurrency(platformFee)}
              </Text>
            </View>

            <View style={styles.paymentDivider} />

            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total estimado</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(totalValue)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Importante</Text>

          <Text style={styles.warningText}>
            Após confirmar o aceite, o próximo passo será o pagamento da taxa da
            plataforma. O chat será liberado somente após a confirmação do
            pagamento.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
          ]}
          onPress={handleConfirmAcceptance}
        >
          <Text style={styles.confirmButtonText}>Confirmar aceite</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Voltar para candidatos</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
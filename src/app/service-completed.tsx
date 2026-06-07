import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "@/app/styles/serviceCompleted";

export default function ServiceCompletedScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";

  function handleRateFreelancer() {
    router.push({
      pathname: "/rate-service",
      params: {
        jobTitle,
        candidateName,
      },
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Serviço concluído!</Text>

        <Text style={styles.subtitle}>
          O chamado foi encerrado com sucesso. Agora você pode avaliar o
          freelancer e registrar sua experiência.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Resumo do serviço</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chamado</Text>
            <Text style={styles.infoValue}>{jobTitle}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Freelancer</Text>
            <Text style={styles.infoValue}>{candidateName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.statusValue}>Concluído</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Avaliação final</Text>

          <Text style={styles.infoBoxText}>
            Sua avaliação ajuda outros usuários a escolherem profissionais com
            mais segurança dentro do TaskFlow.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRateFreelancer}
        >
          <Text style={styles.primaryButtonText}>Avaliar freelancer</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/company-dashboard")}
        >
          <Text style={styles.secondaryButtonText}>Voltar ao painel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
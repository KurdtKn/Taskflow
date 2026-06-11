import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "@/app/styles/serviceCompleted";
import { useTheme } from "@/app/context/ThemeContext";

export default function ServiceCompletedScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";

  const { isDark, theme } = useTheme();

  function handleRateFreelancer() {
    router.replace({
      pathname: "/rate-service",
      params: {
        jobTitle,
        candidateName,
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

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Serviço concluído!
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          O chamado foi encerrado com sucesso. Para finalizar o processo, é
          necessário avaliar o freelancer e registrar sua experiência.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.primary }]}>
            Resumo do serviço
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Chamado
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {jobTitle}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Freelancer
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {candidateName}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Status
            </Text>

            <Text style={styles.statusValue}>Concluído</Text>
          </View>
        </View>

        <View
          style={[
            styles.infoBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            Avaliação obrigatória
          </Text>

          <Text style={[styles.infoBoxText, { color: theme.textSecondary }]}>
            Sua avaliação ajuda outros usuários a escolherem profissionais com
            mais segurança dentro do TaskFlow. Por isso, ela faz parte da
            finalização do serviço.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { backgroundColor: theme.background },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRateFreelancer}
        >
          <Text style={styles.primaryButtonText}>Avaliar freelancer</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
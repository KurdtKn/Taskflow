import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "@/app/styles/paymentSuccess";
import { useTheme } from "@/app/context/ThemeContext";

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
    totalValue?: string;
    paymentMethod?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";
  const totalValue = params.totalValue ?? "R$220,00";
  const paymentMethod = params.paymentMethod ?? "Pix";

  const { isDark, theme } = useTheme();

  function handleOpenChat() {
    router.push({
      pathname: "/chat",
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
          Pagamento confirmado!
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          A taxa da plataforma foi confirmada e o chat com o freelancer já pode
          ser liberado.
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
            Resumo do pagamento
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
              Forma de pagamento
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {paymentMethod}
            </Text>
          </View>

          <View style={styles.totalArea}>
            <Text style={styles.totalLabel}>Total pago</Text>
            <Text style={styles.totalValue}>{totalValue}</Text>
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
            Chat liberado
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Agora a empresa e o freelancer podem conversar para alinhar os
            detalhes finais do serviço.
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
          onPress={handleOpenChat}
        >
          <Text style={styles.primaryButtonText}>Abrir chat</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/company-dashboard")}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar ao painel
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "@/app/styles/paymentSuccess";

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={styles.title}>Pagamento confirmado!</Text>

        <Text style={styles.subtitle}>
          A taxa da plataforma foi confirmada e o chat com o freelancer já pode
          ser liberado.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Resumo do pagamento</Text>

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
            <Text style={styles.infoLabel}>Forma de pagamento</Text>
            <Text style={styles.infoValue}>{paymentMethod}</Text>
          </View>

          <View style={styles.totalArea}>
            <Text style={styles.totalLabel}>Total pago</Text>
            <Text style={styles.totalValue}>{totalValue}</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Chat liberado</Text>

          <Text style={styles.infoText}>
            Agora a empresa e o freelancer podem conversar para alinhar os
            detalhes finais do serviço.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
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
import { useState } from "react";
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
import { styles } from "@/app/styles/payment";

type PaymentMethod = "card" | "pix" | "wallet";

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
    serviceValue?: string;
    platformFee?: string;
    totalValue?: string;
  }>();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";
  const serviceValue = params.serviceValue ?? "R$200,00";
  const platformFee = params.platformFee ?? "R$20,00";
  const totalValue = params.totalValue ?? "R$220,00";

  function handleConfirmPayment() {
    console.log({
        jobTitle,
        candidateName,
        serviceValue,
        platformFee,
        totalValue,
        selectedMethod,
       });

  const paymentMethodLabel = {
    pix: "Pix",
    card: "Cartão",
    wallet: "Carteira TaskFlow",
  };

  router.push({
    pathname: "/payment-success",
    params: {
      jobTitle,
      candidateName,
      totalValue,
      paymentMethod: paymentMethodLabel[selectedMethod],
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

        <Text style={styles.headerTitle}>Pagamento</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.introCard}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>💳</Text>
          </View>

          <Text style={styles.introTitle}>Pagamento da taxa</Text>

          <Text style={styles.introText}>
            Confirme o pagamento da taxa da plataforma para liberar o chat com o
            freelancer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo do chamado</Text>

          <View style={styles.jobCard}>
            <Text style={styles.jobTitle}>{jobTitle}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Freelancer</Text>
              <Text style={styles.infoValue}>{candidateName}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Valor do serviço</Text>
              <Text style={styles.infoValue}>{serviceValue}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Taxa da plataforma</Text>
              <Text style={styles.infoValue}>{platformFee}</Text>
            </View>

            <View style={styles.totalArea}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{totalValue}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de pagamento</Text>

          <View style={styles.methodsArea}>
            <Pressable
              style={[
                styles.methodCard,
                selectedMethod === "pix" && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod("pix")}
            >
              <Text style={styles.methodIcon}>⚡</Text>

              <View style={styles.methodTextArea}>
                <Text style={styles.methodTitle}>Pix</Text>
                <Text style={styles.methodSubtitle}>
                  Confirmação rápida e prática
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selectedMethod === "pix" && styles.radioActive,
                ]}
              />
            </Pressable>

            <Pressable
              style={[
                styles.methodCard,
                selectedMethod === "card" && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod("card")}
            >
              <Text style={styles.methodIcon}>💳</Text>

              <View style={styles.methodTextArea}>
                <Text style={styles.methodTitle}>Cartão</Text>
                <Text style={styles.methodSubtitle}>
                  Crédito ou débito cadastrado
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selectedMethod === "card" && styles.radioActive,
                ]}
              />
            </Pressable>

            <Pressable
              style={[
                styles.methodCard,
                selectedMethod === "wallet" && styles.methodCardActive,
              ]}
              onPress={() => setSelectedMethod("wallet")}
            >
              <Text style={styles.methodIcon}>👛</Text>

              <View style={styles.methodTextArea}>
                <Text style={styles.methodTitle}>Carteira TaskFlow</Text>
                <Text style={styles.methodSubtitle}>
                  Use saldo disponível na plataforma
                </Text>
              </View>

              <View
                style={[
                  styles.radio,
                  selectedMethod === "wallet" && styles.radioActive,
                ]}
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Liberação do chat</Text>

          <Text style={styles.warningText}>
            Após a confirmação do pagamento, o chat entre empresa e freelancer
            será liberado para combinar os detalhes finais do serviço.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
          ]}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>Confirmar pagamento</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
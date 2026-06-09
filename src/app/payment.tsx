import type { ComponentType } from "react";
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
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import SendIcon from "../../assets/icons/send.svg";

import { styles } from "@/app/styles/payment";

type PaymentMethod = "card" | "pix" | "wallet";

type PaymentMethodOption = {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

const paymentMethods: PaymentMethodOption[] = [
  {
    id: "pix",
    title: "Pix",
    subtitle: "Confirmação rápida e prática",
    Icon: SendIcon,
  },
  {
    id: "card",
    title: "Cartão",
    subtitle: "Crédito ou débito cadastrado",
    Icon: CreditCardIcon,
  },
  {
    id: "wallet",
    title: "Carteira TaskFlow",
    subtitle: "Use saldo disponível na plataforma",
    Icon: WalletIcon,
  },
];

const paymentMethodLabel: Record<PaymentMethod, string> = {
  pix: "Pix",
  card: "Cartão",
  wallet: "Carteira TaskFlow",
};

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
            <CreditCardIcon width={34} height={34} />
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
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const Icon = method.Icon;

              return (
                <Pressable
                  key={method.id}
                  style={[
                    styles.methodCard,
                    isSelected && styles.methodCardActive,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View style={styles.methodIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.methodTextArea}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    <Text style={styles.methodSubtitle}>
                      {method.subtitle}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      isSelected && styles.radioActive,
                    ]}
                  />
                </Pressable>
              );
            })}
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
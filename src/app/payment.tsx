import type { ComponentType } from "react";
import { useMemo, useState } from "react";
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
import { useTheme } from "@/app/context/ThemeContext";

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

function parseCurrency(value?: string) {
  if (!value) {
    return null;
  }

  const numbersOnly = value.replace(/\D/g, "");

  if (!numbersOnly) {
    return null;
  }

  return Number(numbersOnly) / 100;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    jobId?: string;
    candidaturaId?: string;
    freelancerId?: string;

    jobTitle?: string;
    candidateName?: string;

    serviceValue?: string;
    candidatePrice?: string;
    jobPrice?: string;

    platformFee?: string;
    totalValue?: string;
  }>();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");

  const { isDark, theme } = useTheme();

  const jobTitle = params.jobTitle ?? "Chamado";
  const candidateName = params.candidateName ?? "Freelancer selecionado";

  const receivedServiceValue =
    params.serviceValue ?? params.candidatePrice ?? params.jobPrice ?? "";

  const paymentValues = useMemo(() => {
    const serviceAmount = parseCurrency(receivedServiceValue);
    const receivedPlatformFee = parseCurrency(params.platformFee);
    const receivedTotalValue = parseCurrency(params.totalValue);

    if (serviceAmount === null) {
      return {
        serviceValue: receivedServiceValue || "Valor a combinar",
        platformFee: params.platformFee ?? "A calcular",
        totalValue: params.totalValue ?? (receivedServiceValue || "A calcular"),
      };
    }

    const platformFeeAmount = receivedPlatformFee ?? serviceAmount * 0.1;
    const totalAmount = receivedTotalValue ?? serviceAmount + platformFeeAmount;

    return {
      serviceValue: formatCurrency(serviceAmount),
      platformFee: formatCurrency(platformFeeAmount),
      totalValue: formatCurrency(totalAmount),
    };
  }, [receivedServiceValue, params.platformFee, params.totalValue]);

  const serviceValue = paymentValues.serviceValue;
  const platformFee = paymentValues.platformFee;
  const totalValue = paymentValues.totalValue;

  function handleConfirmPayment() {
    console.log({
      jobId: params.jobId,
      candidaturaId: params.candidaturaId,
      freelancerId: params.freelancerId,
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
        jobId: params.jobId ?? "",
        candidaturaId: params.candidaturaId ?? "",
        freelancerId: params.freelancerId ?? "",
        jobTitle,
        candidateName,
        serviceValue,
        platformFee,
        totalValue,
        paymentMethod: paymentMethodLabel[selectedMethod],
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

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Pagamento
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.iconBox}>
            <CreditCardIcon width={34} height={34} />
          </View>

          <Text style={[styles.introTitle, { color: theme.text }]}>
            Pagamento da taxa
          </Text>

          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            Confirme o pagamento da taxa da plataforma para liberar o chat com o
            freelancer.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Resumo do chamado
          </Text>

          <View
            style={[
              styles.jobCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.jobTitle, { color: theme.text }]}>
              {jobTitle}
            </Text>

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
                Valor do serviço
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {serviceValue}
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
                Taxa da plataforma
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {platformFee}
              </Text>
            </View>

            <View style={styles.totalArea}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{totalValue}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Forma de pagamento
          </Text>

          <View style={styles.methodsArea}>
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id;
              const Icon = method.Icon;

              return (
                <Pressable
                  key={method.id}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    isSelected && styles.methodCardActive,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View style={styles.methodIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.methodTextArea}>
                    <Text
                      style={[
                        styles.methodTitle,
                        { color: theme.text },
                      ]}
                    >
                      {method.title}
                    </Text>

                    <Text
                      style={[
                        styles.methodSubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {method.subtitle}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      { borderColor: theme.border },
                      isSelected && styles.radioActive,
                    ]}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.warningTitle, { color: theme.text }]}>
            Liberação do chat
          </Text>

          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
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
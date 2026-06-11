import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import {
  Alert,
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
import { colors } from "@/styles/colors";
import { apiPut } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

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
  const [isConfirming, setIsConfirming] = useState(false);

  const { isDark, theme } = useTheme();

  const iconColor = colors.black;
  const iconBoxBackground = isDark ? colors.white : colors.lightGray;
  const iconBoxBorder = isDark ? colors.white : colors.border;

  const jobTitle = params.jobTitle ?? "Chamado";
  const candidateName = params.candidateName ?? "Freelancer selecionado";
  const candidaturaId = params.candidaturaId ?? "";

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

  async function handleConfirmPayment() {
    if (isConfirming) {
      return;
    }

    if (!candidaturaId) {
      Alert.alert(
        "Candidatura não encontrada",
        "Não foi possível identificar a candidatura selecionada."
      );
      return;
    }

    try {
      setIsConfirming(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      if (loggedUser.tipoUsuario !== "empresa") {
        Alert.alert(
          "Acesso negado",
          "Apenas empresas podem aceitar candidaturas."
        );
        return;
      }

      console.log("Confirmando pagamento:", {
        jobId: params.jobId,
        candidaturaId,
        freelancerId: params.freelancerId,
        jobTitle,
        candidateName,
        serviceValue,
        platformFee,
        totalValue,
        selectedMethod,
      });

      try {
        await apiPut(`/api/Candidaturas/${candidaturaId}/status`, {
          status: "aceita",
        });

        console.log("Status da candidatura atualizado para aceita.");
      } catch (apiError) {
        console.log(
          "Não foi possível atualizar status na API, seguindo fluxo mesmo assim:",
          apiError
        );
      }

      router.push({
        pathname: "/payment-success",
        params: {
          jobId: params.jobId ?? "",
          candidaturaId,
          freelancerId: params.freelancerId ?? "",
          jobTitle,
          candidateName,
          serviceValue,
          platformFee,
          totalValue,
          paymentMethod: paymentMethodLabel[selectedMethod],
        },
      });
    } catch (error) {
      console.log("Erro ao confirmar pagamento:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível confirmar o pagamento agora.";

      Alert.alert("Erro ao confirmar", errorMessage);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isConfirming}
        >
          <ArrowBack width={28} height={28} color={theme.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Pagamento
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: theme.background }}
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
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: iconBoxBackground,
                borderColor: iconBoxBorder,
                borderWidth: 1,
              },
            ]}
          >
            <CreditCardIcon
              width={34}
              height={34}
              color={iconColor}
              fill={iconColor}
            />
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
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.textSecondary,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                Freelancer
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.text,
                    backgroundColor: "transparent",
                  },
                ]}
              >
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
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.textSecondary,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                Valor do serviço
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.text,
                    backgroundColor: "transparent",
                  },
                ]}
              >
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
              <Text
                style={[
                  styles.infoLabel,
                  {
                    color: theme.textSecondary,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                Taxa da plataforma
              </Text>

              <Text
                style={[
                  styles.infoValue,
                  {
                    color: theme.text,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                {platformFee}
              </Text>
            </View>

            <View
              style={[
                styles.totalArea,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.totalLabel,
                  {
                    color: theme.text,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                Total
              </Text>

              <Text
                style={[
                  styles.totalValue,
                  {
                    color: theme.primary,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                {totalValue}
              </Text>
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
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                    isSelected && styles.methodCardActive,
                  ]}
                  onPress={() => setSelectedMethod(method.id)}
                  disabled={isConfirming}
                >
                  <View
                    style={[
                      styles.methodIconBox,
                      {
                        backgroundColor: iconBoxBackground,
                        borderColor: iconBoxBorder,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Icon
                      width={24}
                      height={24}
                      color={iconColor}
                      fill={iconColor}
                    />
                  </View>

                  <View style={styles.methodTextArea}>
                    <Text style={[styles.methodTitle, { color: theme.text }]}>
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
          disabled={isConfirming}
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
            isConfirming && { opacity: 0.7 },
          ]}
          onPress={handleConfirmPayment}
        >
          <Text style={styles.confirmButtonText}>
            {isConfirming ? "Confirmando..." : "Confirmar pagamento"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
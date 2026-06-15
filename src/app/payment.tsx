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
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import SendIcon from "../../assets/icons/send.svg";

import { styles } from "@/app/styles/payment";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";
import { apiGet, apiPost } from "@/services/api";

type PaymentMethod = "card" | "pix" | "wallet";

type PaymentMethodOption = {
  id: PaymentMethod;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

type CandidaturaActionResponse = {
  mensagem?: string;
  candidaturaId?: number;
  contratoId?: number;
  chamadoId?: number;
  empresaId?: number;
  freelancerId?: number;
  contratoStatus?: string;
};

type CandidaturaApi = {
  id?: number | string;
  candidaturaId?: number | string;
  candidatura_id?: number | string;
  contratoId?: number | string | null;
  contrato_id?: number | string | null;
  contrato?: { id?: number | string | null } | null;
};

type CandidaturasResponse =
  | CandidaturaApi[]
  | {
      data?: CandidaturaApi[];
      dados?: CandidaturaApi[];
      candidaturas?: CandidaturaApi[];
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

const PAYMENT_CONFIRMED_PREFIX = "payment_confirmed_";

function getPaymentConfirmedKey(contratoId: string) {
  return `${PAYMENT_CONFIRMED_PREFIX}${contratoId}`;
}

function getCandidaturasFromResponse(response: CandidaturasResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.candidaturas ?? [];
}

function getContratoIdFromCandidatura(candidatura?: CandidaturaApi | null) {
  if (!candidatura) {
    return "";
  }

  const contratoId =
    candidatura.contratoId ??
    candidatura.contrato_id ??
    candidatura.contrato?.id ??
    null;

  return contratoId ? String(contratoId) : "";
}

// Altere aqui se quiser mudar a porcentagem da taxa.
// 0.10 = 10%
// 0.06 = 6%
const PLATFORM_FEE_PERCENTAGE = 0.1;

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

function parseCurrency(value?: string) {
  if (!value) {
    return null;
  }

  const cleanedValue = value
    .replace(/R\$/gi, "")
    .replace(/\s/g, "")
    .trim();

  if (!cleanedValue) {
    return null;
  }

  const normalizedValue = cleanedValue.includes(",")
    ? cleanedValue.replace(/\./g, "").replace(",", ".")
    : cleanedValue.replace(/,/g, "");

  const parsedValue = Number(normalizedValue);

  if (Number.isNaN(parsedValue)) {
    return null;
  }

  return parsedValue;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function PaymentScreen() {
  const params = useLocalSearchParams<{
    contratoId?: string | string[];

    jobId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];

    jobTitle?: string | string[];
    jobCategory?: string | string[];
    jobPrice?: string | string[];
    jobLocation?: string | string[];
    jobTime?: string | string[];
    status?: string | string[];

    candidateName?: string | string[];
    candidateEmail?: string | string[];
    candidateRating?: string | string[];

    serviceValue?: string | string[];
    candidatePrice?: string | string[];

    platformFee?: string | string[];
    totalValue?: string | string[];
  }>();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");
  const [isConfirming, setIsConfirming] = useState(false);

  const { isDark, theme } = useTheme();

  const iconColor = colors.black;
  const iconBoxBackground = isDark ? colors.white : colors.lightGray;
  const iconBoxBorder = isDark ? colors.white : colors.border;

  const contratoId = getParamValue(params.contratoId);

  const jobId = getParamValue(params.jobId);
  const candidaturaId = getParamValue(params.candidaturaId);
  const freelancerId = getParamValue(params.freelancerId);

  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const jobCategory = getParamValue(params.jobCategory);
  const jobPrice = getParamValue(params.jobPrice);
  const jobLocation = getParamValue(params.jobLocation);
  const jobTime = getParamValue(params.jobTime);
  const status = getParamValue(params.status);

  const candidateName = getParamValue(
    params.candidateName,
    "Freelancer selecionado"
  );
  const candidateEmail = getParamValue(params.candidateEmail);
  const candidateRating = getParamValue(params.candidateRating);

  const receivedServiceValue =
    getParamValue(params.serviceValue) ||
    getParamValue(params.candidatePrice) ||
    getParamValue(params.jobPrice);

  const receivedPlatformFee = getParamValue(params.platformFee);
  const receivedTotalValue = getParamValue(params.totalValue);

  const paymentValues = useMemo(() => {
    const serviceAmount = parseCurrency(receivedServiceValue);
    const platformFeeFromParam = parseCurrency(receivedPlatformFee);
    const totalValueFromParam = parseCurrency(receivedTotalValue);

    if (serviceAmount === null) {
      return {
        serviceValue: receivedServiceValue || "Valor a combinar",
        platformFee: receivedPlatformFee || "A calcular",
        totalValue: receivedTotalValue || receivedServiceValue || "A calcular",
      };
    }

    const platformFeeAmount =
      platformFeeFromParam ?? serviceAmount * PLATFORM_FEE_PERCENTAGE;

    const totalAmount = totalValueFromParam ?? serviceAmount + platformFeeAmount;

    return {
      serviceValue: formatCurrency(serviceAmount),
      platformFee: formatCurrency(platformFeeAmount),
      totalValue: formatCurrency(totalAmount),
    };
  }, [receivedServiceValue, receivedPlatformFee, receivedTotalValue]);

  const serviceValue = paymentValues.serviceValue;
  const platformFee = paymentValues.platformFee;
  const totalValue = paymentValues.totalValue;

  async function recuperarContratoId() {
    if (!jobId || !candidaturaId) {
      return "";
    }

    try {
      const response = await apiGet<CandidaturasResponse>(
        `/api/Candidaturas/chamado/${jobId}`
      );

      const candidaturas = getCandidaturasFromResponse(response);

      const candidaturaEncontrada = candidaturas.find((item) => {
        const itemId = item.id ?? item.candidaturaId ?? item.candidatura_id;
        return String(itemId) === String(candidaturaId);
      });

      const contratoEncontrado = getContratoIdFromCandidatura(
        candidaturaEncontrada
      );

      if (contratoEncontrado) {
        return contratoEncontrado;
      }
    } catch (error) {
      console.log("Erro ao buscar contrato pela candidatura:", error);
    }

    return "";
  }

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

      let finalContratoId = contratoId;

      if (!finalContratoId) {
        console.log(
          "ContratoId não veio nos params. Tentando recuperar pela listagem de candidaturas..."
        );

        finalContratoId = await recuperarContratoId();
      }

      if (!finalContratoId) {
        console.log(
          "ContratoId ainda não encontrado. Tentando aceitar novamente como último recurso..."
        );

        try {
          const response = await apiPost<CandidaturaActionResponse>(
            `/api/Candidaturas/${candidaturaId}/aceitar`,
            {}
          );

          console.log("Resposta ao recuperar contrato pelo aceite:", response);

          const responseContratoId =
            response?.contratoId ?? (response as any)?.contrato_id;

          if (responseContratoId) {
            finalContratoId = String(responseContratoId);
          }
        } catch (error) {
          console.log(
            "Não foi possível recuperar contrato pelo aceite novamente:",
            error
          );
        }
      }

      if (!finalContratoId) {
        Alert.alert(
          "Contrato não encontrado",
          "A API aceitou a candidatura, mas o app não conseguiu recuperar o contratoId."
        );
        return;
      }

      console.log("Confirmando pagamento:", {
        contratoId: finalContratoId,
        jobId,
        candidaturaId,
        freelancerId,
        jobTitle,
        candidateName,
        serviceValue,
        platformFee,
        totalValue,
        selectedMethod,
      });

      await AsyncStorage.setItem(
        getPaymentConfirmedKey(finalContratoId),
        "true",
      );

      router.replace({
        pathname: "/payment-success",
        params: {
          contratoId: finalContratoId,

          jobId,
          candidaturaId,
          freelancerId,

          jobTitle,
          jobCategory,
          jobPrice,
          jobLocation,
          jobTime,
          status: status || "em_andamento",

          candidateName,
          candidateEmail,
          candidateRating,

          serviceValue,
          candidatePrice: serviceValue,
          platformFee,
          totalValue,
          paymentMethod: paymentMethodLabel[selectedMethod],

          userRole: "empresa",
          fromPayment: "true",
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

        <Text style={[styles.headerTitle, { color: theme.text }]}>Pagamento</Text>

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
            Pagamento do serviço
          </Text>

          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            Confirme o pagamento do serviço para liberar o chat entre a empresa
            e o freelancer selecionado.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Resumo</Text>

          <View
            style={[
              styles.jobCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.jobTitle, { color: theme.text }]}>{jobTitle}</Text>

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

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

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

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Forma de pagamento</Text>

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
          <Text style={[styles.warningTitle, { color: theme.text }]}>Chat liberado após confirmação</Text>

          <Text style={[styles.warningText, { color: theme.textSecondary }]}>Após confirmar o pagamento, o chat será liberado para alinhamento dos detalhes finais do serviço.</Text>
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

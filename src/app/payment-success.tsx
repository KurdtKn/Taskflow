import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "@/app/styles/paymentSuccess";
import { useTheme } from "@/app/context/ThemeContext";

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function PaymentSuccessScreen() {
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
    paymentMethod?: string | string[];
  }>();

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

  const serviceValue =
    getParamValue(params.serviceValue) ||
    getParamValue(params.candidatePrice) ||
    jobPrice ||
    "Valor a combinar";

  const candidatePrice = getParamValue(params.candidatePrice, serviceValue);
  const platformFee = getParamValue(params.platformFee, "A calcular");
  const totalValue = getParamValue(params.totalValue, "Valor a combinar");
  const paymentMethod = getParamValue(params.paymentMethod, "Pix");

  const { isDark, theme } = useTheme();

  function handleOpenChat() {
    router.push({
      pathname: "/chat",
      params: {
        contratoId,

        jobId,
        candidaturaId,
        freelancerId,

        jobTitle,
        jobCategory,
        jobPrice: jobPrice || serviceValue,
        jobLocation,
        jobTime,
        status,

        candidateName,
        candidateEmail,
        candidateRating,

        serviceValue,
        candidatePrice,
        platformFee,
        totalValue,
        paymentMethod,
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={{ backgroundColor: theme.background }}
      >
        <View style={styles.successCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Pagamento confirmado!
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          O pagamento do serviço foi confirmado e o chat já pode ser liberado.
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
              Total pago
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
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
          },
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
import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "@/app/styles/serviceCompleted";
import { useTheme } from "@/app/context/ThemeContext";

const REVIEWS_STORAGE_KEY = "@taskflow:reviews";

type ReviewPayload = {
  id?: string;
  jobId?: string;
  candidaturaId?: string;
  freelancerId?: string;
  ratedUserType?: string;
};

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}

export default function ServiceCompletedScreen() {
  const params = useLocalSearchParams<{
    jobId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];
    jobTitle?: string | string[];
    candidateName?: string | string[];
    companyName?: string | string[];
  }>();

  const jobId = getParamValue(params.jobId);
  const candidaturaId = getParamValue(params.candidaturaId);
  const freelancerId = getParamValue(params.freelancerId);
  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const candidateName = getParamValue(params.candidateName, "Usuário TaskFlow");
  const companyName = getParamValue(params.companyName, "Empresa");

  const [freelancerAlreadyReviewed, setFreelancerAlreadyReviewed] =
    useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    checkFreelancerReview();
  }, [jobId, candidaturaId, freelancerId]);

  async function checkFreelancerReview() {
    try {
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const reviews: ReviewPayload[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      const alreadyReviewed = reviews.some((review) => {
        if (review.ratedUserType !== "freelancer") {
          return false;
        }

        const sameJob =
          jobId && review.jobId && String(review.jobId) === String(jobId);

        const sameCandidatura =
          candidaturaId &&
          review.candidaturaId &&
          String(review.candidaturaId) === String(candidaturaId);

        const sameFreelancer =
          freelancerId &&
          review.freelancerId &&
          String(review.freelancerId) === String(freelancerId);

        return sameJob || sameCandidatura || sameFreelancer;
      });

      setFreelancerAlreadyReviewed(alreadyReviewed);
    } catch (error) {
      console.log("Erro ao verificar avaliação do freelancer:", error);
      setFreelancerAlreadyReviewed(false);
    }
  }

  function handleRateFreelancer() {
    if (freelancerAlreadyReviewed) {
      return;
    }

    router.replace({
      pathname: "/rate-service",
      params: {
        jobId,
        candidaturaId,
        freelancerId,
        jobTitle,
        candidateName,
        companyName,
        ratedUserName: candidateName,
        ratedUserType: "freelancer",
      },
    });
  }

  function handleGoDashboard() {
    router.replace("/company-dashboard");
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
          O chamado foi encerrado com sucesso. Para finalizar o processo,
          avalie o freelancer e registre sua experiência.
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
              Empresa
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {companyName}
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
            {freelancerAlreadyReviewed
              ? "Avaliação já enviada"
              : "Avaliação do freelancer"}
          </Text>

          <Text style={[styles.infoBoxText, { color: theme.textSecondary }]}>
            {freelancerAlreadyReviewed
              ? "A avaliação deste freelancer já foi registrada. Agora você pode voltar ao dashboard."
              : "Sua avaliação ajuda outras empresas a escolherem profissionais com mais segurança dentro do TaskFlow."}
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
          disabled={freelancerAlreadyReviewed}
          style={({ pressed }) => [
            styles.primaryButton,
            freelancerAlreadyReviewed && { opacity: 0.55 },
            pressed && !freelancerAlreadyReviewed && styles.buttonPressed,
          ]}
          onPress={handleRateFreelancer}
        >
          <Text style={styles.primaryButtonText}>
            {freelancerAlreadyReviewed
              ? "Avaliação enviada"
              : "Avaliar freelancer"}
          </Text>
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
          onPress={handleGoDashboard}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar ao dashboard
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
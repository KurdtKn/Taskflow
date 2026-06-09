import { useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/jobCandidates";
import { useTheme } from "@/app/context/ThemeContext";

type Candidate = {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  distance: string;
  completedJobs: number;
  price: string;
  description: string;
  skills: string[];
};

const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "Usuário TaskFlow",
    role: "Freelancer",
    rating: 4.8,
    reviews: 24,
    distance: "1,5 km",
    completedJobs: 18,
    price: "R$200,00",
    description:
      "Tenho experiência com atendimento ao público, eventos e serviços sob demanda.",
    skills: ["Eventos", "Garçom", "Atendimento"],
  },
  {
    id: "2",
    name: "Gabriel Santos",
    role: "Freelancer",
    rating: 4.6,
    reviews: 17,
    distance: "2,1 km",
    completedJobs: 12,
    price: "R$220,00",
    description:
      "Disponível para eventos, organização de salão e apoio ao cliente.",
    skills: ["Eventos", "Organização", "Serviços gerais"],
  },
  {
    id: "3",
    name: "Anna Clara",
    role: "Freelancer",
    rating: 4.9,
    reviews: 31,
    distance: "3,0 km",
    completedJobs: 26,
    price: "R$250,00",
    description:
      "Experiência em eventos corporativos, recepção e atendimento personalizado.",
    skills: ["Recepção", "Eventos", "Comunicação"],
  },
];

export default function JobCandidatesScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    category?: string;
    price?: string;
    location?: string;
    time?: string;
    candidates?: string;
  }>();

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    initialCandidates[0]?.id ?? ""
  );

  const { isDark, theme } = useTheme();

  const jobTitle = params.title ?? "Garçom para Evento";
  const jobCategory = params.category ?? "Eventos";
  const jobPrice = params.price ?? "R$200,00";
  const jobLocation = params.location ?? "Centro";
  const jobTime = params.time ?? "Hoje, 18:00";

  const selectedCandidate = candidates.find(
    (candidate) => candidate.id === selectedCandidateId
  );

  function handleAcceptCandidate(candidate: Candidate) {
    router.push({
      pathname: "/job-summary",
      params: {
        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,
        candidateName: candidate.name,
        candidateRating: String(candidate.rating),
        candidatePrice: candidate.price,
      },
    });
  }

  function handleViewFreelancerProfile(candidate: Candidate) {
    router.push({
      pathname: "/freelancer-profile",
      params: {
        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,
        candidateName: candidate.name,
        candidateRating: String(candidate.rating),
        candidatePrice: candidate.price,
      },
    });
  }

  function handleRejectCandidate(candidate: Candidate) {
    console.log("Candidato recusado:", candidate.name);

    setCandidates((currentCandidates) => {
      const updatedCandidates = currentCandidates.filter(
        (item) => item.id !== candidate.id
      );

      if (selectedCandidateId === candidate.id) {
        setSelectedCandidateId(updatedCandidates[0]?.id ?? "");
      }

      return updatedCandidates;
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
          Candidatos
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.jobCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.jobLabel, { color: theme.primary }]}>
            Chamado
          </Text>

          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          <View style={styles.jobInfoArea}>
            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <WalletIcon width={18} height={18} />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobPrice}
              </Text>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <LocationIcon width={18} height={18} />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobLocation}
              </Text>
            </View>

            <View style={styles.jobInfoRow}>
              <View style={styles.jobInfoIconBox}>
                <TimeIcon width={18} height={18} />
              </View>

              <Text style={[styles.jobInfoText, { color: theme.text }]}>
                {jobTime}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Freelancers interessados
            </Text>

            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              {candidates.length} candidatos encontrados
            </Text>
          </View>
        </View>

        <View style={styles.candidatesList}>
          {candidates.length === 0 ? (
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
                Nenhum candidato disponível
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Todos os candidatos foram recusados ou ainda não há novas
                candidaturas para esse chamado.
              </Text>
            </View>
          ) : (
            candidates.map((candidate) => {
              const isSelected = selectedCandidateId === candidate.id;

              return (
                <Pressable
                  key={candidate.id}
                  style={({ pressed }) => [
                    styles.candidateCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    isSelected && styles.candidateCardSelected,
                    pressed && styles.candidateCardPressed,
                  ]}
                  onPress={() => setSelectedCandidateId(candidate.id)}
                >
                  <View style={styles.candidateHeader}>
                    <Image
                      source={require("../../assets/images/icon.png")}
                      style={styles.avatar}
                      resizeMode="contain"
                    />

                    <View style={styles.candidateInfo}>
                      <Text style={[styles.candidateName, { color: theme.text }]}>
                        {candidate.name}
                      </Text>

                      <Text
                        style={[
                          styles.candidateRole,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {candidate.role}
                      </Text>

                      <View style={styles.ratingArea}>
                        <Text style={styles.ratingIcon}>⭐</Text>

                        <Text
                          style={[
                            styles.ratingText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {candidate.rating} • {candidate.reviews} avaliações
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.candidatePrice}>
                      {candidate.price}
                    </Text>
                  </View>

                  <Text style={[styles.description, { color: theme.textSecondary }]}>
                    {candidate.description}
                  </Text>

                  <View style={styles.skillsArea}>
                    {candidate.skills.map((skill) => (
                      <View
                        key={skill}
                        style={[
                          styles.skillChip,
                          {
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                          },
                        ]}
                      >
                        <Text style={[styles.skillText, { color: theme.text }]}>
                          {skill}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.statsArea}>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.text }]}>
                        {candidate.completedJobs}
                      </Text>

                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        serviços
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statDivider,
                        { backgroundColor: theme.border },
                      ]}
                    />

                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.text }]}>
                        {candidate.distance}
                      </Text>

                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        distância
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statDivider,
                        { backgroundColor: theme.border },
                      ]}
                    />

                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: theme.text }]}>
                        {candidate.rating}
                      </Text>

                      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                        nota
                      </Text>
                    </View>
                  </View>

                  <Pressable
                    style={({ pressed }) => [
                      styles.profileButton,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                      pressed && styles.profileButtonPressed,
                    ]}
                    onPress={() => handleViewFreelancerProfile(candidate)}
                  >
                    <Text style={[styles.profileButtonText, { color: theme.text }]}>
                      Ver perfil completo
                    </Text>
                  </Pressable>

                  <View style={styles.actionButtonsRow}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.rejectButton,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                        pressed && styles.rejectButtonPressed,
                      ]}
                      onPress={() => handleRejectCandidate(candidate)}
                    >
                      <Text style={styles.rejectButtonText}>Recusar</Text>
                    </Pressable>

                    <Pressable
                      style={({ pressed }) => [
                        styles.acceptButton,
                        pressed && styles.acceptButtonPressed,
                      ]}
                      onPress={() => handleAcceptCandidate(candidate)}
                    >
                      <Text style={styles.acceptButtonText}>Aceitar</Text>
                    </Pressable>
                  </View>
                </Pressable>
              );
            })
          )}
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
            Antes de aceitar
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Analise a avaliação, experiência e distância do freelancer. Após o
            aceite, o próximo passo será revisar o resumo do chamado e confirmar
            o fluxo.
          </Text>
        </View>

        {selectedCandidate && (
          <Text style={[styles.selectedText, { color: theme.textSecondary }]}>
            Selecionado: {selectedCandidate.name}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
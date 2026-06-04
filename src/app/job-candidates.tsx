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
import { styles } from "@/app/styles/jobCandidates";

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

const candidatesData: Candidate[] = [
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

  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidatesData[0].id
  );

  const jobTitle = params.title ?? "Garçom para Evento";
  const jobCategory = params.category ?? "Eventos";
  const jobPrice = params.price ?? "R$200,00";
  const jobLocation = params.location ?? "Centro";
  const jobTime = params.time ?? "Hoje, 18:00";

  const selectedCandidate = candidatesData.find(
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Candidatos</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.jobCard}>
          <Text style={styles.jobLabel}>Chamado</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>

          <View style={styles.jobInfoArea}>
            <View style={styles.jobInfoRow}>
              <Text style={styles.jobInfoIcon}>💰</Text>
              <Text style={styles.jobInfoText}>{jobPrice}</Text>
            </View>

            <View style={styles.jobInfoRow}>
              <Text style={styles.jobInfoIcon}>📍</Text>
              <Text style={styles.jobInfoText}>{jobLocation}</Text>
            </View>

            <View style={styles.jobInfoRow}>
              <Text style={styles.jobInfoIcon}>🕒</Text>
              <Text style={styles.jobInfoText}>{jobTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Freelancers interessados</Text>
            <Text style={styles.sectionSubtitle}>
              {candidatesData.length} candidatos encontrados
            </Text>
          </View>
        </View>

        <View style={styles.candidatesList}>
          {candidatesData.map((candidate) => {
            const isSelected = selectedCandidateId === candidate.id;

            return (
              <Pressable
                key={candidate.id}
                style={({ pressed }) => [
                  styles.candidateCard,
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
                    <Text style={styles.candidateName}>{candidate.name}</Text>
                    <Text style={styles.candidateRole}>{candidate.role}</Text>

                    <View style={styles.ratingArea}>
                      <Text style={styles.ratingIcon}>⭐</Text>
                      <Text style={styles.ratingText}>
                        {candidate.rating} • {candidate.reviews} avaliações
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.candidatePrice}>{candidate.price}</Text>
                </View>

                <Text style={styles.description}>{candidate.description}</Text>

                <View style={styles.skillsArea}>
                  {candidate.skills.map((skill) => (
                    <View key={skill} style={styles.skillChip}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.statsArea}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {candidate.completedJobs}
                    </Text>
                    <Text style={styles.statLabel}>serviços</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {candidate.distance}
                    </Text>
                    <Text style={styles.statLabel}>distância</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                      {candidate.rating}
                    </Text>
                    <Text style={styles.statLabel}>nota</Text>
                  </View>
                </View>

                {isSelected && (
                  <Pressable
                    style={({ pressed }) => [
                      styles.acceptButton,
                      pressed && styles.acceptButtonPressed,
                    ]}
                    onPress={() => handleAcceptCandidate(candidate)}
                  >
                    <Text style={styles.acceptButtonText}>
                      Aceitar candidato
                    </Text>
                  </Pressable>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Antes de aceitar</Text>
          <Text style={styles.infoText}>
            Analise a avaliação, experiência e distância do freelancer. Após o
            aceite, o próximo passo será revisar o resumo do chamado e confirmar
            o fluxo.
          </Text>
        </View>

        {selectedCandidate && (
          <Text style={styles.selectedText}>
            Selecionado: {selectedCandidate.name}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
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
import AssignmentIcon from "../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/freelancerProfile";

const skills = [
  "Eventos",
  "Atendimento ao público",
  "Organização",
  "Pontualidade",
  "Comunicação",
];

const portfolioItems = [
  {
    id: "1",
    title: "Evento corporativo",
    description: "Atuação como garçom em evento empresarial para 80 pessoas.",
  },
  {
    id: "2",
    title: "Festa particular",
    description: "Apoio no atendimento, organização e reposição de bebidas.",
  },
  {
    id: "3",
    title: "Serviço sob demanda",
    description: "Atendimento rápido para empresa contratante via plataforma.",
  },
];

const reviews = [
  {
    id: "1",
    company: "TaskFlow Eventos",
    rating: 5,
    comment: "Profissional pontual, educado e com ótima comunicação.",
  },
  {
    id: "2",
    company: "Empresa Alpha",
    rating: 5,
    comment: "Serviço muito bem feito. Contrataria novamente.",
  },
];

export default function FreelancerProfileScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    jobCategory?: string;
    jobPrice?: string;
    jobLocation?: string;
    jobTime?: string;
    candidateName?: string;
    candidateRating?: string;
    candidatePrice?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const jobCategory = params.jobCategory ?? "Eventos";
  const jobPrice = params.jobPrice ?? "R$200,00";
  const jobLocation = params.jobLocation ?? "Sorocaba - SP";
  const jobTime = params.jobTime ?? "Hoje, 18:00";

  const candidateName = params.candidateName ?? "Usuário TaskFlow";
  const candidateRating = params.candidateRating ?? "4.9";
  const candidatePrice = params.candidatePrice ?? "R$200,00";

  function handleAcceptCandidate() {
    router.push({
      pathname: "/job-summary",
      params: {
        jobTitle,
        jobCategory,
        jobPrice,
        jobLocation,
        jobTime,
        candidateName,
        candidateRating,
        candidatePrice,
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

        <Text style={styles.headerTitle}>Perfil do freelancer</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{candidateName.charAt(0)}</Text>
          </View>

          <Text style={styles.name}>{candidateName}</Text>

          <Text style={styles.role}>Freelancer verificado</Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingText}>{candidateRating}</Text>
            <Text style={styles.ratingSubtext}>• 24 serviços concluídos</Text>
          </View>

          <View style={styles.statsArea}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Serviços</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Satisfação</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2 min</Text>
              <Text style={styles.statLabel}>Resposta</Text>
            </View>
          </View>
        </View>

        <View style={styles.serviceCard}>
          <Text style={styles.sectionTitle}>Candidatura para o chamado</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Chamado</Text>
            <Text style={styles.infoValue}>{jobTitle}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Categoria</Text>
            <Text style={styles.infoValue}>{jobCategory}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor proposto</Text>
            <Text style={styles.priceValue}>{candidatePrice}</Text>
          </View>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Sobre o profissional</Text>

          <Text style={styles.aboutText}>
            Profissional com experiência em serviços sob demanda, eventos e
            atendimento ao público. Busca manter boa comunicação com a empresa,
            pontualidade e organização durante todo o serviço.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>

          <View style={styles.skillsArea}>
            {skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfólio</Text>

          <View style={styles.portfolioList}>
            {portfolioItems.map((item) => (
              <View key={item.id} style={styles.portfolioCard}>
                <View style={styles.portfolioIconBox}>
                  <AssignmentIcon width={24} height={24} />
                </View>

                <View style={styles.portfolioTextArea}>
                  <Text style={styles.portfolioTitle}>{item.title}</Text>
                  <Text style={styles.portfolioDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações recentes</Text>

          <View style={styles.reviewsList}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewCompany}>{review.company}</Text>
                  <Text style={styles.reviewRating}>⭐ {review.rating},0</Text>
                </View>

                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Segurança na contratação</Text>

          <Text style={styles.infoText}>
            O chat só será liberado após a empresa aceitar o candidato e
            confirmar a taxa da plataforma.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.acceptButton,
            pressed && styles.acceptButtonPressed,
          ]}
          onPress={handleAcceptCandidate}
        >
          <Text style={styles.acceptButtonText}>Aceitar candidato</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Voltar aos candidatos</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
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
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";

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
    title: "Portfólio não preenchido",
    description:
      "Quando o freelancer adicionar experiências, elas aparecerão aqui.",
  },
];

const reviews = [
  {
    id: "1",
    company: "Sem avaliações",
    rating: 0,
    comment: "As avaliações recebidas pelo freelancer aparecerão aqui.",
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

  const { isDark, theme } = useTheme();

  const iconColor = isDark ? colors.white : colors.black;

  const jobTitle = params.jobTitle ?? "Chamado não informado";
  const jobCategory = params.jobCategory ?? "Categoria não informada";
  const jobPrice = params.jobPrice ?? "Valor não informado";
  const jobLocation = params.jobLocation ?? "Local não informado";
  const jobTime = params.jobTime ?? "Horário não informado";

  const candidateName = params.candidateName ?? "Freelancer não informado";
  const candidateRating = params.candidateRating ?? "Sem avaliações";
  const candidatePrice = params.candidatePrice ?? jobPrice;

  function handleAcceptCandidate() {
    router.push({
      pathname: "/payment",
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

  function getAvatarInitial() {
    if (!candidateName || candidateName === "Freelancer não informado") {
      return "?";
    }

    return candidateName.charAt(0).toUpperCase();
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} color={theme.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Perfil do freelancer
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
            styles.profileCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getAvatarInitial()}</Text>
          </View>

          <Text style={[styles.name, { color: theme.text }]}>
            {candidateName}
          </Text>

          <Text style={[styles.role, { color: theme.textSecondary }]}>
            Freelancer cadastrado
          </Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>

            <Text style={[styles.ratingText, { color: theme.text }]}>
              {candidateRating}
            </Text>

            <Text style={[styles.ratingSubtext, { color: theme.textSecondary }]}>
              • 0 serviços concluídos
            </Text>
          </View>

          <View
            style={[
              styles.statsArea,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                0
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Serviços
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
                0%
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Satisfação
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
                --
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Resposta
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.serviceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Candidatura para o chamado
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
              Categoria
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {jobCategory}
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
              Valor proposto
            </Text>

            <Text style={styles.priceValue}>{candidatePrice}</Text>
          </View>
        </View>

        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Sobre o profissional
          </Text>

          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            Quando o freelancer preencher a descrição do perfil, ela aparecerá
            aqui.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Habilidades
          </Text>

          <View style={styles.skillsArea}>
            {skills.map((skill) => (
              <View
                key={skill}
                style={[
                  styles.skillChip,
                  {
                    backgroundColor: theme.inputBackground,
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
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Portfólio
          </Text>

          <View style={styles.portfolioList}>
            {portfolioItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.portfolioCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.portfolioIconBox,
                    {
                      backgroundColor: colors.white,
                      borderColor: colors.white,
                      borderWidth: 1,
                    },
                  ]}
                >
                  <AssignmentIcon
                    width={24}
                    height={24}
                    color={colors.black}
                    fill={colors.black}
                  />
                </View>

                <View style={styles.portfolioTextArea}>
                  <Text style={[styles.portfolioTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>

                  <Text
                    style={[
                      styles.portfolioDescription,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Avaliações recentes
          </Text>

          <View style={styles.reviewsList}>
            {reviews.map((review) => (
              <View
                key={review.id}
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewCompany, { color: theme.text }]}>
                    {review.company}
                  </Text>

                  <Text style={styles.reviewRating}>
                    ⭐ {review.rating},0
                  </Text>
                </View>

                <Text
                  style={[
                    styles.reviewComment,
                    { color: theme.textSecondary },
                  ]}
                >
                  {review.comment}
                </Text>
              </View>
            ))}
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
            Segurança na contratação
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
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
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar aos candidatos
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
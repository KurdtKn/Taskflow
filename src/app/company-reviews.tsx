import { useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/companyReviews";
import { useTheme } from "@/app/context/ThemeContext";

type ReviewFilter = "all" | "positive" | "recent";

type CompanyReview = {
  id: string;
  freelancerName: string;
  service: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
};

const reviewsData: CompanyReview[] = [
  {
    id: "1",
    freelancerName: "Usuário TaskFlow",
    service: "Garçom para Evento",
    rating: 5,
    date: "Hoje",
    comment:
      "Empresa muito organizada, passou todas as informações do evento com clareza e manteve uma boa comunicação pelo chat.",
    tags: ["Boa comunicação", "Organizada", "Pagamento correto"],
  },
  {
    id: "2",
    freelancerName: "Anna Clara",
    service: "Fotógrafo Profissional",
    rating: 5,
    date: "2 dias atrás",
    comment:
      "Ótima experiência. A empresa explicou bem o serviço, respeitou o horário combinado e foi bem tranquila durante o atendimento.",
    tags: ["Pontual", "Profissional", "Recomendo"],
  },
  {
    id: "3",
    freelancerName: "Carlos Oliveira",
    service: "Reparo Hidráulico",
    rating: 4,
    date: "1 semana atrás",
    comment:
      "A contratação foi tranquila e a comunicação foi boa. Só faltaram alguns detalhes no chamado, mas tudo foi resolvido pelo chat.",
    tags: ["Boa comunicação", "Serviço tranquilo"],
  },
  {
    id: "4",
    freelancerName: "Gabriel Santos",
    service: "Apoio em Limpeza",
    rating: 5,
    date: "2 semanas atrás",
    comment:
      "Empresa confiável, atendimento respeitoso e informações bem organizadas. Trabalharia novamente sem problemas.",
    tags: ["Confiável", "Respeitosa", "Recomendo"],
  },
];

export default function CompanyReviewsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");

  const { isDark, theme } = useTheme();

  const filteredReviews = useMemo(() => {
    if (selectedFilter === "positive") {
      return reviewsData.filter((review) => review.rating >= 5);
    }

    if (selectedFilter === "recent") {
      return reviewsData.slice(0, 2);
    }

    return reviewsData;
  }, [selectedFilter]);

  const averageRating =
    reviewsData.reduce((total, review) => total + review.rating, 0) /
    reviewsData.length;

  const fiveStarReviews = reviewsData.filter(
    (review) => review.rating === 5
  ).length;

  function renderStars(rating: number) {
    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= rating;

      return (
        <Text
          key={starValue}
          style={[
            styles.star,
            isActive ? styles.starActive : styles.starInactive,
          ]}
        >
          ★
        </Text>
      );
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
          Avaliações da empresa
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.summaryCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.ratingCircle}>
            <Text style={styles.ratingNumber}>
              {averageRating.toFixed(1).replace(".", ",")}
            </Text>
            <Text style={styles.ratingMax}>/5</Text>
          </View>

          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            Reputação da empresa
          </Text>

          <View style={styles.summaryStars}>
            {renderStars(Math.round(averageRating))}
          </View>

          <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
            Baseado em {reviewsData.length} avaliações feitas por freelancers
            após serviços concluídos.
          </Text>
        </View>

        <View style={styles.statsArea}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {reviewsData.length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Avaliações
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {fiveStarReviews}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Nota 5
            </Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.statNumber, { color: theme.text }]}>
              96%
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Satisfação
            </Text>
          </View>
        </View>

        <View style={styles.filtersArea}>
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "all" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "all" && styles.filterTextActive,
              ]}
            >
              Todas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "positive" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("positive")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "positive" && styles.filterTextActive,
              ]}
            >
              Positivas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "recent" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("recent")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "recent" && styles.filterTextActive,
              ]}
            >
              Recentes
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Comentários recebidos
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Avaliações feitas por freelancers que prestaram serviços.
          </Text>
        </View>

        <View style={styles.reviewsList}>
          {filteredReviews.map((review) => (
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
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.freelancerName.charAt(0)}
                  </Text>
                </View>

                <View style={styles.reviewHeaderText}>
                  <Text style={[styles.freelancerName, { color: theme.text }]}>
                    {review.freelancerName}
                  </Text>

                  <Text style={[styles.serviceName, { color: theme.textSecondary }]}>
                    {review.service}
                  </Text>
                </View>

                <Text style={[styles.reviewDate, { color: theme.textSecondary }]}>
                  {review.date}
                </Text>
              </View>

              <View style={styles.reviewStarsArea}>
                {renderStars(review.rating)}
                <Text style={[styles.reviewRatingText, { color: theme.text }]}>
                  {review.rating},0
                </Text>
              </View>

              <Text style={[styles.reviewComment, { color: theme.textSecondary }]}>
                {review.comment}
              </Text>

              <View style={styles.tagsArea}>
                {review.tags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text style={[styles.tagText, { color: theme.text }]}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
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
            Avaliação mútua
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            No TaskFlow, a reputação da empresa ajuda freelancers a entenderem
            se o contratante é confiável, organizado e mantém boa comunicação.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
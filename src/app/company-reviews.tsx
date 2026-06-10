import { useEffect, useMemo, useState } from "react";
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

type CompanyReviewsSummary = {
  averageRating: number;
  totalReviews: number;
  fiveStarReviews: number;
  satisfactionRate: number;
};

export default function CompanyReviewsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [summary, setSummary] = useState<CompanyReviewsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    loadCompanyReviews();
  }, []);

  async function loadCompanyReviews() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a API.

        Exemplo:
        const response = await companyReviewsService.getMyCompanyReviews();

        setReviews(response.reviews);
        setSummary(response.summary);

        A API deve retornar somente as avaliações da empresa logada,
        usando o token salvo depois do login.

        Formato esperado:
        {
          summary: {
            averageRating: 4.8,
            totalReviews: 32,
            fiveStarReviews: 24,
            satisfactionRate: 96
          },
          reviews: [
            {
              id: "1",
              freelancerName: "Nome do freelancer",
              service: "Nome do serviço",
              rating: 5,
              date: "Hoje",
              comment: "Comentário recebido...",
              tags: ["Boa comunicação", "Organizada"]
            }
          ]
        }
      */

      setReviews([]);
      setSummary(null);
    } catch (error) {
      console.log("Erro ao carregar avaliações da empresa:", error);

      setReviews([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredReviews = useMemo(() => {
    if (selectedFilter === "positive") {
      return reviews.filter((review) => review.rating >= 4);
    }

    if (selectedFilter === "recent") {
      return reviews.slice(0, 5);
    }

    return reviews;
  }, [selectedFilter, reviews]);

  const averageRating = useMemo(() => {
    if (summary) {
      return summary.averageRating;
    }

    if (reviews.length === 0) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);

    return total / reviews.length;
  }, [summary, reviews]);

  const totalReviews = summary?.totalReviews ?? reviews.length;

  const fiveStarReviews =
    summary?.fiveStarReviews ??
    reviews.filter((review) => review.rating === 5).length;

  const satisfactionRate =
    summary?.satisfactionRate ??
    (reviews.length > 0
      ? Math.round(
          (reviews.filter((review) => review.rating >= 4).length /
            reviews.length) *
            100
        )
      : 0);

  function renderStars(rating: number) {
    const safeRating = Math.max(0, Math.min(5, rating));

    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= safeRating;

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

  function getFreelancerInitial(name: string) {
    if (!name) {
      return "?";
    }

    return name.charAt(0).toUpperCase();
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
            Baseado em {totalReviews} avaliações feitas por freelancers após
            serviços concluídos.
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
              {totalReviews}
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
              {satisfactionRate}%
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
          {isLoading ? (
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
                Carregando avaliações...
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Buscando a reputação da empresa.
              </Text>
            </View>
          ) : filteredReviews.length === 0 ? (
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
                Nenhuma avaliação encontrada
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Quando freelancers avaliarem a empresa, os comentários
                aparecerão aqui.
              </Text>
            </View>
          ) : (
            filteredReviews.map((review) => (
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
                      {getFreelancerInitial(review.freelancerName)}
                    </Text>
                  </View>

                  <View style={styles.reviewHeaderText}>
                    <Text
                      style={[styles.freelancerName, { color: theme.text }]}
                    >
                      {review.freelancerName}
                    </Text>

                    <Text
                      style={[
                        styles.serviceName,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {review.service}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.reviewDate,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {review.date}
                  </Text>
                </View>

                <View style={styles.reviewStarsArea}>
                  {renderStars(review.rating)}

                  <Text
                    style={[styles.reviewRatingText, { color: theme.text }]}
                  >
                    {review.rating},0
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

                {review.tags.length > 0 && (
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
                )}
              </View>
            ))
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
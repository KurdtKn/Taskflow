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
import { styles } from "@/app/styles/reviews";
import { useTheme } from "@/app/context/ThemeContext";

type ReviewType = "received" | "sent";

type ReviewItem = {
  id: string;
  type: ReviewType;
  author: string;
  target: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
};

type ReviewsSummary = {
  averageRating: number;
  totalReviews: number;
  satisfactionRate: number;
  completedServices: number;
};

function renderStars(rating: number) {
  const normalizedRating = Math.max(0, Math.min(5, rating));

  return "★".repeat(normalizedRating) + "☆".repeat(5 - normalizedRating);
}

export default function ReviewsScreen() {
  const [selectedType, setSelectedType] = useState<ReviewType>("received");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    try {
      setIsLoading(true);

      /*
        Aqui futuramente entra a API.

        Exemplo:
        const response = await reviewsService.getMyReviews();

        setReviews(response.reviews);
        setSummary(response.summary);

        A API vai identificar o usuário pelo token salvo no login.
        Assim ela retorna as avaliações recebidas e enviadas daquele usuário.
      */

      setReviews([]);
      setSummary(null);
    } catch (error) {
      console.log("Erro ao carregar avaliações:", error);

      setReviews([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => review.type === selectedType);
  }, [reviews, selectedType]);

  const receivedReviews = useMemo(() => {
    return reviews.filter((review) => review.type === "received");
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (summary) {
      return summary.averageRating;
    }

    if (receivedReviews.length === 0) {
      return 0;
    }

    const totalRating = receivedReviews.reduce(
      (total, review) => total + review.rating,
      0
    );

    return totalRating / receivedReviews.length;
  }, [summary, receivedReviews]);

  const totalReviews = summary?.totalReviews ?? receivedReviews.length;

  const satisfactionRate =
    summary?.satisfactionRate ??
    (receivedReviews.length > 0
      ? Math.round(
          (receivedReviews.filter((review) => review.rating >= 4).length /
            receivedReviews.length) *
            100
        )
      : 0);

  const completedServices = summary?.completedServices ?? 0;

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
          Avaliações
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
            <Text style={styles.averageRating}>
              {averageRating.toFixed(1).replace(".", ",")}
            </Text>
          </View>

          <View style={styles.summaryContent}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              Reputação no TaskFlow
            </Text>

            <Text style={styles.summaryStars}>
              {renderStars(Math.round(averageRating))}
            </Text>

            <Text
              style={[
                styles.summarySubtitle,
                { color: theme.textSecondary },
              ]}
            >
              Baseado em {totalReviews} avaliações recebidas
            </Text>
          </View>
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
              Total
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
              {completedServices}
            </Text>

            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Serviços
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.filterArea,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Pressable
            style={[
              styles.filterButton,
              selectedType === "received" && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType("received")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedType === "received" && styles.filterTextActive,
              ]}
            >
              Recebidas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedType === "sent" && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedType("sent")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedType === "sent" && styles.filterTextActive,
              ]}
            >
              Enviadas
            </Text>
          </Pressable>
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
                Buscando avaliações vinculadas à sua conta.
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
                Quando a API retornar avaliações da sua conta, elas aparecerão
                aqui.
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
                      {review.type === "received"
                        ? review.author.charAt(0).toUpperCase()
                        : review.target.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.reviewInfo}>
                    <Text style={[styles.reviewAuthor, { color: theme.text }]}>
                      {review.type === "received"
                        ? review.author
                        : `Para ${review.target}`}
                    </Text>

                    <Text
                      style={[
                        styles.reviewService,
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

                <Text style={styles.stars}>{renderStars(review.rating)}</Text>

                <Text style={[styles.comment, { color: theme.text }]}>
                  {review.comment}
                </Text>
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
            Importância das avaliações
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            As avaliações ajudam empresas e freelancers a criarem confiança,
            transparência e reputação dentro da plataforma.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
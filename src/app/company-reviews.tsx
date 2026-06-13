import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";

import { styles } from "@/app/styles/companyReviews";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";
import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

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

type AvaliacaoApi = {
  id?: number;
  contratoId?: number;
  contrato_id?: number;

  avaliadorId?: number;
  avaliador_id?: number;
  avaliadoId?: number;
  avaliado_id?: number;

  avaliador?: string | null;
  avaliadorNome?: string | null;
  nomeAvaliador?: string | null;
  author?: string | null;

  freelancer?: string | null;
  freelancerName?: string | null;
  nomeFreelancer?: string | null;

  chamado?: string | null;
  servico?: string | null;
  service?: string | null;
  tituloChamado?: string | null;
  jobTitle?: string | null;

  nota?: number;
  rating?: number;

  comentario?: string | null;
  comment?: string | null;

  dataAvaliacao?: string | null;
  data_avaliacao?: string | null;
  createdAt?: string | null;
};

type AvaliacoesResponse =
  | AvaliacaoApi[]
  | {
      data?: AvaliacaoApi[];
      dados?: AvaliacaoApi[];
      avaliacoes?: AvaliacaoApi[];
      media?: number;
      averageRating?: number;
      totalAvaliacoes?: number;
      totalReviews?: number;
    };

function getAvaliacoesFromResponse(response: AvaliacoesResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.avaliacoes ?? [];
}

function removeDuplicateReviews(avaliacoes: AvaliacaoApi[]) {
  return avaliacoes.filter((avaliacao, index, array) => {
    if (!avaliacao.id) {
      return true;
    }

    return array.findIndex((item) => item.id === avaliacao.id) === index;
  });
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Data não informada";
  }

  const normalizedValue = value.includes(" ")
    ? value.replace(" ", "T")
    : value;

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function getFreelancerName(review: AvaliacaoApi) {
  return (
    review.freelancerName ||
    review.nomeFreelancer ||
    review.freelancer ||
    review.avaliadorNome ||
    review.nomeAvaliador ||
    review.avaliador ||
    review.author ||
    "Freelancer TaskFlow"
  );
}

function getServiceName(review: AvaliacaoApi) {
  return (
    review.chamado ||
    review.servico ||
    review.service ||
    review.tituloChamado ||
    review.jobTitle ||
    "Serviço TaskFlow"
  );
}

function formatCompanyReview(review: AvaliacaoApi): CompanyReview {
  const rating = Number(review.nota ?? review.rating ?? 0);

  return {
    id: String(
      review.id ??
        `${review.contratoId ?? review.contrato_id ?? Date.now()}-${rating}`
    ),
    freelancerName: getFreelancerName(review),
    service: getServiceName(review),
    rating: Math.max(0, Math.min(5, Math.round(rating))),
    date: formatDate(
      review.dataAvaliacao ||
        review.data_avaliacao ||
        review.createdAt
    ),
    comment:
      review.comentario ||
      review.comment ||
      "Avaliação sem comentário.",
    tags: [],
  };
}

function calculateSummary(reviews: CompanyReview[]): CompanyReviewsSummary {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      fiveStarReviews: 0,
      satisfactionRate: 0,
    };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  const averageRating = total / reviews.length;

  const fiveStarReviews = reviews.filter((review) => review.rating === 5).length;

  const satisfactionRate = Math.round(
    (reviews.filter((review) => review.rating >= 4).length / reviews.length) *
      100
  );

  return {
    averageRating,
    totalReviews: reviews.length,
    fiveStarReviews,
    satisfactionRate,
  };
}

export default function CompanyReviewsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<ReviewFilter>("all");
  const [reviews, setReviews] = useState<CompanyReview[]>([]);
  const [summary, setSummary] = useState<CompanyReviewsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  const ratingCircleBackground = isDark ? colors.blue[700] : colors.primary;
  const activeFilterBackground = isDark ? colors.blue[700] : colors.primary;
  const activeFilterTextColor = colors.white;
  const starActiveColor = colors.warning;
  const starInactiveColor = theme.textSecondary;

  useFocusEffect(
    useCallback(() => {
      loadCompanyReviews();
    }, [])
  );

  async function loadCompanyReviews() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        setReviews([]);
        setSummary(null);
        router.replace("/login");
        return;
      }

      const userId = String(loggedUser.id);
      const perfilId = String(loggedUser.perfilId ?? loggedUser.id);

      const idsParaBuscar = Array.from(
        new Set([userId, perfilId].filter(Boolean))
      );

      const avaliacoesRecebidas: AvaliacaoApi[] = [];

      for (const idParaBuscar of idsParaBuscar) {
        try {
          const avaliacoesResponse = await apiGet<AvaliacoesResponse>(
            `/api/Avaliacoes/usuario/${idParaBuscar}`
          );

          const avaliacoes = getAvaliacoesFromResponse(avaliacoesResponse);

          avaliacoesRecebidas.push(...avaliacoes);
        } catch (error) {
          console.log(
            `Erro ao buscar avaliações da empresa ${idParaBuscar}:`,
            error
          );
        }
      }

      const avaliacoesSemDuplicar = removeDuplicateReviews(avaliacoesRecebidas);

      const formattedReviews = avaliacoesSemDuplicar
        .map(formatCompanyReview)
        .sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();

          if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
            return 0;
          }

          return dateB - dateA;
        });

      setReviews(formattedReviews);
      setSummary(calculateSummary(formattedReviews));
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
    const safeRating = Math.max(0, Math.min(5, Math.round(rating)));

    return Array.from({ length: 5 }).map((_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= safeRating;

      return (
        <Text
          key={starValue}
          style={[
            styles.star,
            {
              color: isActive ? starActiveColor : starInactiveColor,
              backgroundColor: "transparent",
            },
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

        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.text,
              backgroundColor: "transparent",
            },
          ]}
        >
          Avaliações da empresa
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
            styles.summaryCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.ratingCircle,
              {
                backgroundColor: ratingCircleBackground,
                borderColor: ratingCircleBackground,
              },
            ]}
          >
            <Text
              style={[
                styles.ratingNumber,
                {
                  color: colors.white,
                  backgroundColor: "transparent",
                },
              ]}
            >
              {averageRating.toFixed(1).replace(".", ",")}
            </Text>

            <Text
              style={[
                styles.ratingMax,
                {
                  color: colors.white,
                  backgroundColor: "transparent",
                },
              ]}
            >
              /5
            </Text>
          </View>

          <Text
            style={[
              styles.summaryTitle,
              {
                color: theme.text,
                backgroundColor: "transparent",
              },
            ]}
          >
            Reputação da empresa
          </Text>

          <View style={styles.summaryStars}>
            {renderStars(Math.round(averageRating))}
          </View>

          <Text
            style={[
              styles.summaryText,
              {
                color: theme.textSecondary,
                backgroundColor: "transparent",
              },
            ]}
          >
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
            <Text
              style={[
                styles.statNumber,
                {
                  color: theme.text,
                  backgroundColor: "transparent",
                },
              ]}
            >
              {totalReviews}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textSecondary,
                  backgroundColor: "transparent",
                },
              ]}
            >
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
            <Text
              style={[
                styles.statNumber,
                {
                  color: theme.text,
                  backgroundColor: "transparent",
                },
              ]}
            >
              {fiveStarReviews}
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textSecondary,
                  backgroundColor: "transparent",
                },
              ]}
            >
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
            <Text
              style={[
                styles.statNumber,
                {
                  color: theme.text,
                  backgroundColor: "transparent",
                },
              ]}
            >
              {satisfactionRate}%
            </Text>

            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.textSecondary,
                  backgroundColor: "transparent",
                },
              ]}
            >
              Satisfação
            </Text>
          </View>
        </View>

        <View style={styles.filtersArea}>
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === "all"
                    ? activeFilterBackground
                    : theme.card,
                borderColor:
                  selectedFilter === "all"
                    ? activeFilterBackground
                    : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === "all"
                      ? activeFilterTextColor
                      : theme.textSecondary,
                  backgroundColor: "transparent",
                },
              ]}
            >
              Todas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === "positive"
                    ? activeFilterBackground
                    : theme.card,
                borderColor:
                  selectedFilter === "positive"
                    ? activeFilterBackground
                    : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter("positive")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === "positive"
                      ? activeFilterTextColor
                      : theme.textSecondary,
                  backgroundColor: "transparent",
                },
              ]}
            >
              Positivas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedFilter === "recent"
                    ? activeFilterBackground
                    : theme.card,
                borderColor:
                  selectedFilter === "recent"
                    ? activeFilterBackground
                    : theme.border,
              },
            ]}
            onPress={() => setSelectedFilter("recent")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedFilter === "recent"
                      ? activeFilterTextColor
                      : theme.textSecondary,
                  backgroundColor: "transparent",
                },
              ]}
            >
              Recentes
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.text,
                backgroundColor: "transparent",
              },
            ]}
          >
            Comentários recebidos
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: theme.textSecondary,
                backgroundColor: "transparent",
              },
            ]}
          >
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
                  <View
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: ratingCircleBackground,
                      },
                    ]}
                  >
                    <Text style={[styles.avatarText, { color: colors.white }]}>
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
                    style={[
                      styles.reviewRatingText,
                      {
                        color: theme.text,
                        backgroundColor: "transparent",
                      },
                    ]}
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
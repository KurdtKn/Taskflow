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
import { styles } from "@/app/styles/reviews";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";
import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

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

  avaliado?: string | null;
  avaliadoNome?: string | null;
  nomeAvaliado?: string | null;
  target?: string | null;

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

type ContratoApi = {
  id?: number;
  status?: string | null;
};

type ContratosResponse =
  | ContratoApi[]
  | {
      data?: ContratoApi[];
      dados?: ContratoApi[];
      contratos?: ContratoApi[];
    };

function getAvaliacoesFromResponse(response: AvaliacoesResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.avaliacoes ?? [];
}

function getContratosFromResponse(response: ContratosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.contratos ?? [];
}

function isFinishedStatus(status?: string | null) {
  const normalizedStatus = status?.toLowerCase().trim();

  return (
    normalizedStatus === "finalizado" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluído" ||
    normalizedStatus === "finished" ||
    normalizedStatus === "completed"
  );
}

function renderStars(rating: number) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return "★".repeat(normalizedRating) + "☆".repeat(5 - normalizedRating);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Data não informada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR");
}

function getReviewAuthor(review: AvaliacaoApi) {
  return (
    review.avaliadorNome ||
    review.nomeAvaliador ||
    review.avaliador ||
    review.author ||
    "Usuário TaskFlow"
  );
}

function getReviewTarget(review: AvaliacaoApi) {
  return (
    review.avaliadoNome ||
    review.nomeAvaliado ||
    review.avaliado ||
    review.target ||
    "Você"
  );
}

function getReviewService(review: AvaliacaoApi) {
  return (
    review.chamado ||
    review.servico ||
    review.service ||
    review.tituloChamado ||
    review.jobTitle ||
    "Serviço TaskFlow"
  );
}

function formatReceivedReview(review: AvaliacaoApi): ReviewItem {
  const rating = Number(review.nota ?? review.rating ?? 0);

  return {
    id: String(review.id ?? `${review.contratoId ?? review.contrato_id}-${Date.now()}`),
    type: "received",
    author: getReviewAuthor(review),
    target: "Você",
    service: getReviewService(review),
    rating: Math.max(0, Math.min(5, Math.round(rating))),
    comment:
      review.comentario ||
      review.comment ||
      "Avaliação sem comentário.",
    date: formatDate(
      review.dataAvaliacao ||
        review.data_avaliacao ||
        review.createdAt
    ),
  };
}

function calculateSummary(
  receivedReviews: ReviewItem[],
  completedServices: number
): ReviewsSummary {
  if (receivedReviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      satisfactionRate: 0,
      completedServices,
    };
  }

  const totalRating = receivedReviews.reduce(
    (total, review) => total + review.rating,
    0
  );

  const averageRating = totalRating / receivedReviews.length;

  const satisfactionRate = Math.round(
    (receivedReviews.filter((review) => review.rating >= 4).length /
      receivedReviews.length) *
      100
  );

  return {
    averageRating,
    totalReviews: receivedReviews.length,
    satisfactionRate,
    completedServices,
  };
}

export default function ReviewsScreen() {
  const [selectedType, setSelectedType] = useState<ReviewType>("received");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState<ReviewsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  const ratingCircleBackground = isDark ? colors.blue[700] : colors.primary;
  const activeFilterBackground = isDark ? colors.blue[700] : colors.primary;
  const activeFilterTextColor = colors.white;
  const starsColor = colors.warning;

  useFocusEffect(
    useCallback(() => {
      loadReviews();
    }, [])
  );

  async function loadReviews() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        setReviews([]);
        setSummary(null);
        router.replace("/login");
        return;
      }

      const userId = loggedUser.id;
      const perfilId = loggedUser.perfilId ?? loggedUser.id;
      const tipoUsuario = loggedUser.tipoUsuario?.toLowerCase().trim();

      let completedServices = 0;

      try {
        const contratosEndpoint =
          tipoUsuario === "empresa"
            ? `/api/Contratos/empresa/${perfilId}`
            : `/api/Contratos/freelancer/${perfilId}`;

        const contratosResponse = await apiGet<ContratosResponse>(
          contratosEndpoint
        );

        const contratos = getContratosFromResponse(contratosResponse);

        completedServices = contratos.filter((contrato) =>
          isFinishedStatus(contrato.status)
        ).length;
      } catch (error) {
        console.log("Erro ao carregar serviços finalizados:", error);
      }

      const idsParaBuscar = Array.from(
        new Set([String(userId), String(perfilId)].filter(Boolean))
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
          console.log(`Erro ao buscar avaliações do usuário ${idParaBuscar}:`, error);
        }
      }

      const avaliacoesSemDuplicar = avaliacoesRecebidas.filter(
        (avaliacao, index, array) => {
          const idAvaliacao = avaliacao.id;

          if (!idAvaliacao) {
            return true;
          }

          return array.findIndex((item) => item.id === idAvaliacao) === index;
        }
      );

      const receivedReviews = avaliacoesSemDuplicar.map(formatReceivedReview);

      setReviews(receivedReviews);
      setSummary(calculateSummary(receivedReviews, completedServices));
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
          Avaliações
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
              },
            ]}
          >
            <Text
              style={[
                styles.averageRating,
                {
                  color: colors.white,
                },
              ]}
            >
              {averageRating.toFixed(1).replace(".", ",")}
            </Text>
          </View>

          <View style={styles.summaryContent}>
            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              Reputação no TaskFlow
            </Text>

            <Text
              style={[
                styles.summaryStars,
                {
                  color: starsColor,
                },
              ]}
            >
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
              selectedType === "received" && {
                backgroundColor: activeFilterBackground,
              },
            ]}
            onPress={() => setSelectedType("received")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedType === "received"
                      ? activeFilterTextColor
                      : theme.textSecondary,
                },
              ]}
            >
              Recebidas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterButton,
              selectedType === "sent" && styles.filterButtonActive,
              selectedType === "sent" && {
                backgroundColor: activeFilterBackground,
              },
            ]}
            onPress={() => setSelectedType("sent")}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedType === "sent"
                      ? activeFilterTextColor
                      : theme.textSecondary,
                },
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
                {selectedType === "received"
                  ? "Quando alguém avaliar seu perfil, a avaliação aparecerá aqui."
                  : "As avaliações enviadas ainda não estão sendo buscadas pela API."}
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

                <Text style={[styles.stars, { color: starsColor }]}>
                  {renderStars(review.rating)}
                </Text>

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
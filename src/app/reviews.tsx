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
import { styles } from "@/app/styles/reviews";

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

const reviewsData: ReviewItem[] = [
  {
    id: "1",
    type: "received",
    author: "TaskFlow Eventos",
    target: "Usuário TaskFlow",
    service: "Garçom para Evento",
    rating: 5,
    comment:
      "Profissional pontual, educado e com ótimo atendimento durante o evento.",
    date: "Hoje",
  },
  {
    id: "2",
    type: "received",
    author: "Studio Prime",
    target: "Usuário TaskFlow",
    service: "Fotógrafo Profissional",
    rating: 4,
    comment:
      "Boa comunicação e entrega organizada. Atendeu bem ao combinado.",
    date: "Ontem",
  },
  {
    id: "3",
    type: "received",
    author: "Empresa Alpha",
    target: "Usuário TaskFlow",
    service: "Apoio em Limpeza",
    rating: 5,
    comment:
      "Serviço realizado com responsabilidade e dentro do horário solicitado.",
    date: "2 dias atrás",
  },
  {
    id: "4",
    type: "sent",
    author: "Usuário TaskFlow",
    target: "TaskFlow Eventos",
    service: "Garçom para Evento",
    rating: 5,
    comment:
      "Empresa organizada, passou as informações corretamente e manteve boa comunicação.",
    date: "Hoje",
  },
  {
    id: "5",
    type: "sent",
    author: "Usuário TaskFlow",
    target: "Studio Prime",
    service: "Fotógrafo Profissional",
    rating: 4,
    comment:
      "Boa experiência, local de trabalho organizado e pagamento conforme combinado.",
    date: "Ontem",
  },
];

function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

export default function ReviewsScreen() {
  const [selectedType, setSelectedType] = useState<ReviewType>("received");

  const filteredReviews = useMemo(() => {
    return reviewsData.filter((review) => review.type === selectedType);
  }, [selectedType]);

  const receivedReviews = reviewsData.filter(
    (review) => review.type === "received"
  );

  const averageRating =
    receivedReviews.reduce((total, review) => total + review.rating, 0) /
    receivedReviews.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Avaliações</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          <View style={styles.ratingCircle}>
            <Text style={styles.averageRating}>
              {averageRating.toFixed(1)}
            </Text>
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Reputação no TaskFlow</Text>

            <Text style={styles.summaryStars}>
              {renderStars(Math.round(averageRating))}
            </Text>

            <Text style={styles.summarySubtitle}>
              Baseado em {receivedReviews.length} avaliações recebidas
            </Text>
          </View>
        </View>

        <View style={styles.statsArea}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Satisfação</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Serviços</Text>
          </View>
        </View>

        <View style={styles.filterArea}>
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
                selectedType === "sent" && styles.filterTextActive,
              ]}
            >
              Enviadas
            </Text>
          </Pressable>
        </View>

        <View style={styles.reviewsList}>
          {filteredReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {review.type === "received" ? "E" : "U"}
                  </Text>
                </View>

                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewAuthor}>
                    {review.type === "received"
                      ? review.author
                      : `Para ${review.target}`}
                  </Text>

                  <Text style={styles.reviewService}>{review.service}</Text>
                </View>

                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>

              <Text style={styles.stars}>{renderStars(review.rating)}</Text>

              <Text style={styles.comment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Importância das avaliações</Text>

          <Text style={styles.infoText}>
            As avaliações ajudam empresas e freelancers a criarem confiança,
            transparência e reputação dentro da plataforma.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
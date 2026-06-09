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
import CheckIcon from "../../assets/icons/check.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import BadgeIcon from "../../assets/icons/badge.svg";
import ChatIcon from "../../assets/icons/chat.svg";

import { styles } from "@/app/styles/companyPublicProfile";

const companyTags = [
  "Empresa verificada",
  "Boa comunicação",
  "Eventos",
  "Contratação rápida",
];

const reviews = [
  {
    id: "1",
    freelancer: "Usuário TaskFlow",
    rating: 5,
    comment:
      "Empresa organizada, passou todas as informações corretamente e manteve boa comunicação durante o serviço.",
    date: "Hoje",
  },
  {
    id: "2",
    freelancer: "Anna Clara",
    rating: 5,
    comment:
      "Ótima empresa para trabalhar. O pagamento foi confirmado e o serviço estava bem explicado.",
    date: "2 dias atrás",
  },
  {
    id: "3",
    freelancer: "Gabriel Santos",
    rating: 4,
    comment:
      "Boa experiência. O chamado estava claro e o contato pelo chat ajudou bastante.",
    date: "1 semana atrás",
  },
];

export default function CompanyPublicProfileScreen() {
  const params = useLocalSearchParams<{
    companyName?: string;
    companyLocation?: string;
    companyRating?: string;
    jobTitle?: string;
  }>();

  const companyName = params.companyName ?? "TaskFlow Eventos";
  const companyLocation = params.companyLocation ?? "Sorocaba - SP";
  const companyRating = params.companyRating ?? "4,9";
  const jobTitle = params.jobTitle ?? "Garçom para Evento";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Perfil da empresa</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.companyCard}>
          <View style={styles.logoArea}>
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            <View style={styles.verifiedBadge}>
              <CheckIcon width={13} height={13} />
            </View>
          </View>

          <Text style={styles.companyName}>{companyName}</Text>

          <Text style={styles.companyType}>Empresa contratante</Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>
            <Text style={styles.ratingText}>{companyRating}</Text>
            <Text style={styles.ratingSubtext}>• 32 avaliações</Text>
          </View>

          <View style={styles.statsArea}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>32</Text>
              <Text style={styles.statLabel}>Chamados</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>28</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>96%</Text>
              <Text style={styles.statLabel}>Satisfação</Text>
            </View>
          </View>
        </View>

        <View style={styles.jobCard}>
          <Text style={styles.cardLabel}>Chamado relacionado</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>

          <Text style={styles.jobText}>
            Este é o chamado publicado pela empresa que você está visualizando.
          </Text>
        </View>

        <View style={styles.aboutCard}>
          <Text style={styles.sectionTitle}>Sobre a empresa</Text>

          <Text style={styles.aboutText}>
            Empresa focada na contratação de profissionais para eventos, serviços
            rápidos e demandas sob demanda. Costuma publicar chamados com
            informações claras sobre local, horário, valor e atividades esperadas.
          </Text>

          <View style={styles.tagsArea}>
            {companyTags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Informações públicas</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LocationIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoLabel}>Localização</Text>
              <Text style={styles.infoValue}>{companyLocation}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <BadgeIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoLabel}>Tipo de conta</Text>
              <Text style={styles.infoValue}>Empresa verificada</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <ChatIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoLabel}>Tempo médio de resposta</Text>
              <Text style={styles.infoValue}>Até 10 minutos</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avaliações de freelancers</Text>

          <Text style={styles.sectionSubtitle}>
            Comentários feitos por profissionais que já prestaram serviços para
            esta empresa.
          </Text>

          <View style={styles.reviewsList}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.freelancer.charAt(0)}
                    </Text>
                  </View>

                  <View style={styles.reviewHeaderText}>
                    <Text style={styles.freelancerName}>
                      {review.freelancer}
                    </Text>

                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>

                  <Text style={styles.reviewRating}>⭐ {review.rating},0</Text>
                </View>

                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.securityBox}>
          <Text style={styles.securityTitle}>Contratação segura</Text>

          <Text style={styles.securityText}>
            O chat só será liberado após aceite da empresa e confirmação do
            fluxo. Ao final do serviço, as duas partes poderão se avaliar.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Voltar ao chamado</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
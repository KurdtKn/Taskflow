import { useEffect, useState } from "react";
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
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type CompanyReview = {
  id: string;
  freelancer: string;
  rating: number;
  comment: string;
  date: string;
};

type CompanyPublicProfile = {
  id?: string;
  name: string;
  location: string;
  rating?: string;
  reviewsCount?: number;
  totalJobs?: number;
  completedJobs?: number;
  satisfactionRate?: string;
  about?: string;
  tags: string[];
  isVerified: boolean;
  averageResponseTime?: string;
  reviews: CompanyReview[];
  logoUrl?: string;
};

export default function CompanyPublicProfileScreen() {
  const params = useLocalSearchParams<{
    companyId?: string;
    empresaId?: string;
    companyName?: string;
    companyLocation?: string;
    companyRating?: string;
    jobTitle?: string;
  }>();

  const { isDark, theme } = useTheme();

  const companyId = params.companyId ?? params.empresaId ?? "";
  const jobTitle = params.jobTitle ?? "Chamado selecionado";

  const [companyProfile, setCompanyProfile] =
    useState<CompanyPublicProfile | null>(null);

  useEffect(() => {
    loadCompanyProfile();
  }, [companyId]);

  async function loadCompanyProfile() {
    /*
      LOCAL DA API FUTURAMENTE:

      Quando a API tiver uma rota para buscar o perfil público da empresa,
      a chamada deve entrar aqui.

      Exemplo de rota futura:

      const response = await apiGet<CompanyPublicProfile>(
        `/api/Empresas/${companyId}/perfil-publico`
      );

      setCompanyProfile(response);

      Dados esperados da API:
      - nome da empresa
      - localização
      - nota média
      - quantidade de avaliações
      - total de chamados publicados
      - chamados concluídos
      - taxa de satisfação
      - descrição da empresa
      - tags
      - se é verificada
      - tempo médio de resposta
      - avaliações dos freelancers
      - logo da empresa
    */

    setCompanyProfile({
      id: companyId,
      name: params.companyName ?? "Empresa não informada",
      location: params.companyLocation ?? "Localização não informada",
      rating: params.companyRating,
      reviewsCount: undefined,
      totalJobs: undefined,
      completedJobs: undefined,
      satisfactionRate: undefined,
      about: undefined,
      tags: [],
      isVerified: false,
      averageResponseTime: undefined,
      reviews: [],
      logoUrl: undefined,
    });
  }

  const companyName = companyProfile?.name ?? "Empresa não informada";
  const companyLocation =
    companyProfile?.location ?? "Localização não informada";
  const companyRating = companyProfile?.rating ?? "Sem nota";
  const reviewsCount = companyProfile?.reviewsCount;
  const totalJobs = companyProfile?.totalJobs;
  const completedJobs = companyProfile?.completedJobs;
  const satisfactionRate = companyProfile?.satisfactionRate;
  const about = companyProfile?.about;
  const tags = companyProfile?.tags ?? [];
  const isVerified = companyProfile?.isVerified ?? false;
  const averageResponseTime = companyProfile?.averageResponseTime;
  const reviews = companyProfile?.reviews ?? [];
  const logoUrl = companyProfile?.logoUrl;

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
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Perfil da empresa
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.companyCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.logoArea}>
            {logoUrl ? (
              <Image
                source={{ uri: logoUrl }}
                style={styles.logo}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            )}

            {isVerified && (
              <View style={styles.verifiedBadge}>
                <CheckIcon width={13} height={13} />
              </View>
            )}
          </View>

          <Text style={[styles.companyName, { color: theme.text }]}>
            {companyName}
          </Text>

          <Text style={[styles.companyType, { color: theme.textSecondary }]}>
            Empresa contratante
          </Text>

          <View style={styles.ratingArea}>
            <Text style={styles.ratingIcon}>⭐</Text>

            <Text style={[styles.ratingText, { color: theme.text }]}>
              {companyRating}
            </Text>

            <Text style={[styles.ratingSubtext, { color: theme.textSecondary }]}>
              {reviewsCount !== undefined
                ? `• ${reviewsCount} avaliações`
                : "• avaliações via API"}
            </Text>
          </View>

          <View
            style={[
              styles.statsArea,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {totalJobs ?? "—"}
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Chamados
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
                {completedJobs ?? "—"}
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Concluídos
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
                {satisfactionRate ?? "—"}
              </Text>

              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Satisfação
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.jobCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.primary }]}>
            Chamado relacionado
          </Text>

          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          <Text style={[styles.jobText, { color: theme.textSecondary }]}>
            Este é o chamado publicado pela empresa que você está visualizando.
          </Text>
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
            Sobre a empresa
          </Text>

          <Text style={[styles.aboutText, { color: theme.textSecondary }]}>
            {about ??
              "As informações públicas da empresa serão carregadas pela API quando esse recurso estiver disponível."}
          </Text>

          {tags.length > 0 && (
            <View style={styles.tagsArea}>
              {tags.map((tag) => (
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

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Informações públicas
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LocationIcon width={22} height={22} color={colors.location} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Localização
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {companyLocation}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <BadgeIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Tipo de conta
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {isVerified ? "Empresa verificada" : "Verificação via API"}
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <ChatIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Tempo médio de resposta
              </Text>

              <Text style={[styles.infoValue, { color: theme.text }]}>
                {averageResponseTime ?? "Informação via API"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Avaliações de freelancers
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Comentários feitos por profissionais que já prestaram serviços para
            esta empresa.
          </Text>

          <View style={styles.reviewsList}>
            {reviews.length === 0 ? (
              <View
                style={[
                  styles.reviewCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.reviewComment, { color: theme.textSecondary }]}>
                  As avaliações reais da empresa serão exibidas aqui quando a API
                  retornar esses dados.
                </Text>
              </View>
            ) : (
              reviews.map((review) => (
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
                        {review.freelancer.charAt(0)}
                      </Text>
                    </View>

                    <View style={styles.reviewHeaderText}>
                      <Text
                        style={[styles.freelancerName, { color: theme.text }]}
                      >
                        {review.freelancer}
                      </Text>

                      <Text
                        style={[
                          styles.reviewDate,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {review.date}
                      </Text>
                    </View>

                    <Text style={styles.reviewRating}>
                      ⭐ {review.rating.toFixed(1).replace(".", ",")}
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
              ))
            )}
          </View>
        </View>

        <View
          style={[
            styles.securityBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.securityTitle, { color: theme.text }]}>
            Contratação segura
          </Text>

          <Text style={[styles.securityText, { color: theme.textSecondary }]}>
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
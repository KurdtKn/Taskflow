import type { ComponentType } from "react";
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
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import StarIcon from "../../assets/icons/star_border.svg";
import PlusIcon from "../../assets/icons/Plus-icon.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import BadgeIcon from "../../assets/icons/badge.svg";

import { styles } from "@/app/styles/portfolio";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type PortfolioProfile = {
  id: string;
  name: string;
  userRole: string;
  photoUrl?: string;
  rating?: number;
  reviewsCount?: number;
  professionalSummary?: string;
  skills: string[];
};

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
};

export default function PortfolioScreen() {
  const { isDark, theme } = useTheme();

  const [profile, setProfile] = useState<PortfolioProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  async function loadPortfolio() {
    try {
      setIsLoading(true);

      /*
        Aqui futuramente entra a API.

        Exemplo:
        const response = await portfolioService.getMyPortfolio();

        setProfile(response.profile);
        setPortfolioItems(response.items);

        A API vai identificar o usuário pelo token salvo após o login.
      */

      setProfile(null);
      setPortfolioItems([]);
    } catch (error) {
      console.log("Erro ao carregar portfólio:", error);

      setProfile(null);
      setPortfolioItems([]);
    } finally {
      setIsLoading(false);
    }
  }

  function getPortfolioIcon(category: string): ComponentType<any> {
    const normalizedCategory = category.toLowerCase();

    if (normalizedCategory.includes("evento")) {
      return AssignmentIcon;
    }

    if (
      normalizedCategory.includes("serviço") ||
      normalizedCategory.includes("manutenção")
    ) {
      return SettingsIcon;
    }

    if (
      normalizedCategory.includes("foto") ||
      normalizedCategory.includes("portfólio")
    ) {
      return BadgeIcon;
    }

    return AssignmentIcon;
  }

  function formatRating() {
    if (!profile?.rating) {
      return "Sem avaliações";
    }

    const rating = profile.rating.toFixed(1).replace(".", ",");
    const reviewsCount = profile.reviewsCount ?? 0;

    return `${rating} • ${reviewsCount} avaliações`;
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
          Portfólio
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View
            style={[
              styles.profileSummaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                Carregando portfólio...
              </Text>

              <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                Buscando dados da sua conta.
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={[
              styles.profileSummaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            {profile?.photoUrl ? (
              <Image
                source={{ uri: profile.photoUrl }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor: theme.inputBackground,
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text
                  style={{
                    color: theme.textSecondary,
                    fontSize: 28,
                    fontWeight: "900",
                  }}
                >
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
                </Text>
              </View>
            )}

            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {profile?.name ?? "Perfil não carregado"}
              </Text>

              <Text style={[styles.userRole, { color: theme.textSecondary }]}>
                {profile?.userRole ?? "Freelancer"}
              </Text>

              <View style={styles.ratingArea}>
                <StarIcon width={18} height={18} />

                <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
                  {formatRating()}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Resumo profissional
          </Text>

          <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
            {profile?.professionalSummary ??
              "Quando a API retornar o resumo profissional do usuário, ele aparecerá aqui."}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Habilidades
          </Text>

          {profile?.skills && profile.skills.length > 0 ? (
            <View style={styles.skillsArea}>
              {profile.skills.map((skill) => (
                <View
                  key={skill}
                  style={[
                    styles.skillChip,
                    {
                      backgroundColor: theme.card,
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
          ) : (
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
                Nenhuma habilidade cadastrada
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Quando o usuário cadastrar habilidades, elas aparecerão aqui.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Trabalhos realizados
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push("/add-portfolio-item")}
          >
            <PlusIcon width={16} height={16} color={colors.plus} />
            <Text style={styles.addButtonText}>Adicionar</Text>
          </Pressable>
        </View>

        <View style={styles.portfolioList}>
          {portfolioItems.length === 0 ? (
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
                Nenhum trabalho cadastrado
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Quando houver trabalhos cadastrados na API, eles aparecerão aqui.
              </Text>
            </View>
          ) : (
            portfolioItems.map((item) => {
              const Icon = getPortfolioIcon(item.category);

              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.portfolioCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    pressed && styles.portfolioCardPressed,
                  ]}
                  onPress={() => {
                    /*
                      Aqui futuramente podemos abrir detalhes do item.

                      Exemplo:
                      router.push({
                        pathname: "/portfolio-item-details",
                        params: { id: item.id },
                      });
                    */
                  }}
                >
                  <View style={styles.itemIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemTitle, { color: theme.text }]}>
                        {item.title}
                      </Text>

                      <Text
                        style={[
                          styles.itemDate,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {item.date}
                      </Text>
                    </View>

                    <Text style={[styles.itemCategory, { color: colors.primary }]}>
                      {item.category}
                    </Text>

                    <Text
                      style={[
                        styles.itemDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </Pressable>
              );
            })
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
            Dica para melhorar seu perfil
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Quanto mais completo estiver seu portfólio, maiores são as chances de
            uma empresa aceitar sua solicitação.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
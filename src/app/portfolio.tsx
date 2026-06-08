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
import { styles } from "@/app/styles/portfolio";

type PortfolioItem = {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  date: string;
};

const portfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Atendimento em evento corporativo",
    category: "Eventos",
    description:
      "Atuação como garçom em evento empresarial, auxiliando na recepção, organização e atendimento aos convidados.",
    icon: "🍽️",
    date: "Março de 2026",
  },
  {
    id: "2",
    title: "Apoio em serviço rápido",
    category: "Serviços gerais",
    description:
      "Suporte em atividade pontual com foco em organização, agilidade e comunicação com o contratante.",
    icon: "🛠️",
    date: "Fevereiro de 2026",
  },
  {
    id: "3",
    title: "Cobertura fotográfica simples",
    category: "Fotografia",
    description:
      "Registro de fotos para evento pequeno, com entrega organizada das imagens ao contratante.",
    icon: "📸",
    date: "Janeiro de 2026",
  },
];

const skills = [
  "Eventos",
  "Garçom",
  "Atendimento",
  "Organização",
  "Serviços gerais",
  "Comunicação",
];

export default function PortfolioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Portfólio</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileSummaryCard}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.avatar}
            resizeMode="contain"
          />

          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Usuário TaskFlow</Text>
            <Text style={styles.userRole}>Freelancer</Text>

            <View style={styles.ratingArea}>
              <Text style={styles.ratingIcon}>⭐</Text>
              <Text style={styles.ratingText}>4,8 • 24 avaliações</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo profissional</Text>

          <Text style={styles.summaryText}>
            Profissional disponível para serviços sob demanda, com experiência em
            atendimento ao público, eventos, organização e atividades rápidas.
            Busca entregar serviços com responsabilidade, pontualidade e boa
            comunicação.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>

          <View style={styles.skillsArea}>
            {skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trabalhos realizados</Text>

          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
            ]}
            onPress={() => router.push("/add-portfolio-item")}
          >
            <Text style={styles.addButtonText}>+ Adicionar</Text>
          </Pressable>
        </View>

        <View style={styles.portfolioList}>
          {portfolioItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.portfolioCard,
                pressed && styles.portfolioCardPressed,
              ]}
              onPress={() => {
                console.log("Portfolio selecionado:", item.title);
              }}
            >
              <View style={styles.itemIconBox}>
                <Text style={styles.itemIcon}>{item.icon}</Text>
              </View>

              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>

                <Text style={styles.itemCategory}>{item.category}</Text>

                <Text style={styles.itemDescription}>{item.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Dica para melhorar seu perfil</Text>
          <Text style={styles.infoText}>
            Quanto mais completo estiver seu portfólio, maiores são as chances de
            uma empresa aceitar sua solicitação.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
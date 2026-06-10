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

import PlusIcon from "../../assets/icons/Plus-icon.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/companyDashboard";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type JobStatus = "active" | "pending" | "finished";

type CompanyJob = {
  id: string;
  title: string;
  category: string;
  price: string;
  location: string;
  time: string;
  candidates: number;
  status: JobStatus;
};

const companyJobs: CompanyJob[] = [
  {
    id: "1",
    title: "Garçom para Evento",
    category: "Eventos",
    price: "R$200,00",
    location: "Centro",
    time: "Hoje, 18:00",
    candidates: 6,
    status: "active",
  },
  {
    id: "2",
    title: "Fotógrafo Profissional",
    category: "Fotografia",
    price: "R$300,00",
    location: "Moema",
    time: "Sábado, 14:00",
    candidates: 3,
    status: "pending",
  },
  {
    id: "3",
    title: "Apoio em Limpeza",
    category: "Serviços gerais",
    price: "R$120,00",
    location: "Vila Olímpia",
    time: "Concluído",
    candidates: 4,
    status: "finished",
  },
];

const statusConfig = {
  active: {
    label: "Ativo",
    badgeStyle: "activeBadge",
    textStyle: "activeText",
  },
  pending: {
    label: "Em análise",
    badgeStyle: "pendingBadge",
    textStyle: "pendingText",
  },
  finished: {
    label: "Concluído",
    badgeStyle: "finishedBadge",
    textStyle: "finishedText",
  },
} as const;

export default function CompanyDashboardScreen() {
  const { isDark, theme } = useTheme();

  const activeJobs = companyJobs.filter((job) => job.status === "active").length;

  const totalCandidates = companyJobs.reduce(
    (total, job) => total + job.candidates,
    0
  );

  function handleCreateJob() {
    router.push("/create-job");
  }

  function handleViewCandidates(job: CompanyJob) {
  if (job.status === "finished") {
    router.push({
      pathname: "/service-completed",
      params: {
        title: job.title,
        category: job.category,
        price: job.price,
        location: job.location,
        time: job.time,
      },
    });

    return;
  }

  if (job.status === "pending") {
    router.push({
      pathname: "/chat",
      params: {
        title: job.title,
        category: job.category,
        price: job.price,
        location: job.location,
        time: job.time,
      },
    });

    return;
  }

    router.push({
      pathname: "/job-candidates",
      params: {
        title: job.title,
        category: job.category,
        price: job.price,
        location: job.location,
        time: job.time,
        candidates: String(job.candidates),
      },
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>
              Olá, Empresa
            </Text>

            <Text style={[styles.title, { color: theme.text }]}>
              Gerencie seus chamados
            </Text>
          </View>

          <Pressable
            style={[
              styles.profileButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
            onPress={() => router.push("/company-profile")}
          >
            <Image
              source={require("../../assets/images/icon.png")}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </Pressable>
        </View>

        <View style={styles.summaryArea}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.summaryNumber, { color: theme.text }]}>
              {companyJobs.length}
            </Text>

            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Chamados
            </Text>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border, //
              },
            ]}
          >
            <Text style={[styles.summaryNumber, { color: theme.text }]}>
              {activeJobs}
            </Text>

            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Ativos
            </Text>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.summaryNumber, { color: theme.text }]}>
              {totalCandidates}
            </Text>

            <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
              Candidatos
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.createJobButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreateJob}
        >
          <PlusIcon width={18} height={18} color={colors.plus}/>
          <Text style={styles.createJobText}>Criar novo chamado</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Meus chamados
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Acompanhe suas publicações
          </Text>
        </View>

        <View style={styles.jobsList}>
          {companyJobs.map((job) => {
            const currentStatus = statusConfig[job.status];

            return (
              <Pressable
                key={job.id}
                style={({ pressed }) => [
                  styles.jobCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  pressed && styles.jobCardPressed,
                ]}
                onPress={() => handleViewCandidates(job)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardTitleArea}>
                    <Text style={[styles.jobTitle, { color: theme.text }]}>
                      {job.title}
                    </Text>

                    <Text style={[styles.jobCategory, { color: theme.textSecondary }]}>
                      {job.category}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      styles[currentStatus.badgeStyle],
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        styles[currentStatus.textStyle],
                      ]}
                    >
                      {currentStatus.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoArea}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoIconBox}>
                      <WalletIcon width={18} height={18} />
                    </View>

                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                      {job.price}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconBox}>
                      <LocationIcon width={18} height={18} color={colors.location}/>
                    </View>

                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                      {job.location}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoIconBox}>
                      <TimeIcon width={18} height={18} />
                    </View>

                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                      {job.time}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.cardFooter,
                    { borderTopColor: theme.border },
                  ]}
                >
                  <View style={styles.candidatesArea}>
                    <Text style={[styles.candidatesNumber, { color: theme.text }]}>
                      {job.candidates}
                    </Text>

                    <Text style={[styles.candidatesText, { color: theme.textSecondary }]}>
                      candidatos
                    </Text>
                  </View>

                  <Text style={styles.detailsText}>
                    {job.status === "finished"
                      ? "Ver serviço concluído ›"
                      : job.status === "pending"
                      ? "Abrir chat ›"
                      : "Ver candidatos ›"}
                  </Text>
                </View>
              </Pressable>
            );
          })}
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
            Dica para empresas
          </Text>

          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Chamados com descrição clara, valor definido e horário informado
            costumam receber mais candidatos qualificados.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={() => router.replace("/welcome")}
        >
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
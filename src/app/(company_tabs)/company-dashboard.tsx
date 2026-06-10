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

import PlusIcon from "../../../assets/icons/Plus-icon.svg";
import WalletIcon from "../../../assets/icons/wallet.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import TimeIcon from "../../../assets/icons/access_time.svg";
import AssignmentIcon from "../../../assets/icons/assignment.svg";

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

  const [companyJobs, setCompanyJobs] = useState<CompanyJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCompanyJobs();
  }, []);

  async function loadCompanyJobs() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a API.

        Exemplo:
        const response = await companyJobsService.getMyJobs();
        setCompanyJobs(response);

        A API deve retornar apenas os chamados da empresa logada,
        usando o token salvo depois do login.

        Formato esperado:
        [
          {
            id: "1",
            title: "Garçom para Evento",
            category: "Eventos",
            price: "R$200,00",
            location: "Centro",
            time: "Hoje, 18:00",
            candidates: 6,
            status: "active"
          }
        ]

        Status aceitos nessa tela:
        active   -> chamado ativo
        pending  -> chamado em análise
        finished -> chamado concluído
      */

      setCompanyJobs([]);
    } catch (error) {
      console.log("Erro ao carregar chamados da empresa:", error);
      setCompanyJobs([]);
    } finally {
      setIsLoading(false);
    }
  }

  const activeJobs = useMemo(() => {
    return companyJobs.filter((job) => job.status === "active").length;
  }, [companyJobs]);

  const totalCandidates = useMemo(() => {
    return companyJobs.reduce((total, job) => total + job.candidates, 0);
  }, [companyJobs]);

  function handleCreateJob() {
    router.push("/create-job");
  }

  function handleViewCandidates(job: CompanyJob) {
    router.push({
      pathname: "/job-candidates",
      params: {
        id: job.id,
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
                borderColor: theme.border,
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
          <PlusIcon width={18} height={18} color={colors.plus} />
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
                Carregando chamados...
              </Text>

              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                Buscando os chamados publicados pela empresa.
              </Text>
            </View>
          ) : companyJobs.length === 0 ? (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={{ alignItems: "center", marginBottom: 10 }}>
                <AssignmentIcon width={34} height={34} />
              </View>

              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Nenhum chamado publicado
              </Text>

              <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                Quando a empresa criar chamados, eles aparecerão aqui.
              </Text>
            </View>
          ) : (
            companyJobs.map((job) => {
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

                      <Text
                        style={[
                          styles.jobCategory,
                          { color: theme.textSecondary },
                        ]}
                      >
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

                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {job.price}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoIconBox}>
                        <LocationIcon
                          width={18}
                          height={18}
                          color={colors.location}
                        />
                      </View>

                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {job.location}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoIconBox}>
                        <TimeIcon width={18} height={18} />
                      </View>

                      <Text
                        style={[
                          styles.infoText,
                          { color: theme.textSecondary },
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.candidatesNumber,
                          { color: theme.text },
                        ]}
                      >
                        {job.candidates}
                      </Text>

                      <Text
                        style={[
                          styles.candidatesText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        candidatos
                      </Text>
                    </View>

                    <Text style={styles.detailsText}>Ver candidatos ›</Text>
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
            Dica para empresas
          </Text>

          <Text style={[styles.tipText, { color: theme.textSecondary }]}>
            Chamados com descrição clara, valor definido e horário informado
            costumam receber mais candidatos qualificados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
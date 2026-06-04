import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { styles } from "@/app/styles/companyDashboard";

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
  const activeJobs = companyJobs.filter((job) => job.status === "active").length;
  const totalCandidates = companyJobs.reduce(
    (total, job) => total + job.candidates,
    0
  );

  function handleCreateJob() {
    router.push("/create-job");
}

  function handleViewCandidates(job: CompanyJob) {
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Empresa 👋</Text>
            <Text style={styles.title}>Gerencie seus chamados</Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() => console.log("Abrir perfil da empresa")}
          >
            <Text style={styles.profileInitial}>E</Text>
          </Pressable>
        </View>

        <View style={styles.summaryArea}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{companyJobs.length}</Text>
            <Text style={styles.summaryLabel}>Chamados</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{activeJobs}</Text>
            <Text style={styles.summaryLabel}>Ativos</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{totalCandidates}</Text>
            <Text style={styles.summaryLabel}>Candidatos</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.createJobButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreateJob}
        >
          <Text style={styles.createJobIcon}>+</Text>
          <Text style={styles.createJobText}>Criar novo chamado</Text>
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meus chamados</Text>
          <Text style={styles.sectionSubtitle}>Acompanhe suas publicações</Text>
        </View>

        <View style={styles.jobsList}>
          {companyJobs.map((job) => {
            const currentStatus = statusConfig[job.status];

            return (
              <Pressable
                key={job.id}
                style={({ pressed }) => [
                  styles.jobCard,
                  pressed && styles.jobCardPressed,
                ]}
                onPress={() => handleViewCandidates(job)}
              >
                <View style={styles.cardTop}>
                  <View style={styles.cardTitleArea}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCategory}>{job.category}</Text>
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
                    <Text style={styles.infoIcon}>💰</Text>
                    <Text style={styles.infoText}>{job.price}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoText}>{job.location}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>🕒</Text>
                    <Text style={styles.infoText}>{job.time}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.candidatesArea}>
                    <Text style={styles.candidatesNumber}>
                      {job.candidates}
                    </Text>
                    <Text style={styles.candidatesText}>candidatos</Text>
                  </View>

                  <Text style={styles.detailsText}>Ver candidatos ›</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Dica para empresas</Text>
            <Text style={styles.tipText}>
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
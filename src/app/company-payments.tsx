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
import { styles } from "@/app/styles/companyPayments";
import { colors } from "@/styles/colors";

type PaymentStatus = "paid" | "pending" | "refunded";
type PaymentFilter = "all" | PaymentStatus;

type PaymentItem = {
  id: string;
  service: string;
  freelancer: string;
  date: string;
  method: string;
  serviceValue: string;
  platformFee: string;
  total: string;
  status: PaymentStatus;
};

const paymentsData: PaymentItem[] = [
  {
    id: "1",
    service: "Garçom para Evento",
    freelancer: "Usuário TaskFlow",
    date: "Hoje, 18:00",
    method: "Pix",
    serviceValue: "R$200,00",
    platformFee: "R$20,00",
    total: "R$220,00",
    status: "paid",
  },
  {
    id: "2",
    service: "Fotógrafo Profissional",
    freelancer: "Anna Clara",
    date: "Sábado, 14:00",
    method: "Cartão",
    serviceValue: "R$300,00",
    platformFee: "R$30,00",
    total: "R$330,00",
    status: "pending",
  },
  {
    id: "3",
    service: "Apoio em Limpeza",
    freelancer: "Gabriel Santos",
    date: "Ontem, 09:00",
    method: "Carteira TaskFlow",
    serviceValue: "R$120,00",
    platformFee: "R$12,00",
    total: "R$132,00",
    status: "paid",
  },
  {
    id: "4",
    service: "Reparo Hidráulico",
    freelancer: "Carlos Oliveira",
    date: "2 dias atrás",
    method: "Pix",
    serviceValue: "R$150,00",
    platformFee: "R$15,00",
    total: "R$165,00",
    status: "refunded",
  },
];

const statusConfig = {
  paid: {
    label: "Pago",
    backgroundColor: "rgba(0,176,80,0.12)",
    textColor: colors.success,
  },
  pending: {
    label: "Pendente",
    backgroundColor: "rgba(245,158,11,0.14)",
    textColor: colors.warning,
  },
  refunded: {
    label: "Estornado",
    backgroundColor: "rgba(220,38,38,0.1)",
    textColor: colors.danger,
  },
};

export default function CompanyPaymentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilter>("all");

  const filteredPayments = useMemo(() => {
    if (selectedFilter === "all") {
      return paymentsData;
    }

    return paymentsData.filter((payment) => payment.status === selectedFilter);
  }, [selectedFilter]);

  const paidPayments = paymentsData.filter(
    (payment) => payment.status === "paid"
  );

  const totalPaid = paidPayments.length;
  const pendingPayments = paymentsData.filter(
    (payment) => payment.status === "pending"
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Pagamentos</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Total movimentado</Text>
            <Text style={styles.summaryValue}>R$682,00</Text>
            <Text style={styles.summaryText}>
              Serviços e taxas registrados na plataforma.
            </Text>
          </View>

          <View style={styles.summaryIconBox}>
            <Text style={styles.summaryIcon}>💳</Text>
          </View>
        </View>

        <View style={styles.statsArea}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{paymentsData.length}</Text>
            <Text style={styles.statLabel}>Transações</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPaid}</Text>
            <Text style={styles.statLabel}>Pagas</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingPayments}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
        </View>

        <View style={styles.filtersArea}>
          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === "all" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "all" && styles.filterTextActive,
              ]}
            >
              Todos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === "paid" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("paid")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "paid" && styles.filterTextActive,
              ]}
            >
              Pagos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === "pending" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("pending")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "pending" && styles.filterTextActive,
              ]}
            >
              Pendentes
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === "refunded" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("refunded")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "refunded" && styles.filterTextActive,
              ]}
            >
              Estornos
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Histórico de pagamentos</Text>
          <Text style={styles.sectionSubtitle}>
            Acompanhe taxas, serviços e transações.
          </Text>
        </View>

        <View style={styles.paymentsList}>
          {filteredPayments.map((payment) => {
            const currentStatus = statusConfig[payment.status];

            return (
              <Pressable
                key={payment.id}
                style={({ pressed }) => [
                  styles.paymentCard,
                  pressed && styles.paymentCardPressed,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleArea}>
                    <Text style={styles.paymentService}>
                      {payment.service}
                    </Text>

                    <Text style={styles.paymentFreelancer}>
                      Freelancer: {payment.freelancer}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: currentStatus.backgroundColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: currentStatus.textColor },
                      ]}
                    >
                      {currentStatus.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoArea}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Data</Text>
                    <Text style={styles.infoValue}>{payment.date}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Forma</Text>
                    <Text style={styles.infoValue}>{payment.method}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Valor do serviço</Text>
                    <Text style={styles.infoValue}>
                      {payment.serviceValue}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Taxa TaskFlow</Text>
                    <Text style={styles.infoValue}>
                      {payment.platformFee}
                    </Text>
                  </View>
                </View>

                <View style={styles.totalArea}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{payment.total}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Controle financeiro</Text>

          <Text style={styles.infoText}>
            Essa tela ajuda a empresa a acompanhar pagamentos, taxas da
            plataforma e histórico dos serviços contratados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
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
import CreditCardIcon from "../../assets/icons/credit_card.svg";

import { styles } from "@/app/styles/companyPayments";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

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

  const { isDark, theme } = useTheme();

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
          Pagamentos
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
          <View>
            <Text style={[styles.summaryLabel, { color: theme.primary }]}>
              Total movimentado
            </Text>

            <Text style={[styles.summaryValue, { color: theme.text }]}>
              R$682,00
            </Text>

            <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
              Serviços e taxas registrados na plataforma.
            </Text>
          </View>

          <View style={styles.summaryIconBox}>
            <CreditCardIcon width={34} height={34} />
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
              {paymentsData.length}
            </Text>

            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Transações
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
              {totalPaid}
            </Text>

            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Pagas
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
              {pendingPayments}
            </Text>

            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Pendentes
            </Text>
          </View>
        </View>

        <View style={styles.filtersArea}>
          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "all" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "all" && styles.filterTextActive,
              ]}
            >
              Todos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "paid" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("paid")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "paid" && styles.filterTextActive,
              ]}
            >
              Pagos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "pending" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("pending")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "pending" && styles.filterTextActive,
              ]}
            >
              Pendentes
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "refunded" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("refunded")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "refunded" && styles.filterTextActive,
              ]}
            >
              Estornos
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Histórico de pagamentos
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
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
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  pressed && styles.paymentCardPressed,
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleArea}>
                    <Text style={[styles.paymentService, { color: theme.text }]}>
                      {payment.service}
                    </Text>

                    <Text
                      style={[
                        styles.paymentFreelancer,
                        { color: theme.textSecondary },
                      ]}
                    >
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
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Data
                    </Text>

                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {payment.date}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.border },
                    ]}
                  />

                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Forma
                    </Text>

                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {payment.method}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.border },
                    ]}
                  />

                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Valor do serviço
                    </Text>

                    <Text style={[styles.infoValue, { color: theme.text }]}>
                      {payment.serviceValue}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.divider,
                      { backgroundColor: theme.border },
                    ]}
                  />

                  <View style={styles.infoRow}>
                    <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                      Taxa TaskFlow
                    </Text>

                    <Text style={[styles.infoValue, { color: theme.text }]}>
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
            Controle financeiro
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Essa tela ajuda a empresa a acompanhar pagamentos, taxas da
            plataforma e histórico dos serviços contratados.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
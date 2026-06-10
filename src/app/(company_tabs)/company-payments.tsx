import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import CreditCardIcon from "../../../assets/icons/credit_card.svg";

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
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a API.

        Exemplo:
        const response = await companyPaymentsService.getMyPayments();
        setPayments(response);

        A API deve retornar somente os pagamentos da empresa logada,
        usando o token salvo depois do login.

        Formato esperado:
        [
          {
            id: "1",
            service: "Garçom para Evento",
            freelancer: "Nome do freelancer",
            date: "Hoje, 18:00",
            method: "Pix",
            serviceValue: "R$200,00",
            platformFee: "R$20,00",
            total: "R$220,00",
            status: "paid"
          }
        ]

        Status aceitos:
        paid     -> pagamento confirmado
        pending  -> pagamento pendente
        refunded -> pagamento estornado
      */

      setPayments([]);
    } catch (error) {
      console.log("Erro ao carregar pagamentos da empresa:", error);
      setPayments([]);
    } finally {
      setIsLoading(false);
    }
  }

  function getMoneyValue(value: string) {
    const normalizedValue = value.replace(/\D/g, "");
    const numberValue = Number(normalizedValue) / 100;

    if (Number.isNaN(numberValue)) {
      return 0;
    }

    return numberValue;
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const filteredPayments = useMemo(() => {
    if (selectedFilter === "all") {
      return payments;
    }

    return payments.filter((payment) => payment.status === selectedFilter);
  }, [selectedFilter, payments]);

  const totalMoved = useMemo(() => {
    return payments.reduce((total, payment) => {
      return total + getMoneyValue(payment.total);
    }, 0);
  }, [payments]);

  const totalPaid = useMemo(() => {
    return payments.filter((payment) => payment.status === "paid").length;
  }, [payments]);

  const pendingPayments = useMemo(() => {
    return payments.filter((payment) => payment.status === "pending").length;
  }, [payments]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.header}>
        <View style={styles.headerPlaceholder} />

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
            <Text style={[styles.summaryLabel, { color: colors.primary }]}>
              Total movimentado
            </Text>

            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {formatCurrency(totalMoved)}
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
              {payments.length}
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
                Carregando pagamentos...
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Buscando o histórico financeiro da empresa.
              </Text>
            </View>
          ) : filteredPayments.length === 0 ? (
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
                Nenhum pagamento encontrado
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Quando houver pagamentos, taxas ou estornos, eles aparecerão
                aqui.
              </Text>
            </View>
          ) : (
            filteredPayments.map((payment) => {
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
                      <Text
                        style={[
                          styles.paymentService,
                          { color: theme.text },
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.infoLabel,
                          { color: theme.textSecondary },
                        ]}
                      >
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
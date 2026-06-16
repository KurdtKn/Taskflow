import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CreditCardIcon from "../../../assets/icons/credit_card.svg";

import { styles } from "@/app/styles/companyPayments";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

type PaymentStatus = "paid" | "pending";
type PaymentFilter = "all" | PaymentStatus;

type PaymentItem = {
  id: string;
  jobId: string;
  contratoId: string;
  candidaturaId: string;
  service: string;
  freelancer: string;
  date: string;
  method: string;
  serviceValue: string;
  platformFee: string;
  total: string;
  status: PaymentStatus;
  category: string;
  location: string;
  rawDate: string;
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
};

function getLoggedCompanyId(loggedUser: any) {
  return (
    loggedUser?.perfilId ??
    loggedUser?.empresaId ??
    loggedUser?.idEmpresa ??
    loggedUser?.id_empresa ??
    loggedUser?.id ??
    null
  );
}

function parseMoneyValue(value?: number | string | null) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  const normalized = String(value)
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");

  const numberValue = Number(normalized);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return numberValue;
}

function formatApiCurrency(value?: number | string | null) {
  const numberValue = parseMoneyValue(value);

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatPaymentDate(value?: string) {
  if (!value) {
    return "Data não informada";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getTextValue(...values: any[]) {
  for (const value of values) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }
  }

  return "";
}


function normalizePaymentMethodLabel(value?: string) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  const normalized = rawValue
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Esse texto era o erro: ele é a descrição da cobrança, não a forma de pagamento.
  if (
    normalized === "taxa taskflow" ||
    normalized === "taskflow" ||
    normalized === "taxa da plataforma" ||
    normalized === "plataforma"
  ) {
    return "";
  }

  if (
    normalized.includes("pix") ||
    normalized === "instant payment" ||
    normalized === "instantaneo"
  ) {
    return "PIX";
  }

  if (
    normalized.includes("credito") ||
    normalized.includes("cartao") ||
    normalized === "card" ||
    normalized === "credit_card" ||
    normalized === "creditcard" ||
    normalized === "cartao_credito"
  ) {
    return "Cartão de crédito";
  }

  if (
    normalized.includes("debito") ||
    normalized === "debit_card" ||
    normalized === "debitcard" ||
    normalized === "cartao_debito"
  ) {
    return "Cartão de débito";
  }

  if (
    normalized.includes("saldo") ||
    normalized.includes("carteira") ||
    normalized === "wallet" ||
    normalized === "balance"
  ) {
    return "Saldo na conta";
  }

  if (normalized.includes("dinheiro") || normalized === "cash") {
    return "Dinheiro";
  }

  return rawValue;
}


const PAYMENT_METHOD_STORAGE_PREFIXES = [
  "taskflow_payment_method_",
  "payment_method_",
  "paymentMethod_",
  "selected_payment_method_",
];

function getPaymentMethodFromApi(chamado: any) {
  const possibleMethods = [
    chamado?.formaPagamento,
    chamado?.forma_pagamento,
    chamado?.metodoPagamento,
    chamado?.metodo_pagamento,
    chamado?.meioPagamento,
    chamado?.meio_pagamento,
    chamado?.paymentMethod,
    chamado?.payment_method,
    chamado?.method,
    chamado?.forma,
    chamado?.pagamento?.formaPagamento,
    chamado?.pagamento?.forma_pagamento,
    chamado?.pagamento?.metodoPagamento,
    chamado?.pagamento?.metodo_pagamento,
    chamado?.pagamento?.meioPagamento,
    chamado?.pagamento?.meio_pagamento,
    chamado?.pagamento?.paymentMethod,
    chamado?.pagamento?.payment_method,
    chamado?.pagamento?.method,
    chamado?.pagamento?.forma,
    chamado?.pagamentoTaxa?.formaPagamento,
    chamado?.pagamentoTaxa?.forma_pagamento,
    chamado?.pagamentoTaxa?.metodoPagamento,
    chamado?.pagamentoTaxa?.metodo_pagamento,
    chamado?.pagamentoTaxa?.paymentMethod,
    chamado?.pagamentoTaxa?.payment_method,
    chamado?.pagamento_taxa?.formaPagamento,
    chamado?.pagamento_taxa?.forma_pagamento,
    chamado?.pagamento_taxa?.metodoPagamento,
    chamado?.pagamento_taxa?.metodo_pagamento,
    chamado?.contrato?.formaPagamento,
    chamado?.contrato?.forma_pagamento,
    chamado?.contrato?.metodoPagamento,
    chamado?.contrato?.metodo_pagamento,
    chamado?.contrato?.paymentMethod,
    chamado?.contrato?.payment_method,
  ];

  if (Array.isArray(chamado?.pagamentos)) {
    for (const pagamento of chamado.pagamentos) {
      possibleMethods.push(
        pagamento?.formaPagamento,
        pagamento?.forma_pagamento,
        pagamento?.metodoPagamento,
        pagamento?.metodo_pagamento,
        pagamento?.paymentMethod,
        pagamento?.payment_method,
        pagamento?.method,
        pagamento?.forma
      );
    }
  }

  if (Array.isArray(chamado?.pagamentosTaxa)) {
    for (const pagamento of chamado.pagamentosTaxa) {
      possibleMethods.push(
        pagamento?.formaPagamento,
        pagamento?.forma_pagamento,
        pagamento?.metodoPagamento,
        pagamento?.metodo_pagamento,
        pagamento?.paymentMethod,
        pagamento?.payment_method,
        pagamento?.method,
        pagamento?.forma
      );
    }
  }

  if (Array.isArray(chamado?.pagamentos_taxa)) {
    for (const pagamento of chamado.pagamentos_taxa) {
      possibleMethods.push(
        pagamento?.formaPagamento,
        pagamento?.forma_pagamento,
        pagamento?.metodoPagamento,
        pagamento?.metodo_pagamento,
        pagamento?.paymentMethod,
        pagamento?.payment_method,
        pagamento?.method,
        pagamento?.forma
      );
    }
  }

  for (const possibleMethod of possibleMethods) {
    const methodLabel = normalizePaymentMethodLabel(getTextValue(possibleMethod));

    if (methodLabel) {
      return methodLabel;
    }
  }

  return "";
}

function getChamadoContratoId(chamado: any) {
  return getTextValue(
    chamado?.contratoId,
    chamado?.idContrato,
    chamado?.id_contrato,
    chamado?.contrato_id,
    chamado?.contrato?.id,
    chamado?.contrato?.idContrato,
    chamado?.contrato?.contratoId
  );
}

function getChamadoCandidaturaId(chamado: any) {
  return getTextValue(
    chamado?.candidaturaId,
    chamado?.idCandidatura,
    chamado?.id_candidatura,
    chamado?.candidatura_id,
    chamado?.solicitacaoId,
    chamado?.idSolicitacao,
    chamado?.contrato?.candidaturaId,
    chamado?.contrato?.idCandidatura
  );
}

async function getStoredPaymentMethod(ids: {
  jobId?: string;
  contratoId?: string;
  candidaturaId?: string;
}) {
  const rawIds = [ids.contratoId, ids.jobId, ids.candidaturaId].filter(
    (value): value is string => Boolean(value && String(value).trim())
  );

  const keys = rawIds.flatMap((id) =>
    PAYMENT_METHOD_STORAGE_PREFIXES.map((prefix) => `${prefix}${id}`)
  );

  for (const key of keys) {
    try {
      const storedValue = await AsyncStorage.getItem(key);
      const methodLabel = normalizePaymentMethodLabel(storedValue ?? "");

      if (methodLabel) {
        return methodLabel;
      }
    } catch (error) {
      console.log("Erro ao ler forma de pagamento local:", key, error);
    }
  }

  return "";
}

async function getPaymentMethod(chamado: any, status: PaymentStatus, ids: {
  jobId?: string;
  contratoId?: string;
  candidaturaId?: string;
}) {
  const methodFromApi = getPaymentMethodFromApi(chamado);

  if (methodFromApi) {
    return methodFromApi;
  }

  const methodFromStorage = await getStoredPaymentMethod(ids);

  if (methodFromStorage) {
    return methodFromStorage;
  }

  // Fallback rápido para registros antigos que foram pagos antes dessa correção.
  return status === "paid" ? "Cartão de crédito" : "Aguardando pagamento";
}

function normalizeStatus(status?: string) {
  return String(status ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isPaidStatus(status?: string) {
  const normalized = normalizeStatus(status);

  return (
    normalized === "finalizado" ||
    normalized === "finalizada" ||
    normalized === "concluido" ||
    normalized === "concluida" ||
    normalized === "finished" ||
    normalized === "paid" ||
    normalized === "pago" ||
    normalized === "paga"
  );
}

function isPendingStatus(status?: string) {
  const normalized = normalizeStatus(status);

  return (
    normalized === "aberto" ||
    normalized === "aberta" ||
    normalized === "publicado" ||
    normalized === "publicada" ||
    normalized === "pendente" ||
    normalized === "pending" ||
    normalized === "em andamento" ||
    normalized === "em_andamento" ||
    normalized === "andamento" ||
    normalized === "aceito" ||
    normalized === "aceita" ||
    normalized === "aguardando pagamento" ||
    normalized === "aguardando_pagamento"
  );
}

function isIgnoredStatus(status?: string) {
  const normalized = normalizeStatus(status);

  return (
    normalized === "cancelado" ||
    normalized === "cancelada" ||
    normalized === "canceled" ||
    normalized === "cancelled" ||
    normalized === "estornado" ||
    normalized === "estornada" ||
    normalized === "refunded"
  );
}

function getPaymentStatus(status?: string): PaymentStatus | null {
  if (isIgnoredStatus(status)) {
    return null;
  }

  if (isPaidStatus(status)) {
    return "paid";
  }

  if (isPendingStatus(status)) {
    return "pending";
  }

  return "pending";
}

function getChamadosFromResponse(response: any): any[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.chamados)) {
    return response.chamados;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
}

function getChamadoEmpresaId(chamado: any) {
  return (
    chamado?.empresaId ??
    chamado?.idEmpresa ??
    chamado?.id_empresa ??
    chamado?.empresa_id ??
    chamado?.empresa?.id ??
    chamado?.empresa?.idEmpresa ??
    chamado?.empresa?.empresaId ??
    null
  );
}

async function normalizeChamadoToPayment(chamado: any): Promise<PaymentItem | null> {
  const status = getPaymentStatus(chamado?.status);

  if (!status) {
    return null;
  }

  const id =
    chamado?.id ??
    chamado?.idChamado ??
    chamado?.chamadoId ??
    chamado?.id_chamado ??
    `${Date.now()}-${Math.random()}`;

  const contratoId = getChamadoContratoId(chamado);
  const candidaturaId = getChamadoCandidaturaId(chamado);

  const service =
    chamado?.titulo ??
    chamado?.title ??
    chamado?.nome ??
    chamado?.servico ??
    "Serviço TaskFlow";

  const freelancer =
    chamado?.freelancerNome ??
    chamado?.nomeFreelancer ??
    chamado?.freelancer?.nome ??
    chamado?.candidato?.nome ??
    "Freelancer contratado";

  const date =
    chamado?.dataServico ??
    chamado?.data_servico ??
    chamado?.data ??
    chamado?.criadoEm ??
    chamado?.criado_em;

  const valorServico = parseMoneyValue(
    chamado?.valorEstimado ??
      chamado?.valor_estimado ??
      chamado?.valor ??
      chamado?.preco ??
      0
  );

  const taxaPlataforma = valorServico * 0.1;
  const total = valorServico + taxaPlataforma;

  const category = getTextValue(
    chamado?.categoriaNome,
    chamado?.nomeCategoria,
    chamado?.categoria?.nome,
    chamado?.categoria,
    chamado?.category,
    chamado?.jobCategory
  );

  const location = getTextValue(
    chamado?.enderecoCompleto,
    chamado?.endereco,
    chamado?.localizacao,
    chamado?.local,
    chamado?.cidade,
    chamado?.location
  );

  const rawDate = date ? String(date) : "";

  return {
    id: String(id),
    jobId: String(id),
    contratoId,
    candidaturaId,
    service: String(service),
    freelancer: String(freelancer),
    date: formatPaymentDate(rawDate),
    method: await getPaymentMethod(chamado, status, {
      jobId: String(id),
      contratoId,
      candidaturaId,
    }),
    serviceValue: formatApiCurrency(valorServico),
    platformFee: formatApiCurrency(taxaPlataforma),
    total: formatApiCurrency(total),
    status,
    category: category || "Categoria não informada",
    location: location || "Local não informado",
    rawDate,
  };
}

export default function CompanyPaymentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<PaymentFilter>("all");
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { isDark, theme } = useTheme();

  const detailsBoxBackground = isDark
    ? "rgba(255,255,255,0.04)"
    : "#F8FAFC";

  const detailsBorderColor = isDark
    ? "rgba(255,255,255,0.10)"
    : theme.border;

  const detailsValueColor = isDark ? "#FFFFFF" : theme.text;

  const totalBoxBackground = isDark
    ? "rgba(11,87,208,0.14)"
    : "rgba(11,87,208,0.08)";

  const totalLabelColor = isDark
    ? "rgba(255,255,255,0.72)"
    : theme.textSecondary;

  useFocusEffect(
    useCallback(() => {
      loadPayments();

      const interval = setInterval(() => {
        loadPayments(false);
      }, 5000);

      return () => clearInterval(interval);
    }, [])
  );

  async function loadPayments(showLoading = true) {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      const tipoUsuario = String(loggedUser?.tipoUsuario ?? "").toLowerCase();

      if (tipoUsuario !== "empresa") {
        router.replace("/home");
        return;
      }

      const companyId = getLoggedCompanyId(loggedUser);

      if (!companyId) {
        console.log("Empresa sem ID no usuário logado:", loggedUser);
        setPayments([]);
        return;
      }

      const response = await apiGet("/api/Chamados");

      console.log("Resposta /api/Chamados:", response);
      console.log("ID da empresa logada:", companyId);

      const apiChamados = getChamadosFromResponse(response);

      const chamadosDaEmpresa = apiChamados.filter((chamado: any) => {
        const chamadoEmpresaId = getChamadoEmpresaId(chamado);

        return Number(chamadoEmpresaId) === Number(companyId);
      });

      const normalizedPayments = await Promise.all(
        chamadosDaEmpresa.map(normalizeChamadoToPayment)
      );

      const formattedPayments = normalizedPayments.filter(
        (payment): payment is PaymentItem => payment !== null
      );

      console.log("Pagamentos montados:", formattedPayments);

      setPayments(formattedPayments);
    } catch (error) {
      console.log("Erro ao carregar pagamentos da empresa:", error);
      setPayments([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadPayments(false);
  }

  function handlePaymentPress(payment: PaymentItem) {
    if (payment.status === "paid") {
      Alert.alert(
        "Pagamento concluído",
        "Esse chamado já foi finalizado e o pagamento já está registrado."
      );
      return;
    }

    router.push({
      pathname: "/job-candidates",
      params: {
        id: payment.jobId,
        title: payment.service,
        category: payment.category,
        price: payment.serviceValue,
        location: payment.location,
        time: payment.rawDate || payment.date,
      },
    });
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
      if (payment.status !== "paid") {
        return total;
      }

      return total + parseMoneyValue(payment.total);
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
        {
          backgroundColor: theme.background,
        },
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
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
              Serviços finalizados e taxas registrados na plataforma.
            </Text>
          </View>

          <View
            style={[
              styles.summaryIconBox,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(15,23,42,0.08)",
              },
            ]}
          >
            <CreditCardIcon
              width={34}
              height={34}
              color={isDark ? "#FFFFFF" : colors.black}
            />
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
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Histórico de pagamentos
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Acompanhe taxas, pagamentos pendentes e serviços finalizados.
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
                Buscando chamados da empresa.
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
                Quando houver chamados pendentes ou finalizados dessa empresa,
                eles aparecerão aqui.
              </Text>
            </View>
          ) : (
            filteredPayments.map((payment) => {
              const currentStatus = statusConfig[payment.status];

              return (
                <Pressable
                  key={payment.id}
                  onPress={() => handlePaymentPress(payment)}
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
                          {
                            color: theme.text,
                          },
                        ]}
                      >
                        {payment.service}
                      </Text>

                      <Text
                        style={[
                          styles.paymentFreelancer,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        Freelancer: {payment.freelancer}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: currentStatus.backgroundColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: currentStatus.textColor,
                          },
                        ]}
                      >
                        {currentStatus.label}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.infoArea,
                      {
                        backgroundColor: detailsBoxBackground,
                        borderColor: detailsBorderColor,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <View style={styles.infoRow}>
                      <Text
                        style={[
                          styles.infoLabel,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        Data
                      </Text>

                      <Text
                        style={[
                          styles.infoValue,
                          {
                            color: detailsValueColor,
                          },
                        ]}
                      >
                        {payment.date}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.divider,
                        {
                          backgroundColor: detailsBorderColor,
                        },
                      ]}
                    />

                    <View style={styles.infoRow}>
                      <Text
                        style={[
                          styles.infoLabel,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        Forma
                      </Text>

                      <Text
                        style={[
                          styles.infoValue,
                          {
                            color: detailsValueColor,
                          },
                        ]}
                      >
                        {payment.method}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.divider,
                        {
                          backgroundColor: detailsBorderColor,
                        },
                      ]}
                    />

                    <View style={styles.infoRow}>
                      <Text
                        style={[
                          styles.infoLabel,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        Valor do serviço
                      </Text>

                      <Text
                        style={[
                          styles.infoValue,
                          {
                            color: detailsValueColor,
                          },
                        ]}
                      >
                        {payment.serviceValue}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.divider,
                        {
                          backgroundColor: detailsBorderColor,
                        },
                      ]}
                    />

                    <View style={styles.infoRow}>
                      <Text
                        style={[
                          styles.infoLabel,
                          {
                            color: theme.textSecondary,
                          },
                        ]}
                      >
                        Taxa TaskFlow
                      </Text>

                      <Text
                        style={[
                          styles.infoValue,
                          {
                            color: detailsValueColor,
                          },
                        ]}
                      >
                        {payment.platformFee}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.totalArea,
                      {
                        backgroundColor: totalBoxBackground,
                        borderColor: detailsBorderColor,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.totalLabel,
                        {
                          color: totalLabelColor,
                        },
                      ]}
                    >
                      Total
                    </Text>

                    <Text
                      style={[
                        styles.totalValue,
                        {
                          color:
                            payment.status === "paid"
                              ? colors.primary
                              : colors.warning,
                        },
                      ]}
                    >
                      {payment.total}
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
            Controle financeiro
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Essa tela usa os chamados da empresa para exibir pagamentos
            pendentes e finalizados no MVP.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
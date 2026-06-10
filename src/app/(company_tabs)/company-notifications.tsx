import type { ComponentType } from "react";
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

import NotificationIcon from "../../../assets/icons/notifications.svg";
import SupportIcon from "../../../assets/icons/support_agent.svg";
import CreditCardIcon from "../../../assets/icons/credit_card.svg";
import ChatIcon from "../../../assets/icons/chat.svg";
import CheckIcon from "../../../assets/icons/check.svg";

import { styles } from "@/app/styles/companyNotifications";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type NotificationType = "candidate" | "payment" | "message" | "service";
type NotificationFilter = "all" | "unread" | NotificationType;

type CompanyNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
  jobId?: string;
  chatId?: string;
  candidateId?: string;
};

type NotificationTypeConfig = {
  label: string;
  Icon: ComponentType<any>;
  color: string;
  backgroundColor: string;
};

const typeConfig: Record<NotificationType, NotificationTypeConfig> = {
  candidate: {
    label: "Candidato",
    Icon: SupportIcon,
    color: colors.primary,
    backgroundColor: "rgba(11,87,208,0.1)",
  },
  payment: {
    label: "Pagamento",
    Icon: CreditCardIcon,
    color: colors.success,
    backgroundColor: "rgba(0,176,80,0.12)",
  },
  message: {
    label: "Mensagem",
    Icon: ChatIcon,
    color: colors.warning,
    backgroundColor: "rgba(245,158,11,0.14)",
  },
  service: {
    label: "Serviço",
    Icon: CheckIcon,
    color: colors.primaryDark,
    backgroundColor: "rgba(22,62,159,0.1)",
  },
};

export default function CompanyNotificationsScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter>("all");

  const [notifications, setNotifications] = useState<CompanyNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a API.

        Exemplo:
        const response = await companyNotificationsService.getMyNotifications();
        setNotifications(response);

        A API deve retornar somente as notificações da empresa logada,
        usando o token salvo depois do login.

        Formato esperado:
        [
          {
            id: "1",
            type: "candidate",
            title: "Novo candidato no chamado",
            description: "Um freelancer se candidatou ao chamado.",
            time: "Agora",
            isRead: false,
            jobId: "10",
            candidateId: "5"
          }
        ]

        Tipos aceitos:
        candidate -> leva para candidatos do chamado
        payment   -> leva para pagamentos
        message   -> leva para chat
        service   -> leva para conclusão/andamento do serviço
      */

      setNotifications([]);
    } catch (error) {
      console.log("Erro ao carregar notificações da empresa:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "all") {
      return notifications;
    }

    if (selectedFilter === "unread") {
      return notifications.filter((notification) => !notification.isRead);
    }

    return notifications.filter(
      (notification) => notification.type === selectedFilter
    );
  }, [selectedFilter, notifications]);

  function markAsRead(notificationId: string) {
    /*
      Futuramente:
      await companyNotificationsService.markAsRead(notificationId);
    */

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            isRead: true,
          };
        }

        return notification;
      })
    );
  }

  function markAllAsRead() {
    /*
      Futuramente:
      await companyNotificationsService.markAllAsRead();
    */

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  }

  function handleOpenNotification(notification: CompanyNotification) {
    markAsRead(notification.id);

    if (notification.type === "candidate") {
      router.push({
        pathname: "/job-candidates",
        params: {
          jobId: notification.jobId ?? "",
          candidateId: notification.candidateId ?? "",
        },
      });

      return;
    }

    if (notification.type === "payment") {
      router.push("/company-payments");
      return;
    }

    if (notification.type === "message") {
      router.push({
        pathname: "/chat",
        params: {
          chatId: notification.chatId ?? "",
          jobId: notification.jobId ?? "",
          userType: "company",
        },
      });

      return;
    }

    if (notification.type === "service") {
      router.push({
        pathname: "/service-completion",
        params: {
          jobId: notification.jobId ?? "",
        },
      });
    }
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Notificações
        </Text>

        <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Ler todas</Text>
        </Pressable>
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
              Central da empresa
            </Text>

            <Text style={[styles.summaryTitle, { color: theme.text }]}>
              {unreadCount > 0
                ? `${unreadCount} novas notificações`
                : "Tudo em dia"}
            </Text>

            <Text style={[styles.summaryText, { color: theme.textSecondary }]}>
              Acompanhe candidaturas, pagamentos, mensagens e andamento dos
              serviços.
            </Text>
          </View>

          <View style={styles.summaryIconBox}>
            <NotificationIcon width={34} height={34} />
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
              Todas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "unread" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("unread")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "unread" && styles.filterTextActive,
              ]}
            >
              Não lidas
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "candidate" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("candidate")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "candidate" && styles.filterTextActive,
              ]}
            >
              Candidatos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              selectedFilter === "payment" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("payment")}
          >
            <Text
              style={[
                styles.filterText,
                { color: theme.textSecondary },
                selectedFilter === "payment" && styles.filterTextActive,
              ]}
            >
              Pagamentos
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Atividades recentes
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Toque em uma notificação para acompanhar a atividade.
          </Text>
        </View>

        <View style={styles.notificationsList}>
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
                Carregando notificações...
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Buscando as atividades recentes da empresa.
              </Text>
            </View>
          ) : filteredNotifications.length === 0 ? (
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
                Nenhuma notificação encontrada
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Quando houver candidaturas, pagamentos ou mensagens, elas
                aparecerão aqui.
              </Text>
            </View>
          ) : (
            filteredNotifications.map((notification) => {
              const currentType = typeConfig[notification.type];
              const Icon = currentType.Icon;

              return (
                <Pressable
                  key={notification.id}
                  style={({ pressed }) => [
                    styles.notificationCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    !notification.isRead && styles.notificationCardUnread,
                    pressed && styles.notificationCardPressed,
                  ]}
                  onPress={() => handleOpenNotification(notification)}
                >
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: currentType.backgroundColor },
                    ]}
                  >
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTop}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          { color: theme.text },
                        ]}
                      >
                        {notification.title}
                      </Text>

                      {!notification.isRead && (
                        <View style={styles.unreadDot} />
                      )}
                    </View>

                    <Text
                      style={[
                        styles.notificationDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {notification.description}
                    </Text>

                    <View style={styles.notificationFooter}>
                      <View
                        style={[
                          styles.typeBadge,
                          { backgroundColor: currentType.backgroundColor },
                        ]}
                      >
                        <Text
                          style={[
                            styles.typeBadgeText,
                            { color: currentType.color },
                          ]}
                        >
                          {currentType.label}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.timeText,
                          { color: theme.textSecondary },
                        ]}
                      >
                        {notification.time}
                      </Text>
                    </View>
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
            Push notifications
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            As notificações ajudam a empresa a acompanhar novas candidaturas,
            pagamentos confirmados e mensagens importantes.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
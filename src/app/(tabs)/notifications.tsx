import { useCallback, useMemo, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect } from "expo-router";

import { styles } from "@/app/styles/notifications";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { getLoggedUser } from "@/services/storage";
import {
  formatTaskFlowNotificationTime,
  getTaskFlowNotifications,
  markAllTaskFlowNotificationsAsRead,
  markTaskFlowNotificationAsRead,
  type TaskFlowNotification,
  type TaskFlowNotificationType,
} from "@/services/local-notifications";

import LocationIcon from "../../../assets/icons/Location-check.svg";
import AssignmentIcon from "../../../assets/icons/assignment.svg";
import CheckIcon from "../../../assets/icons/check.svg";
import ChatIcon from "../../../assets/icons/chat.svg";
import CreditCardIcon from "../../../assets/icons/credit_card.svg";
import StarIcon from "../../../assets/icons/star_border.svg";
import BellIcon from "../../../assets/icons/notifications.svg";

type NotificationFilter = "all" | "unread" | "jobs";

type NotificationDetailType = TaskFlowNotificationType;

type NotificationItem = {
  id: string;
  type: NotificationDetailType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  jobTitle?: string;
  companyName?: string;
  jobId?: string;
  chamadoId?: string;
  chatId?: string;
  contractId?: string;
  contratoId?: string;
  candidateId?: string;
  candidaturaId?: string;
  freelancerId?: string;
  companyId?: string;
  params?: Record<string, string>;
};

function getLoggedUserId(loggedUser: any) {
  const possibleId =
    loggedUser?.id ??
    loggedUser?.usuarioId ??
    loggedUser?.idUsuario ??
    loggedUser?.userId ??
    loggedUser?.usuario_id;

  if (possibleId === null || possibleId === undefined || possibleId === "") {
    return "";
  }

  return String(possibleId);
}

function mapToNotificationItem(notification: TaskFlowNotification): NotificationItem {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    time: formatTaskFlowNotificationTime(notification.createdAt),
    unread: !notification.read,
    jobTitle: notification.jobTitle,
    companyName: notification.companyName,
    jobId: notification.jobId,
    chamadoId: notification.chamadoId,
    chatId: notification.chatId,
    contractId: notification.contractId,
    contratoId: notification.contratoId,
    candidateId: notification.candidateId,
    candidaturaId: notification.candidaturaId,
    freelancerId: notification.freelancerId,
    companyId: notification.companyId,
    params: notification.params,
  };
}

export default function NotificationsScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter>("all");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedUserId, setLoggedUserId] = useState("");

  const { isDark, theme } = useTheme();
  const emptyBellColor = isDark ? colors.white : colors.black;

  useFocusEffect(
    useCallback(() => {
      loadNotifications();

      const interval = setInterval(() => {
        loadNotifications(false);
      }, 1500);

      return () => clearInterval(interval);
    }, [])
  );

  async function loadNotifications(showLoading = true) {
    try {
      if (showLoading) {
        setIsLoading(true);
      }

      const loggedUser = await getLoggedUser();
      const userId = getLoggedUserId(loggedUser);

      setLoggedUserId(userId);

      const response = await getTaskFlowNotifications({
        audience: "freelancer",
        userId,
      });

      setNotifications(response.map(mapToNotificationItem));
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
      setNotifications([]);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  }

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "unread") {
      return notifications.filter((notification) => notification.unread);
    }

    if (selectedFilter === "jobs") {
      return notifications.filter(
        (notification) =>
          notification.type === "new_job" || notification.type === "service"
      );
    }

    return notifications;
  }, [selectedFilter, notifications]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  function renderNotificationIcon(type: NotificationDetailType) {
    if (type === "new_job") {
      return <LocationIcon width={24} height={24} color={colors.location} />;
    }

    if (type === "request_accepted" || type === "service") {
      return <CheckIcon width={24} height={24} />;
    }

    if (type === "payment") {
      return <CreditCardIcon width={24} height={24} />;
    }

    if (type === "chat_released" || type === "message") {
      return <ChatIcon width={24} height={24} />;
    }

    if (type === "review_received") {
      return <StarIcon width={24} height={24} />;
    }

    return <AssignmentIcon width={24} height={24} />;
  }

  async function handleNotificationPress(notification: NotificationItem) {
    try {
      await markTaskFlowNotificationAsRead(notification.id);

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id ? { ...item, unread: false } : item
        )
      );

      const jobId = notification.jobId ?? notification.chamadoId ?? "";
      const contractId = notification.contractId ?? notification.contratoId ?? "";

      if (notification.type === "new_job" && jobId) {
        router.push({
          pathname: "/job-details",
          params: {
            id: jobId,
            jobId,
            title: notification.jobTitle ?? "",
            companyName: notification.companyName ?? "",
            ...(notification.params ?? {}),
          },
        });

        return;
      }

      if (
        notification.type === "chat_released" ||
        notification.type === "message"
      ) {
        router.push({
          pathname: "/chat",
          params: {
            chatId: notification.chatId ?? "",
            jobId,
            contratoId: contractId,
            contractId,
            userType: "freelancer",
            ...(notification.params ?? {}),
          },
        });

        return;
      }

      if (
        notification.type === "request_accepted" ||
        notification.type === "request_rejected" ||
        notification.type === "payment" ||
        notification.type === "service"
      ) {
        router.push("/requests");
        return;
      }

      router.push({
        pathname: "/notification-details",
        params: {
          type: notification.type,
          title: notification.title,
          message: notification.description,
          time: notification.time,
          jobTitle: notification.jobTitle ?? "",
          companyName: notification.companyName ?? "",
          userType: "freelancer",
        },
      });
    } catch (error) {
      console.log("Erro ao abrir notificação:", error);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllTaskFlowNotificationsAsRead({
        audience: "freelancer",
        userId: loggedUserId,
      });

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          unread: false,
        }))
      );
    } catch (error) {
      console.log("Erro ao marcar notificações como lidas:", error);
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
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Notificações</Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}> 
            {unreadCount > 0
              ? `${unreadCount} notificações não lidas`
              : "Tudo em dia por aqui"}
          </Text>
        </View>

        {notifications.length > 0 && (
          <Pressable style={styles.readButton} onPress={handleMarkAllAsRead}>
            <Text style={styles.readButtonText}>Marcar tudo como lido</Text>
          </Pressable>
        )}
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
            selectedFilter === "jobs" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("jobs")}
        >
          <Text
            style={[
              styles.filterText,
              { color: theme.textSecondary },
              selectedFilter === "jobs" && styles.filterTextActive,
            ]}
          >
            Chamados
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.notificationsList}
      >
        {isLoading ? (
          <View
            style={[
              styles.emptyArea,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <BellIcon
              width={34}
              height={34}
              color={emptyBellColor}
              fill={emptyBellColor}
              stroke={emptyBellColor}
            />

            <Text style={[styles.emptyTitle, { color: theme.text }]}> 
              Carregando notificações...
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}> 
              Buscando novidades do aplicativo.
            </Text>
          </View>
        ) : filteredNotifications.length === 0 ? (
          <View
            style={[
              styles.emptyArea,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <BellIcon
              width={34}
              height={34}
              color={emptyBellColor}
              fill={emptyBellColor}
              stroke={emptyBellColor}
            />

            <Text style={[styles.emptyTitle, { color: theme.text }]}> 
              Nenhuma notificação
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}> 
              Quando surgirem chamados, mensagens ou atualizações, elas aparecerão aqui.
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <Pressable
              key={notification.id}
              style={({ pressed }) => [
                styles.notificationCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
                notification.unread && styles.notificationCardUnread,
                notification.unread && {
                  backgroundColor: isDark
                    ? "rgba(11,87,208,0.18)"
                    : "rgba(239,246,255,1)",
                  borderColor: isDark ? colors.primary : "rgba(11,87,208,0.35)",
                },
                pressed && styles.notificationCardPressed,
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.iconBox}>
                {renderNotificationIcon(notification.type)}
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

                  <Text
                    style={[
                      styles.notificationTime,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {notification.time}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.notificationDescription,
                    { color: theme.textSecondary },
                  ]}
                >
                  {notification.description}
                </Text>
              </View>

              {notification.unread && <View style={styles.unreadDot} />}
            </Pressable>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

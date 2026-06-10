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

import { styles } from "@/app/styles/notifications";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

import LocationIcon from "../../../assets/icons/Location-check.svg";
import AssignmentIcon from "../../../assets/icons/assignment.svg";
import CheckIcon from "../../../assets/icons/check.svg";
import ChatIcon from "../../../assets/icons/chat.svg";
import CreditCardIcon from "../../../assets/icons/credit_card.svg";
import StarIcon from "../../../assets/icons/star_border.svg";
import BellIcon from "../../../assets/icons/notifications.svg";

type NotificationFilter = "all" | "unread" | "jobs";

type NotificationDetailType =
  | "new_job"
  | "request_accepted"
  | "payment_confirmed"
  | "chat_released"
  | "review_received"
  | "message"
  | "default";

type NotificationItem = {
  id: string;
  type: NotificationDetailType;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  jobTitle?: string;
  companyName?: string;
};

export default function NotificationsScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter>("all");

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      setIsLoading(true);

      /*
        Aqui futuramente entra a API.

        Exemplo:
        const response = await notificationsService.getFreelancerNotifications();
        setNotifications(response);

        Por enquanto deixamos vazio para remover os dados forjados.
      */

      setNotifications([]);
    } catch (error) {
      console.log("Erro ao buscar notificações:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === "unread") {
      return notifications.filter((notification) => notification.unread);
    }

    if (selectedFilter === "jobs") {
      return notifications.filter(
        (notification) => notification.type === "new_job"
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

    if (type === "request_accepted") {
      return <CheckIcon width={24} height={24} />;
    }

    if (type === "payment_confirmed") {
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
      /*
        Aqui futuramente entra a API para marcar uma notificação como lida.

        Exemplo:
        await notificationsService.markAsRead(notification.id);
      */

      setNotifications((currentNotifications) =>
        currentNotifications.map((item) =>
          item.id === notification.id ? { ...item, unread: false } : item
        )
      );

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
      /*
        Aqui futuramente entra a API para marcar todas como lidas.

        Exemplo:
        await notificationsService.markAllAsRead();
      */

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
          <Text style={[styles.title, { color: theme.text }]}>
            Notificações
          </Text>

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
            <BellIcon width={38} height={38} />

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Carregando notificações...
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Buscando novidades na API.
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
            <BellIcon width={38} height={38} />

            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              Nenhuma notificação
            </Text>

            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Quando a API retornar notificações, elas aparecerão aqui.
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
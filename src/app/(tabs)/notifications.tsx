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

import { styles } from "@/app/styles/notifications";
import { colors } from "@/styles/colors";

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
  jobTitle: string;
  companyName: string;
};

const notificationsData: NotificationItem[] = [
  {
    id: "1",
    type: "new_job",
    title: "Novo chamado próximo",
    description:
      "Garçom para Evento foi publicado a 1,5 km de você. Confira os detalhes.",
    time: "Agora",
    unread: true,
    jobTitle: "Garçom para Evento",
    companyName: "TaskFlow Eventos",
  },
  {
    id: "2",
    type: "default",
    title: "Solicitação enviada",
    description:
      "Sua candidatura para Fotógrafo Profissional foi enviada para análise.",
    time: "10 min",
    unread: true,
    jobTitle: "Fotógrafo Profissional",
    companyName: "TaskFlow Eventos",
  },
  {
    id: "3",
    type: "request_accepted",
    title: "Solicitação aceita",
    description:
      "A empresa aceitou sua solicitação. Aguarde a confirmação do fluxo.",
    time: "35 min",
    unread: false,
    jobTitle: "Garçom para Evento",
    companyName: "TaskFlow Eventos",
  },
  {
    id: "4",
    type: "chat_released",
    title: "Chat liberado",
    description:
      "O chat com TaskFlow Eventos já está disponível para combinar os detalhes.",
    time: "1 h",
    unread: false,
    jobTitle: "Garçom para Evento",
    companyName: "TaskFlow Eventos",
  },
  {
    id: "5",
    type: "payment_confirmed",
    title: "Taxa confirmada",
    description:
      "O pagamento da taxa foi confirmado e o serviço está em andamento.",
    time: "2 h",
    unread: false,
    jobTitle: "Garçom para Evento",
    companyName: "TaskFlow Eventos",
  },
  {
    id: "6",
    type: "review_received",
    title: "Avaliação disponível",
    description:
      "O serviço foi concluído. Avalie sua experiência com a empresa.",
    time: "Ontem",
    unread: false,
    jobTitle: "Garçom para Evento",
    companyName: "TaskFlow Eventos",
  },
];

export default function NotificationsScreen() {
  const [selectedFilter, setSelectedFilter] =
    useState<NotificationFilter>("all");

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(notificationsData);

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
      return <LocationIcon width={24} height={24} color={colors.location}/>;
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

  function handleNotificationPress(notification: NotificationItem) {
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
        jobTitle: notification.jobTitle,
        companyName: notification.companyName,
        userType: "freelancer",
      },
    });
  }

  function handleMarkAllAsRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Notificações</Text>
          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} notificações não lidas`
              : "Tudo em dia por aqui"}
          </Text>
        </View>

        <Pressable style={styles.readButton} onPress={handleMarkAllAsRead}>
          <Text style={styles.readButtonText}>Marcar tudo como lido</Text>
        </Pressable>
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
            Todas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === "unread" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("unread")}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === "unread" && styles.filterTextActive,
            ]}
          >
            Não lidas
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.filterChip,
            selectedFilter === "jobs" && styles.filterChipActive,
          ]}
          onPress={() => setSelectedFilter("jobs")}
        >
          <Text
            style={[
              styles.filterText,
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
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyArea}>
            <BellIcon width={38} height={38} />

            <Text style={styles.emptyTitle}>Nenhuma notificação</Text>

            <Text style={styles.emptyText}>
              Quando houver novidades, elas aparecerão aqui.
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <Pressable
              key={notification.id}
              style={({ pressed }) => [
                styles.notificationCard,
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
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>

                  <Text style={styles.notificationTime}>
                    {notification.time}
                  </Text>
                </View>

                <Text style={styles.notificationDescription}>
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
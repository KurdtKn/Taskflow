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

type NotificationFilter = "all" | "unread" | "jobs";

type NotificationItem = {
  id: string;
  type: "new_job" | "status" | "chat" | "payment" | "rating";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  icon: string;
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
    icon: "📍",
  },
  {
    id: "2",
    type: "status",
    title: "Solicitação enviada",
    description:
      "Sua candidatura para Fotógrafo Profissional foi enviada para análise.",
    time: "10 min",
    unread: true,
    icon: "✅",
  },
  {
    id: "3",
    type: "status",
    title: "Solicitação aceita",
    description:
      "A empresa aceitou sua solicitação. Aguarde a confirmação do fluxo.",
    time: "35 min",
    unread: false,
    icon: "🎉",
  },
  {
    id: "4",
    type: "chat",
    title: "Chat liberado",
    description:
      "O chat com TaskFlow Eventos já está disponível para combinar os detalhes.",
    time: "1 h",
    unread: false,
    icon: "💬",
  },
  {
    id: "5",
    type: "payment",
    title: "Taxa confirmada",
    description:
      "O pagamento da taxa foi confirmado e o serviço está em andamento.",
    time: "2 h",
    unread: false,
    icon: "💳",
  },
  {
    id: "6",
    type: "rating",
    title: "Avaliação disponível",
    description:
      "O serviço foi concluído. Avalie sua experiência com a empresa.",
    time: "Ontem",
    unread: false,
    icon: "⭐",
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

  function handleNotificationPress(notification: NotificationItem) {
    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === notification.id ? { ...item, unread: false } : item
      )
    );

    if (notification.type === "new_job") {
      router.push({
        pathname: "/job-details",
        params: {
          title: "Garçom para Evento",
          category: "Evento",
          price: "R$200,00",
          distance: "1,5 km",
          location: "Centro",
          time: "Hoje, 18:00",
        },
      });
    }
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
          <Text style={styles.readButtonText}>Ler tudo</Text>
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
            <Text style={styles.emptyIcon}>🔕</Text>
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
                <Text style={styles.notificationIcon}>
                  {notification.icon}
                </Text>
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
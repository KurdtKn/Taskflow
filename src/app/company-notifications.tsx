import type { ComponentType } from "react";
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
import NotificationIcon from "../../assets/icons/notifications.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import ChatIcon from "../../assets/icons/chat.svg";
import CheckIcon from "../../assets/icons/check.svg";

import { styles } from "@/app/styles/companyNotifications";
import { colors } from "@/styles/colors";

type NotificationType = "candidate" | "payment" | "message" | "service";
type NotificationFilter = "all" | "unread" | NotificationType;

type CompanyNotification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  isRead: boolean;
};

type NotificationTypeConfig = {
  label: string;
  Icon: ComponentType<any>;
  color: string;
  backgroundColor: string;
};

const notificationsData: CompanyNotification[] = [
  {
    id: "1",
    type: "candidate",
    title: "Novo candidato no chamado",
    description:
      "Um freelancer se candidatou para o chamado Garçom para Evento.",
    time: "Agora",
    isRead: false,
  },
  {
    id: "2",
    type: "payment",
    title: "Pagamento confirmado",
    description:
      "A taxa da plataforma foi confirmada e o chat já está liberado.",
    time: "15 min",
    isRead: false,
  },
  {
    id: "3",
    type: "message",
    title: "Nova mensagem recebida",
    description:
      "O freelancer enviou uma mensagem sobre os detalhes do serviço.",
    time: "32 min",
    isRead: true,
  },
  {
    id: "4",
    type: "service",
    title: "Serviço aguardando conclusão",
    description:
      "Confirme a finalização do chamado após a realização do serviço.",
    time: "1 h",
    isRead: true,
  },
  {
    id: "5",
    type: "candidate",
    title: "Candidatura atualizada",
    description:
      "Um candidato atualizou as informações do perfil profissional.",
    time: "Ontem",
    isRead: true,
  },
];

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

  const [notifications, setNotifications] =
    useState<CompanyNotification[]>(notificationsData);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

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

  function handleOpenNotification(notification: CompanyNotification) {
    markAsRead(notification.id);

    if (notification.type === "candidate") {
      router.push("/job-candidates");
      return;
    }

    if (notification.type === "payment") {
      router.push("/company-payments");
      return;
    }

    if (notification.type === "message") {
      router.push("/chat");
      return;
    }

    if (notification.type === "service") {
      router.push("/service-completion");
    }
  }

  function markAllAsRead() {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Notificações</Text>

        <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
          <Text style={styles.markAllText}>Ler todas</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Central da empresa</Text>
            <Text style={styles.summaryTitle}>
              {unreadCount > 0
                ? `${unreadCount} novas notificações`
                : "Tudo em dia"}
            </Text>
            <Text style={styles.summaryText}>
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
              selectedFilter === "candidate" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("candidate")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "candidate" && styles.filterTextActive,
              ]}
            >
              Candidatos
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.filterChip,
              selectedFilter === "payment" && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter("payment")}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === "payment" && styles.filterTextActive,
              ]}
            >
              Pagamentos
            </Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atividades recentes</Text>
          <Text style={styles.sectionSubtitle}>
            Toque em uma notificação para acompanhar a atividade.
          </Text>
        </View>

        <View style={styles.notificationsList}>
          {filteredNotifications.map((notification) => {
            const currentType = typeConfig[notification.type];
            const Icon = currentType.Icon;

            return (
              <Pressable
                key={notification.id}
                style={({ pressed }) => [
                  styles.notificationCard,
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
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>

                    {!notification.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.notificationDescription}>
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

                    <Text style={styles.timeText}>{notification.time}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Push notifications</Text>

          <Text style={styles.infoText}>
            No app real, essa tela será integrada com notificações no celular,
            avisando a empresa sobre candidatos, pagamentos e mensagens.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
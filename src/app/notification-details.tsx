import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import BellIcon from "../../assets/icons/notifications.svg";
import ChatIcon from "../../assets/icons/chat.svg";
import CheckIcon from "../../assets/icons/check.svg";
import StarIcon from "../../assets/icons/star_border.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/notificationDetail";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type NotificationType =
  | "new_job"
  | "request_accepted"
  | "payment_confirmed"
  | "chat_released"
  | "review_received"
  | "message"
  | "default";

export default function NotificationDetailsScreen() {
  const params = useLocalSearchParams<{
    type?: NotificationType;
    title?: string;
    message?: string;
    time?: string;
    jobTitle?: string;
    companyName?: string;
    userType?: "freelancer" | "empresa";
  }>();

  const { isDark, theme } = useTheme();

  const type = params.type ?? "default";
  const title = params.title ?? "Notificação";
  const message =
    params.message ??
    "Você recebeu uma nova atualização relacionada ao seu perfil no TaskFlow.";
  const time = params.time ?? "Agora";
  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const companyName = params.companyName ?? "TaskFlow Eventos";
  const userType = params.userType ?? "freelancer";

  const notificationInfo = {
    new_job: {
      label: "Novo chamado",
      description:
        "Uma empresa publicou um novo chamado próximo da sua região.",
      icon: <AssignmentIcon width={34} height={34} color={colors.assignment}/>,
      buttonText: "Ver chamado",
    },
    request_accepted: {
      label: "Solicitação aceita",
      description:
        "Sua candidatura foi aceita pela empresa. Acompanhe os próximos passos.",
      icon: <CheckIcon width={34} height={34} color={colors.check}/>,
      buttonText: "Ver solicitação",
    },
    payment_confirmed: {
      label: "Pagamento confirmado",
      description:
        "O pagamento da taxa foi confirmado e o fluxo do chamado foi atualizado.",
      icon: <CheckIcon width={34} height={34} />,
      buttonText: "Abrir chat",
    },
    chat_released: {
      label: "Chat liberado",
      description:
        "O chat foi liberado para combinar os detalhes finais do serviço.",
      icon: <ChatIcon width={34} height={34} />,
      buttonText: "Abrir chat",
    },
    review_received: {
      label: "Avaliação recebida",
      description:
        "Você recebeu uma nova avaliação após a conclusão de um serviço.",
      icon: <StarIcon width={34} height={34} />,
      buttonText: "Ver avaliações",
    },
    message: {
      label: "Nova mensagem",
      description:
        "Você recebeu uma nova mensagem em uma conversa ativa.",
      icon: <ChatIcon width={34} height={34} />,
      buttonText: "Abrir conversa",
    },
    default: {
      label: "Atualização",
      description:
        "Existe uma nova atualização disponível no TaskFlow.",
      icon: <BellIcon width={34} height={34} color={colors.bell}/>,
      buttonText: "Entendi",
    },
  };

  const currentNotification = notificationInfo[type];

  function handleMainAction() {
    if (type === "new_job") {
      router.push({
        pathname: "/job-details",
        params: {
          title: jobTitle,
          category: "Eventos",
          price: "R$200,00",
          distance: "1,5 km",
          location: "Centro",
          time: "Hoje, 18:00",
        },
      });

      return;
    }

    if (type === "request_accepted") {
      router.push("/requests");
      return;
    }

    if (
      type === "payment_confirmed" ||
      type === "chat_released" ||
      type === "message"
    ) {
      router.push({
        pathname: "/chat",
        params: {
          jobTitle,
          candidateName: companyName,
        },
      });

      return;
    }

    if (type === "review_received") {
      if (userType === "empresa") {
        router.push("/company-reviews");
        return;
      }

      router.push("/reviews");
      return;
    }

    router.back();
  }

  function handleBackToNotifications() {
    if (userType === "empresa") {
      router.replace("/company-notifications");
      return;
    }

    router.replace("/notifications");
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
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Detalhes
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.iconBox}>{currentNotification.icon}</View>

          <Text style={[styles.notificationLabel, { color: theme.primary }]}>
            {currentNotification.label}
          </Text>

          <Text style={[styles.notificationTitle, { color: theme.text }]}>
            {title}
          </Text>

          <Text
            style={[
              styles.notificationMessage,
              { color: theme.textSecondary },
            ]}
          >
            {message}
          </Text>

          <View style={styles.timeBadge}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Informações relacionadas
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Chamado
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {jobTitle}
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
              Empresa
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {companyName}
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
              Tipo
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {currentNotification.label}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.descriptionBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>
            O que isso significa?
          </Text>

          <Text style={[styles.descriptionText, { color: theme.textSecondary }]}>
            {currentNotification.description}
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleMainAction}
        >
          <Text style={styles.primaryButtonText}>
            {currentNotification.buttonText}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.buttonPressed,
          ]}
          onPress={handleBackToNotifications}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar para notificações
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
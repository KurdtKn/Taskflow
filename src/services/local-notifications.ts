import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPost } from "@/services/api";

export type TaskFlowNotificationAudience = "freelancer" | "company";

export type TaskFlowNotificationType =
  | "new_job"
  | "candidate"
  | "payment"
  | "message"
  | "service"
  | "request_accepted"
  | "request_rejected"
  | "chat_released"
  | "review_received"
  | "default";

export type TaskFlowNotification = {
  id: string;
  audience: TaskFlowNotificationAudience;
  type: TaskFlowNotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  targetUserId?: string;
  eventKey?: string;
  jobId?: string;
  chamadoId?: string;
  jobTitle?: string;
  companyName?: string;
  companyId?: string;
  freelancerId?: string;
  candidateId?: string;
  candidaturaId?: string;
  contractId?: string;
  contratoId?: string;
  chatId?: string;
  params?: Record<string, string>;
};

export type CreateTaskFlowNotificationInput = Omit<
  Partial<TaskFlowNotification>,
  "id" | "createdAt" | "read"
> & {
  audience: TaskFlowNotificationAudience;
  type: TaskFlowNotificationType;
  title: string;
  description: string;
};

const NOTIFICATIONS_STORAGE_KEY = "@taskflow:notifications:v1";
const MAX_NOTIFICATIONS = 80;

function safeString(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeNotification(notification: any): TaskFlowNotification | null {
  if (!notification || typeof notification !== "object") {
    return null;
  }

  const audience = safeString(notification.audience) as TaskFlowNotificationAudience;
  const type = safeString(notification.type) as TaskFlowNotificationType;
  const title = safeString(notification.title);
  const description = safeString(notification.description);

  if (!audience || !type || !title) {
    return null;
  }

  return {
    id: safeString(notification.id) || createId(),
    audience,
    type,
    title,
    description,
    createdAt: safeString(notification.createdAt) || new Date().toISOString(),
    read: Boolean(notification.read),
    targetUserId: safeString(notification.targetUserId) || undefined,
    eventKey: safeString(notification.eventKey) || undefined,
    jobId: safeString(notification.jobId) || safeString(notification.chamadoId) || undefined,
    chamadoId: safeString(notification.chamadoId) || safeString(notification.jobId) || undefined,
    jobTitle: safeString(notification.jobTitle) || undefined,
    companyName: safeString(notification.companyName) || undefined,
    companyId: safeString(notification.companyId) || undefined,
    freelancerId: safeString(notification.freelancerId) || undefined,
    candidateId: safeString(notification.candidateId) || undefined,
    candidaturaId: safeString(notification.candidaturaId) || undefined,
    contractId: safeString(notification.contractId) || safeString(notification.contratoId) || undefined,
    contratoId: safeString(notification.contratoId) || safeString(notification.contractId) || undefined,
    chatId: safeString(notification.chatId) || undefined,
    params: notification.params && typeof notification.params === "object"
      ? notification.params
      : undefined,
  };
}

async function readAllNotifications() {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [] as TaskFlowNotification[];
    }

    return parsed
      .map(normalizeNotification)
      .filter(Boolean) as TaskFlowNotification[];
  } catch (error) {
    console.log("Erro ao ler notificações locais:", error);
    return [] as TaskFlowNotification[];
  }
}

async function saveAllNotifications(notifications: TaskFlowNotification[]) {
  const sortedNotifications = [...notifications]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, MAX_NOTIFICATIONS);

  await AsyncStorage.setItem(
    NOTIFICATIONS_STORAGE_KEY,
    JSON.stringify(sortedNotifications)
  );
}

export async function addTaskFlowNotification(input: CreateTaskFlowNotificationInput) {
  const allNotifications = await readAllNotifications();

  const eventKey = safeString(input.eventKey);

  const newNotification: TaskFlowNotification = {
    id: createId(),
    audience: input.audience,
    type: input.type,
    title: input.title,
    description: input.description,
    createdAt: new Date().toISOString(),
    read: false,
    targetUserId: safeString(input.targetUserId) || undefined,
    eventKey: eventKey || undefined,
    jobId: safeString(input.jobId) || safeString(input.chamadoId) || undefined,
    chamadoId: safeString(input.chamadoId) || safeString(input.jobId) || undefined,
    jobTitle: safeString(input.jobTitle) || undefined,
    companyName: safeString(input.companyName) || undefined,
    companyId: safeString(input.companyId) || undefined,
    freelancerId: safeString(input.freelancerId) || undefined,
    candidateId: safeString(input.candidateId) || undefined,
    candidaturaId: safeString(input.candidaturaId) || undefined,
    contractId: safeString(input.contractId) || safeString(input.contratoId) || undefined,
    contratoId: safeString(input.contratoId) || safeString(input.contractId) || undefined,
    chatId: safeString(input.chatId) || undefined,
    params: input.params,
  };

  const withoutDuplicate = eventKey
    ? allNotifications.filter(
        (notification) =>
          notification.eventKey !== eventKey ||
          notification.audience !== newNotification.audience ||
          notification.targetUserId !== newNotification.targetUserId
      )
    : allNotifications;

  await saveAllNotifications([newNotification, ...withoutDuplicate]);

  try {
    await apiPost("/api/Notificacoes", {
      UsuarioId: newNotification.targetUserId ?? null,
      Tipo: newNotification.type,
      Titulo: newNotification.title,
      Corpo: newNotification.description,
      PayloadJson: JSON.stringify(newNotification),
      Status: "ENVIADA",
    });
  } catch (error) {
    console.log(
      "Notificação salva localmente. API de notificações não disponível:",
      error
    );
  }

  return newNotification;
}

export async function getTaskFlowNotifications(params: {
  audience: TaskFlowNotificationAudience;
  userId?: string | number | null;
}) {
  const userId = safeString(params.userId);
  const allNotifications = await readAllNotifications();

  return allNotifications.filter((notification) => {
    if (notification.audience !== params.audience) {
      return false;
    }

    if (!notification.targetUserId || !userId) {
      return true;
    }

    return notification.targetUserId === userId;
  });
}

export async function markTaskFlowNotificationAsRead(notificationId: string) {
  const allNotifications = await readAllNotifications();

  await saveAllNotifications(
    allNotifications.map((notification) =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    )
  );
}

export async function markAllTaskFlowNotificationsAsRead(params: {
  audience: TaskFlowNotificationAudience;
  userId?: string | number | null;
}) {
  const userId = safeString(params.userId);
  const allNotifications = await readAllNotifications();

  await saveAllNotifications(
    allNotifications.map((notification) => {
      const sameAudience = notification.audience === params.audience;
      const sameUser =
        !notification.targetUserId || !userId || notification.targetUserId === userId;

      if (sameAudience && sameUser) {
        return { ...notification, read: true };
      }

      return notification;
    })
  );
}

export function formatTaskFlowNotificationTime(createdAt?: string) {
  if (!createdAt) {
    return "Agora";
  }

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return "Agora";
  }

  const diffMs = Date.now() - createdDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "Agora";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} min`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 1) {
    return "Ontem";
  }

  if (diffDays < 7) {
    return `${diffDays} dias`;
  }

  return createdDate.toLocaleDateString("pt-BR");
}

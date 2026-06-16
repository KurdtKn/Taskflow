import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ArrowBack from "../../assets/icons/arrow_back.svg";

import { styles } from "@/app/styles/chat";
import { useTheme } from "@/app/context/ThemeContext";
import {
  getCompanyData,
  getFreelancerData,
  getLoggedUser,
} from "@/services/storage";
import { addTaskFlowNotification } from "@/services/local-notifications";
import { colors } from "@/styles/colors";

type MessageSender = "company" | "freelancer" | "system";

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderType: MessageSender;
  senderPhotoUrl?: string;
  text: string;
  time: string;
  createdAt: string;
  chatAliases?: string[];
  contratoId?: string;
  jobId?: string;
  chamadoId?: string;
  candidaturaId?: string;
  freelancerId?: string;
  candidateUserId?: string;
  companyUserId?: string;
  jobTitle?: string;
  candidateName?: string;
  companyName?: string;
};

type LegacyMessage = {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  createdAt: string;
};

const CHAT_STORAGE_KEY = "@taskflow:chat";
const CHAT_GLOBAL_STORAGE_KEY = "@taskflow:chat-messages-global:v1";
const CHAT_BACKUP_STORAGE_KEY = "@taskflow:chat-all-mobile-backup:v6";

function getCurrentTime() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalizeMessage(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getInitial(name: string) {
  if (!name.trim()) {
    return "?";
  }

  return name.trim().charAt(0).toUpperCase();
}

function getParamValue(value?: string | string[], fallback = "") {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }

  return value ?? fallback;
}


function normalizeChatKeyPart(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();
}

function makeLegacyChatId(values: {
  contratoId?: string;
  jobId?: string;
  candidaturaId?: string;
  freelancerId?: string;
  jobTitle?: string;
  candidateName?: string;
}) {
  const contratoPart = normalizeChatKeyPart(values.contratoId);
  const jobPart = normalizeChatKeyPart(values.jobId);
  const candidaturaPart = normalizeChatKeyPart(values.candidaturaId);
  const freelancerPart = normalizeChatKeyPart(values.freelancerId);

  if (contratoPart) {
    return [
      `contrato-${contratoPart}`,
      jobPart ? `job-${jobPart}` : "",
      candidaturaPart ? `candidatura-${candidaturaPart}` : "",
      freelancerPart ? `freelancer-${freelancerPart}` : "",
    ]
      .filter(Boolean)
      .join("__");
  }

  const fallbackJob = jobPart || normalizeChatKeyPart(values.jobTitle);
  const fallbackCandidate =
    candidaturaPart || freelancerPart || normalizeChatKeyPart(values.candidateName);

  return [
    fallbackJob ? `job-${fallbackJob}` : "sem-job",
    fallbackCandidate ? `candidato-${fallbackCandidate}` : "sem-candidato",
  ].join("__");
}

function makeStableChatId(values: {
  contratoId?: string;
  jobId?: string;
  candidaturaId?: string;
  freelancerId?: string;
  jobTitle?: string;
  candidateName?: string;
}) {
  const contratoPart = normalizeChatKeyPart(values.contratoId);
  const candidaturaPart = normalizeChatKeyPart(values.candidaturaId);
  const jobPart = normalizeChatKeyPart(values.jobId);
  const freelancerPart = normalizeChatKeyPart(values.freelancerId);
  const titlePart = normalizeChatKeyPart(values.jobTitle);
  const candidatePart = normalizeChatKeyPart(values.candidateName);

  if (contratoPart) {
    return `contrato-${contratoPart}`;
  }

  if (candidaturaPart) {
    return `candidatura-${candidaturaPart}`;
  }

  if (jobPart && freelancerPart) {
    return `job-${jobPart}__freelancer-${freelancerPart}`;
  }

  if (jobPart && candidatePart) {
    return `job-${jobPart}__candidato-${candidatePart}`;
  }

  if (titlePart && candidatePart) {
    return `titulo-${titlePart}__candidato-${candidatePart}`;
  }

  return makeLegacyChatId(values);
}

function getChatAliases(values: {
  contratoId?: string;
  jobId?: string;
  candidaturaId?: string;
  freelancerId?: string;
  jobTitle?: string;
  candidateName?: string;
}) {
  const aliases = new Set<string>();
  const contratoPart = normalizeChatKeyPart(values.contratoId);
  const candidaturaPart = normalizeChatKeyPart(values.candidaturaId);
  const jobPart = normalizeChatKeyPart(values.jobId);
  const freelancerPart = normalizeChatKeyPart(values.freelancerId);
  const titlePart = normalizeChatKeyPart(values.jobTitle);
  const candidatePart = normalizeChatKeyPart(values.candidateName);

  aliases.add(makeStableChatId(values));
  aliases.add(makeLegacyChatId(values));

  if (contratoPart) {
    aliases.add(`contrato-${contratoPart}`);
  }

  if (candidaturaPart) {
    aliases.add(`candidatura-${candidaturaPart}`);
  }

  if (jobPart && freelancerPart) {
    aliases.add(`job-${jobPart}__freelancer-${freelancerPart}`);
  }

  if (jobPart && candidaturaPart) {
    aliases.add(`job-${jobPart}__candidatura-${candidaturaPart}`);
  }

  if (jobPart && candidatePart) {
    aliases.add(`job-${jobPart}__candidato-${candidatePart}`);
  }

  if (titlePart && candidatePart) {
    aliases.add(`titulo-${titlePart}__candidato-${candidatePart}`);
  }

  return [...aliases].filter(Boolean);
}

function normalizeId(value: unknown) {
  return String(value ?? "").trim();
}

function resolveLoggedUserType(
  loggedUser: any,
  userId: string,
  values: {
    candidateUserId?: string;
    freelancerId?: string;
    companyUserId?: string;
  }
): "empresa" | "freelancer" {
  const normalizedUserId = normalizeId(userId);
  const possibleFreelancerIds = [values.candidateUserId, values.freelancerId]
    .map(normalizeId)
    .filter(Boolean);
  const possibleCompanyIds = [values.companyUserId].map(normalizeId).filter(Boolean);

  if (normalizedUserId && possibleFreelancerIds.includes(normalizedUserId)) {
    return "freelancer";
  }

  if (normalizedUserId && possibleCompanyIds.includes(normalizedUserId)) {
    return "empresa";
  }

  const rawType = String(
    loggedUser?.tipoUsuario ??
      loggedUser?.tipo_usuario ??
      loggedUser?.tipo ??
      loggedUser?.userType ??
      loggedUser?.user_type ??
      loggedUser?.perfil ??
      loggedUser?.role ??
      ""
  )
    .toLowerCase()
    .trim();

  if (rawType.includes("freelancer")) {
    return "freelancer";
  }

  if (
    rawType.includes("empresa") ||
    rawType.includes("company") ||
    rawType.includes("contratante")
  ) {
    return "empresa";
  }

  return "empresa";
}

function getProfilePhotoUrl(profileData: any, fallback = "") {
  return String(
    profileData?.photoUrl ??
      profileData?.photo_url ??
      profileData?.fotoUrl ??
      profileData?.foto_url ??
      profileData?.logoUrl ??
      profileData?.logo_url ??
      profileData?.imageUrl ??
      profileData?.image_url ??
      profileData?.avatarUrl ??
      profileData?.avatar_url ??
      fallback ??
      ""
  ).trim();
}

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    contratoId?: string | string[];

    jobId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];
    candidateUserId?: string | string[];
    freelancerUserId?: string | string[];
    usuarioId?: string | string[];
    companyUserId?: string | string[];
    empresaUsuarioId?: string | string[];

    jobTitle?: string | string[];
    jobCategory?: string | string[];
    jobPrice?: string | string[];
    jobLocation?: string | string[];
    jobTime?: string | string[];
    status?: string | string[];

    candidateName?: string | string[];
    candidateEmail?: string | string[];
    candidateRating?: string | string[];
    candidatePhotoUrl?: string | string[];
    freelancerPhotoUrl?: string | string[];
    freelancerFotoUrl?: string | string[];

    companyName?: string | string[];
    companyPhotoUrl?: string | string[];
    empresaFotoUrl?: string | string[];
    companyLogoUrl?: string | string[];

    serviceValue?: string | string[];
    candidatePrice?: string | string[];
    platformFee?: string | string[];
    totalValue?: string | string[];
    paymentMethod?: string | string[];
  }>();

  const scrollRef = useRef<ScrollView>(null);
  const messagesRef = useRef<Message[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentSender, setCurrentSender] = useState<MessageSender>("company");
  const [currentUserType, setCurrentUserType] = useState<
    "empresa" | "freelancer" | null
  >(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("Usuário");
  const [currentUserPhotoUrl, setCurrentUserPhotoUrl] = useState<string>();
  const [companyProfilePhotoUrl, setCompanyProfilePhotoUrl] = useState("");
  const [freelancerProfilePhotoUrl, setFreelancerProfilePhotoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isFinishingJob, setIsFinishingJob] = useState(false);

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  const contratoId = getParamValue(params.contratoId);

  const jobId = getParamValue(params.jobId);
  const candidaturaId = getParamValue(params.candidaturaId);
  const freelancerId = getParamValue(params.freelancerId);
  const candidateUserId =
    getParamValue(params.candidateUserId) ||
    getParamValue(params.freelancerUserId) ||
    getParamValue(params.usuarioId) ||
    freelancerId;
  const companyUserId =
    getParamValue(params.companyUserId) || getParamValue(params.empresaUsuarioId);

  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const jobCategory = getParamValue(params.jobCategory);
  const jobPrice = getParamValue(params.jobPrice);
  const jobLocation = getParamValue(params.jobLocation);
  const jobTime = getParamValue(params.jobTime);
  const status = getParamValue(params.status);

  const candidateName = getParamValue(
    params.candidateName,
    "Freelancer selecionado"
  );
  const candidateEmail = getParamValue(params.candidateEmail);
  const candidateRating = getParamValue(params.candidateRating);
  const candidatePhotoUrl =
    getParamValue(params.candidatePhotoUrl) ||
    getParamValue(params.freelancerPhotoUrl) ||
    getParamValue(params.freelancerFotoUrl);

  const companyName = getParamValue(params.companyName, "Empresa");
  const companyPhotoUrl =
    getParamValue(params.companyPhotoUrl) ||
    getParamValue(params.empresaFotoUrl) ||
    getParamValue(params.companyLogoUrl);

  const serviceValue = getParamValue(params.serviceValue);
  const candidatePrice = getParamValue(params.candidatePrice);
  const platformFee = getParamValue(params.platformFee);
  const totalValue = getParamValue(params.totalValue);
  const paymentMethod = getParamValue(params.paymentMethod);

  const chatId = makeStableChatId({
    contratoId,
    jobId,
    candidaturaId,
    freelancerId: candidateUserId || freelancerId,
    jobTitle,
    candidateName,
  });
  const chatAliases = getChatAliases({
    contratoId,
    jobId,
    candidaturaId,
    freelancerId: candidateUserId || freelancerId,
    jobTitle,
    candidateName,
  });
  const chatKeys = chatAliases.map((alias) => `${CHAT_STORAGE_KEY}:${alias}`);
  const chatKey = chatKeys[0];

  const chatHeaderTitle =
    currentUserType === "freelancer" ? companyName : "Grupo do chamado";

  const chatHeaderSubtitle =
    currentUserType === "freelancer"
      ? "Chat com a empresa"
      : "Chat com freelancers aceitos";

  const systemMessage: Message = {
    id: "system-message",
    chatId,
    senderId: "system",
    senderName: "TaskFlow",
    senderType: "system",
    text: "Chat liberado para combinar os detalhes finais do serviço.",
    time: "Agora",
    createdAt: new Date().toISOString(),
  };

  const canSendMessage = normalizeMessage(messageText).length > 0 && !isLoading;

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    loadChat();

    const interval = setInterval(() => {
      syncChatMessages();
    }, 1200);

    return () => clearInterval(interval);
  }, [chatId]);


  function areMessagesEqual(firstList: Message[], secondList: Message[]) {
    if (firstList.length !== secondList.length) {
      return false;
    }

    return firstList.every((message, index) => {
      const otherMessage = secondList[index];
      return (
        otherMessage &&
        message.id === otherMessage.id &&
        message.text === otherMessage.text &&
        message.createdAt === otherMessage.createdAt
      );
    });
  }

  function enrichMessageWithCurrentChat(message: Message): Message {
    return {
      ...message,
      chatId,
      chatAliases,
      contratoId,
      jobId,
      chamadoId: jobId,
      candidaturaId,
      freelancerId,
      candidateUserId,
      companyUserId,
      jobTitle,
      candidateName,
      companyName,
    };
  }

  function messageBelongsToCurrentChat(message: Message) {
    const aliasSet = new Set(chatAliases);
    const messageAliases = Array.isArray(message.chatAliases)
      ? message.chatAliases
      : [];

    if (message.chatId && (message.chatId === chatId || aliasSet.has(message.chatId))) {
      return true;
    }

    if (messageAliases.some((alias) => aliasSet.has(alias))) {
      return true;
    }

    const sameContrato = Boolean(
      contratoId && normalizeId(message.contratoId) === normalizeId(contratoId)
    );

    if (sameContrato) {
      return true;
    }

    const sameCandidatura = Boolean(
      candidaturaId &&
        normalizeId(message.candidaturaId) === normalizeId(candidaturaId)
    );

    if (sameCandidatura) {
      return true;
    }

    const sameJob = Boolean(
      jobId &&
        (normalizeId(message.jobId) === normalizeId(jobId) ||
          normalizeId(message.chamadoId) === normalizeId(jobId))
    );

    const currentFreelancerKeys = [
      candidateUserId,
      freelancerId,
      candidateName,
    ]
      .map(normalizeChatKeyPart)
      .filter(Boolean);

    const messageFreelancerKeys = [
      message.candidateUserId,
      message.freelancerId,
      message.candidateName,
    ]
      .map(normalizeChatKeyPart)
      .filter(Boolean);

    const sameFreelancer =
      currentFreelancerKeys.length === 0 ||
      messageFreelancerKeys.length === 0 ||
      currentFreelancerKeys.some((key) => messageFreelancerKeys.includes(key));

    if (sameJob && sameFreelancer) {
      return true;
    }

    const currentTitleKey = normalizeChatKeyPart(jobTitle);
    const messageTitleKey = normalizeChatKeyPart(message.jobTitle);
    const currentCandidateKey = normalizeChatKeyPart(candidateName);
    const messageCandidateKey = normalizeChatKeyPart(message.candidateName);

    const sameTitle = Boolean(
      currentTitleKey && messageTitleKey && currentTitleKey === messageTitleKey
    );

    const sameCandidateName = Boolean(
      currentCandidateKey &&
        messageCandidateKey &&
        currentCandidateKey === messageCandidateKey
    );

    if (sameTitle && sameCandidateName) {
      return true;
    }

    // Último fallback para mobile/MVP: se os dois lados chegaram com o mesmo
    // título do chamado, considera a conversa compatível. Isso evita o chat
    // ficar vazio quando uma rota manda contratoId e a outra manda só jobTitle.
    if (sameTitle && !contratoId && !candidaturaId) {
      return true;
    }

    return false;
  }

  async function readGlobalStoredMessages() {
    try {
      const rawGlobalMessages = await AsyncStorage.getItem(CHAT_GLOBAL_STORAGE_KEY);
      const parsedGlobalMessages = rawGlobalMessages
        ? JSON.parse(rawGlobalMessages)
        : [];

      if (!Array.isArray(parsedGlobalMessages)) {
        return [] as Message[];
      }

      return parsedGlobalMessages
        .map((message) => normalizeStoredMessage(message as Message | LegacyMessage))
        .filter((message) => messageBelongsToCurrentChat(message));
    } catch (error) {
      console.log("Erro ao ler registro global do chat:", error);
      return [] as Message[];
    }
  }

  async function saveGlobalStoredMessages(currentChatMessages: Message[]) {
    try {
      const rawGlobalMessages = await AsyncStorage.getItem(CHAT_GLOBAL_STORAGE_KEY);
      const parsedGlobalMessages = rawGlobalMessages
        ? JSON.parse(rawGlobalMessages)
        : [];

      const globalMessages = Array.isArray(parsedGlobalMessages)
        ? (parsedGlobalMessages
            .map((message) => normalizeStoredMessage(message as Message | LegacyMessage))
            .filter((message) => !messageBelongsToCurrentChat(message)) as Message[])
        : [];

      const enrichedCurrentMessages = currentChatMessages.map(enrichMessageWithCurrentChat);

      const mergedMessagesMap = new Map<string, Message>();

      [...globalMessages, ...enrichedCurrentMessages].forEach((message) => {
        mergedMessagesMap.set(message.id, message);
      });

      const mergedGlobalMessages = Array.from(mergedMessagesMap.values()).sort(
        (a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA - dateB;
        }
      );

      await AsyncStorage.setItem(
        CHAT_GLOBAL_STORAGE_KEY,
        JSON.stringify(mergedGlobalMessages)
      );
    } catch (error) {
      console.log("Erro ao salvar registro global do chat:", error);
    }
  }

  async function readStoredMessages() {
    const allMessages: Message[] = [];
    const aliasSet = new Set(chatAliases);

    for (const currentChatKey of chatKeys) {
      try {
        const storedMessages = await AsyncStorage.getItem(currentChatKey);

        if (!storedMessages) {
          continue;
        }

        const parsedMessages = JSON.parse(storedMessages) as Array<
          Message | LegacyMessage
        >;

        parsedMessages.forEach((message) => {
          const normalizedMessage = normalizeStoredMessage(message);

          if (!normalizedMessage.chatId || aliasSet.has(normalizedMessage.chatId)) {
            allMessages.push(normalizedMessage);
          }
        });
      } catch (error) {
        console.log("Erro ao ler chave de chat:", currentChatKey, error);
      }
    }

    const globalMessages = await readGlobalStoredMessages();
    allMessages.push(...globalMessages);

    try {
      const rawBackupMessages = await AsyncStorage.getItem(CHAT_BACKUP_STORAGE_KEY);
      const parsedBackupMessages = rawBackupMessages ? JSON.parse(rawBackupMessages) : [];

      if (Array.isArray(parsedBackupMessages)) {
        parsedBackupMessages.forEach((message) => {
          const normalizedMessage = normalizeStoredMessage(message as Message | LegacyMessage);

          if (messageBelongsToCurrentChat(normalizedMessage)) {
            allMessages.push(normalizedMessage);
          }
        });
      }
    } catch (error) {
      console.log("Erro ao ler backup global do chat:", error);
    }

    const messagesMap = new Map<string, Message>();

    allMessages.forEach((message) => {
      messagesMap.set(message.id, enrichMessageWithCurrentChat(message));
    });

    return Array.from(messagesMap.values()).sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  }

  async function syncChatMessages() {
    try {
      const storedMessages = await readStoredMessages();

      if (!areMessagesEqual(messagesRef.current, storedMessages)) {
        setMessages(storedMessages);

        setTimeout(() => {
          scrollRef.current?.scrollToEnd({ animated: true });
        }, 80);
      }
    } catch (error) {
      console.log("Erro ao sincronizar mensagens do chat:", error);
    }
  }

  async function loadChat() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      const userId = normalizeId(
        loggedUser.id ??
          loggedUser.userId ??
          loggedUser.usuarioId ??
          loggedUser.idUsuario
      );
      const userName = loggedUser.nome || loggedUser.name || "Usuário";
      const resolvedUserType = resolveLoggedUserType(loggedUser, userId, {
        candidateUserId,
        freelancerId,
        companyUserId,
      });

      setCurrentUserId(userId);
      setCurrentUserName(userName);

      if (resolvedUserType === "freelancer") {
        setCurrentSender("freelancer");
        setCurrentUserType("freelancer");

        const freelancerData = await getFreelancerData(userId);
        const freelancerPhoto =
          getProfilePhotoUrl(freelancerData, candidatePhotoUrl) || candidatePhotoUrl;

        setFreelancerProfilePhotoUrl(freelancerPhoto);
        setCompanyProfilePhotoUrl(companyPhotoUrl);
        setCurrentUserPhotoUrl(freelancerPhoto || undefined);
      } else {
        setCurrentSender("company");
        setCurrentUserType("empresa");

        const companyData = await getCompanyData(userId);
        const companyPhoto =
          getProfilePhotoUrl(companyData, companyPhotoUrl) || companyPhotoUrl;

        setCompanyProfilePhotoUrl(companyPhoto);
        setFreelancerProfilePhotoUrl(candidatePhotoUrl);
        setCurrentUserPhotoUrl(companyPhoto || undefined);
      }

      const storedMessages = await readStoredMessages();
      setMessages(storedMessages);
    } catch (error) {
      console.log("Erro ao carregar mensagens do chat:", error);
      setMessages([]);
    } finally {
      setIsLoading(false);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }

  function normalizeStoredMessage(message: Message | LegacyMessage): Message {
    if ("senderType" in message) {
      return message;
    }

    const senderName =
      message.sender === "company"
        ? companyName
        : message.sender === "freelancer"
        ? candidateName
        : "TaskFlow";

    return {
      id: message.id,
      chatId,
      senderId: message.sender,
      senderName,
      senderType: message.sender,
      text: message.text,
      time: message.time,
      createdAt: message.createdAt,
    };
  }

  async function saveMessages(updatedMessages: Message[]) {
    try {
      const storedMessages = await readStoredMessages();
      const mergedMessagesMap = new Map<string, Message>();

      [...storedMessages, ...updatedMessages].forEach((message) => {
        mergedMessagesMap.set(message.id, enrichMessageWithCurrentChat(message));
      });

      const mergedMessages = Array.from(mergedMessagesMap.values()).sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateA - dateB;
      });

      await Promise.all(
        chatKeys.map((currentChatKey) =>
          AsyncStorage.setItem(currentChatKey, JSON.stringify(mergedMessages))
        )
      );

      await saveGlobalStoredMessages(mergedMessages);

      try {
        const rawBackupMessages = await AsyncStorage.getItem(CHAT_BACKUP_STORAGE_KEY);
        const parsedBackupMessages = rawBackupMessages ? JSON.parse(rawBackupMessages) : [];
        const backupMessages = Array.isArray(parsedBackupMessages)
          ? (parsedBackupMessages
              .map((message) => normalizeStoredMessage(message as Message | LegacyMessage))
              .filter((message) => !messageBelongsToCurrentChat(message)) as Message[])
          : [];

        const backupMap = new Map<string, Message>();

        [...backupMessages, ...mergedMessages.map(enrichMessageWithCurrentChat)].forEach(
          (message) => {
            backupMap.set(message.id, message);
          }
        );

        await AsyncStorage.setItem(
          CHAT_BACKUP_STORAGE_KEY,
          JSON.stringify(Array.from(backupMap.values()))
        );
      } catch (error) {
        console.log("Erro ao salvar backup global do chat:", error);
      }

      messagesRef.current = mergedMessages;
      setMessages(mergedMessages);
    } catch (error) {
      console.log("Erro ao salvar mensagens do chat:", error);
      Alert.alert("Erro", "Não foi possível salvar a mensagem agora.");
    }
  }

  function handleChangeMessage(value: string) {
    setMessageText(value);
  }

  async function handleSendMessage() {
    const normalizedMessage = normalizeMessage(messageText);

    if (!normalizedMessage || isLoading) {
      return;
    }

    const newMessage: Message = {
      id: `${Date.now()}-${currentUserId || currentSender}`,
      chatId,
      senderId: currentUserId || currentSender,
      senderName: currentUserName,
      senderType: currentSender,
      senderPhotoUrl: currentUserPhotoUrl,
      text: normalizedMessage,
      time: getCurrentTime(),
      createdAt: new Date().toISOString(),
      chatAliases,
      contratoId,
      jobId,
      chamadoId: jobId,
      candidaturaId,
      freelancerId,
      candidateUserId,
      companyUserId,
      jobTitle,
      candidateName,
      companyName,
    };

    const updatedMessages = [...messagesRef.current, newMessage];

    setMessages(updatedMessages);
    setMessageText("");

    await saveMessages(updatedMessages);

    await addTaskFlowNotification({
      audience: currentSender === "company" ? "freelancer" : "company",
      type: "message",
      title: `Nova mensagem de ${currentUserName}`,
      description:
        normalizedMessage.length > 80
          ? `${normalizedMessage.slice(0, 80)}...`
          : normalizedMessage,
      jobId,
      chamadoId: jobId,
      candidaturaId,
      freelancerId,
      candidateId: candidateUserId || freelancerId,
      contratoId,
      contractId: contratoId,
      chatId,
      jobTitle,
      companyName,
      params: {
        contratoId,
        jobId,
        chamadoId: jobId,
        candidaturaId,
        freelancerId,
        candidateUserId,
        companyUserId,
        jobTitle,
        companyName,
        candidateName,
        chatKey: chatId,
      },
      eventKey: `message:${chatId}:${newMessage.id}`,
    });

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  async function handleFinishService() {
    console.log("CLICOU EM FINALIZAR");
    console.log("contratoId:", contratoId);
    console.log("jobId:", jobId);
    console.log("candidaturaId:", candidaturaId);
    console.log("freelancerId:", freelancerId);

    if (!contratoId) {
      Alert.alert(
        "Contrato não encontrado",
        "O chat não recebeu o contratoId. Volte para o pagamento e abra o chat novamente."
      );
      return;
    }

    if (!jobId) {
      Alert.alert("Erro", "Não foi possível identificar o chamado.");
      return;
    }

    try {
      setIsFinishingJob(true);

      router.push({
        pathname: "/service-completion",
        params: {
          contratoId,

          jobId,
          candidaturaId,
          freelancerId,

          jobTitle,
          jobCategory,
          jobPrice,
          jobLocation,
          jobTime,
          status,

          candidateName,
          candidateEmail,
          candidateRating,
          candidatePhotoUrl,

          companyName,
          companyPhotoUrl,

          serviceValue,
          candidatePrice,
          platformFee,
          totalValue,
          paymentMethod,
        },
      });
    } catch (error) {
      console.log("Erro ao abrir tela de conclusão:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível abrir a tela de conclusão agora.";

      Alert.alert("Erro", errorMessage);
    } finally {
      setIsFinishingJob(false);
    }
  }

  function handleGoBack() {
    if (currentUserType === "freelancer") {
      router.replace("/requests");
      return;
    }

    router.replace("/company-dashboard");
  }

  function getMessageSenderPhoto(message: Message) {
    if (message.senderPhotoUrl) {
      return message.senderPhotoUrl;
    }

    if (message.senderType === "company") {
      return companyProfilePhotoUrl || companyPhotoUrl;
    }

    if (message.senderType === "freelancer") {
      return freelancerProfilePhotoUrl || candidatePhotoUrl;
    }

    return "";
  }

  function renderAvatar(message: Message, isCurrentUser: boolean) {
    const photoUrl = getMessageSenderPhoto(message);

    if (photoUrl) {
      return (
        <Image
          source={{ uri: photoUrl }}
          style={styles.senderAvatar}
          resizeMode="cover"
        />
      );
    }

    return (
      <View
        style={[
          styles.senderAvatar,
          {
            backgroundColor: isCurrentUser
              ? colors.primary
              : theme.inputBackground,
            borderColor: isCurrentUser ? colors.primary : theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.senderAvatarText,
            { color: isCurrentUser ? colors.white : theme.text },
          ]}
        >
          {getInitial(message.senderName)}
        </Text>
      </View>
    );
  }

  const visibleMessages = [systemMessage, ...messages];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <ArrowBack
              width={28}
              height={28}
              color={theme.text}
              fill={theme.text}
            />
          </Pressable>

          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {chatHeaderTitle}
            </Text>

            <Text
              style={[styles.headerSubtitle, { color: theme.textSecondary }]}
            >
              {chatHeaderSubtitle}
            </Text>
          </View>

          {currentUserType === "empresa" ? (
            <Pressable
              style={[styles.finishButton, isFinishingJob && { opacity: 0.55 }]}
              onPress={handleFinishService}
              disabled={isLoading || isFinishingJob}
            >
              <Text style={styles.finishButtonText}>
                {isFinishingJob ? "Finalizando..." : "Finalizar"}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.finishButtonPlaceholder} />
          )}
        </View>

        <View
          style={[
            styles.jobCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.jobLabel, { color: theme.primary }]}>
            Chamado em andamento
          </Text>

          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          <Text style={[styles.jobText, { color: theme.textSecondary }]}>
            Combine os detalhes finais do serviço diretamente pelo chat em
            grupo.
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="always"
          style={{ backgroundColor: theme.background }}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {isLoading ? (
            <View
              style={[
                styles.systemMessage,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.systemMessageText,
                  { color: theme.textSecondary },
                ]}
              >
                Carregando mensagens...
              </Text>
            </View>
          ) : (
            visibleMessages.map((message) => {
              const isSystem = message.senderType === "system";
              const isCurrentUser = message.senderId === currentUserId;

              if (isSystem) {
                return (
                  <View
                    key={message.id}
                    style={[
                      styles.systemMessage,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.systemMessageText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {message.text}
                    </Text>
                  </View>
                );
              }

              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    isCurrentUser
                      ? styles.messageRowCompany
                      : styles.messageRowFreelancer,
                  ]}
                >
                  {!isCurrentUser && renderAvatar(message, isCurrentUser)}

                  <View style={styles.messageGroup}>
                    <Text
                      style={[
                        styles.senderName,
                        {
                          color: theme.textSecondary,
                          textAlign: isCurrentUser ? "right" : "left",
                        },
                      ]}
                    >
                      {message.senderName}
                    </Text>

                    <View
                      style={[
                        styles.messageBubble,
                        isCurrentUser
                          ? styles.companyBubble
                          : styles.freelancerBubble,
                        !isCurrentUser && {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          isCurrentUser
                            ? styles.companyMessageText
                            : styles.freelancerMessageText,
                          !isCurrentUser && { color: theme.text },
                        ]}
                      >
                        {message.text}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.messageTime,
                        isCurrentUser
                          ? styles.companyMessageTimeOutside
                          : styles.freelancerMessageTime,
                        !isCurrentUser && { color: theme.textSecondary },
                      ]}
                    >
                      {message.time}
                    </Text>
                  </View>

                  {isCurrentUser && renderAvatar(message, isCurrentUser)}
                </View>
              );
            })
          )}

          {!isLoading && messages.length === 0 && (
            <View
              style={[
                styles.systemMessage,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.systemMessageText,
                  { color: theme.textSecondary },
                ]}
              >
                Nenhuma mensagem enviada ainda.
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputArea,
            {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
            },
          ]}
        >
          <TextInput
            style={[styles.input, cleanInputStyle]}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={theme.textSecondary}
            value={messageText}
            onChangeText={handleChangeMessage}
            multiline
            editable={!isLoading}
          />

          <Pressable
            disabled={!canSendMessage}
            style={({ pressed }) => [
              styles.sendButton,
              pressed && canSendMessage && styles.sendButtonPressed,
              !canSendMessage && styles.sendButtonDisabled,
            ]}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
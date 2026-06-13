import { useEffect, useRef, useState } from "react";
import {
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
import { colors } from "@/styles/colors";
import {
  getCompanyData,
  getFreelancerData,
  getLoggedUser,
} from "@/services/storage";

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
};

type LegacyMessage = {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  createdAt?: string;
};

const CHAT_STORAGE_KEY = "@taskflow:chat";

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

export default function FreelancerChatScreen() {
  const params = useLocalSearchParams<{
    requestId?: string | string[];
    jobId?: string | string[];
    chatId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];
    jobTitle?: string | string[];
    candidateName?: string | string[];
    companyName?: string | string[];
    userType?: string | string[];
  }>();

  const scrollRef = useRef<ScrollView>(null);

  const requestId = getParamValue(params.requestId);
  const jobId = getParamValue(params.jobId);
  const paramChatId = getParamValue(params.chatId);
  const candidaturaId = getParamValue(params.candidaturaId) || requestId;
  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const candidateName = getParamValue(params.candidateName, "Freelancer");
  const companyName = getParamValue(params.companyName, "Empresa");

  const chatId = paramChatId || jobId || candidaturaId || "sem-chamado";
  const chatKey = `${CHAT_STORAGE_KEY}:${chatId}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentSender, setCurrentSender] =
    useState<MessageSender>("freelancer");
  const [currentUserType, setCurrentUserType] = useState<
    "empresa" | "freelancer" | null
  >(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("Usuário");
  const [currentUserPhotoUrl, setCurrentUserPhotoUrl] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

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
    loadChat();
  }, [chatKey]);

  async function loadChat() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      const tipoUsuario = loggedUser.tipoUsuario?.toLowerCase().trim();
      const userId = String(loggedUser.id);
      const userName = loggedUser.nome || "Usuário";

      setCurrentUserId(userId);
      setCurrentUserName(userName);

      if (tipoUsuario === "empresa") {
        setCurrentSender("company");
        setCurrentUserType("empresa");

        const companyData = await getCompanyData(userId);
        setCurrentUserPhotoUrl(companyData?.logoUrl);
      } else {
        setCurrentSender("freelancer");
        setCurrentUserType("freelancer");

        const freelancerData = await getFreelancerData(userId);
        setCurrentUserPhotoUrl(freelancerData?.photoUrl);
      }

      const storedMessages = await AsyncStorage.getItem(chatKey);

      if (!storedMessages) {
        setMessages([]);
        return;
      }

      const parsedMessages = JSON.parse(storedMessages) as Array<
        Message | LegacyMessage
      >;

      const normalizedMessages = parsedMessages.map((message) =>
        normalizeStoredMessage(message)
      );

      setMessages(normalizedMessages);
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
      createdAt: message.createdAt ?? new Date().toISOString(),
    };
  }

  async function saveMessages(updatedMessages: Message[]) {
    try {
      await AsyncStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    } catch (error) {
      console.log("Erro ao salvar mensagens do chat:", error);
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
    };

    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setMessageText("");

    await saveMessages(updatedMessages);

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  function handleGoBack() {
    if (currentUserType === "empresa") {
      router.replace("/company-dashboard");
      return;
    }

    router.replace("/requests");
  }

  function renderAvatar(message: Message, isCurrentUser: boolean) {
    if (message.senderPhotoUrl) {
      return (
        <Image
          source={{ uri: message.senderPhotoUrl }}
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
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
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
              {currentUserType === "empresa" ? "Grupo do chamado" : companyName}
            </Text>

            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              {currentUserType === "empresa"
                ? "Chat com freelancers aceitos"
                : "Chat com a empresa"}
            </Text>
          </View>

          <View style={styles.finishButtonPlaceholder} />
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
            Combine os detalhes finais do serviço diretamente pelo chat.
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
            style={[
              styles.input,
              cleanInputStyle,
            ]}
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
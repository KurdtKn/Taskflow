import { useEffect, useRef, useState } from "react";
import {
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
import { getLoggedUser } from "@/services/storage";

type MessageSender = "company" | "freelancer" | "system";

type Message = {
  id: string;
  sender: MessageSender;
  text: string;
  time: string;
  createdAt: string;
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

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    jobId?: string | string[];
    candidaturaId?: string | string[];
    freelancerId?: string | string[];
    jobTitle?: string | string[];
    candidateName?: string | string[];
    companyName?: string | string[];
  }>();

  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentSender, setCurrentSender] = useState<MessageSender>("company");
  const [currentUserType, setCurrentUserType] = useState<
    "empresa" | "freelancer" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  function getParamValue(value?: string | string[], fallback = "") {
    if (Array.isArray(value)) {
      return value[0] ?? fallback;
    }

    return value ?? fallback;
  }

  const jobId = getParamValue(params.jobId);
  const candidaturaId = getParamValue(params.candidaturaId);
  const freelancerId = getParamValue(params.freelancerId);
  const jobTitle = getParamValue(params.jobTitle, "Chamado");
  const candidateName = getParamValue(
    params.candidateName,
    "Freelancer selecionado"
  );
  const companyName = getParamValue(params.companyName, "Empresa");

  const chatKey = `${CHAT_STORAGE_KEY}:${jobId || "sem-chamado"}:${
    candidaturaId || freelancerId || "sem-candidatura"
  }`;

  const chatHeaderTitle =
    currentUserType === "freelancer" ? companyName : candidateName;

  const systemMessage: Message = {
    id: "system-message",
    sender: "system",
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

      if (tipoUsuario === "freelancer") {
        setCurrentSender("freelancer");
        setCurrentUserType("freelancer");
      } else {
        setCurrentSender("company");
        setCurrentUserType("empresa");
      }

      const storedMessages = await AsyncStorage.getItem(chatKey);

      if (!storedMessages) {
        setMessages([]);
        return;
      }

      const parsedMessages = JSON.parse(storedMessages) as Message[];
      setMessages(parsedMessages);
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
      id: `${Date.now()}-${currentSender}`,
      sender: currentSender,
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

  function handleFinishService() {
    router.push({
      pathname: "/service-completion",
      params: {
        jobId,
        candidaturaId,
        freelancerId,
        jobTitle,
        candidateName,
        companyName,
      },
    });
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
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/company-dashboard")}
          >
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

            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Chat do chamado
            </Text>
          </View>

          <Pressable
            style={styles.finishButton}
            onPress={handleFinishService}
            disabled={isLoading}
          >
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </Pressable>
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
              const isCompany = message.sender === "company";
              const isFreelancer = message.sender === "freelancer";
              const isSystem = message.sender === "system";

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
                    isCompany && styles.messageRowCompany,
                    isFreelancer && styles.messageRowFreelancer,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isCompany && styles.companyBubble,
                      isFreelancer && styles.freelancerBubble,
                      isFreelancer && {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isCompany && styles.companyMessageText,
                        isFreelancer && styles.freelancerMessageText,
                        isFreelancer && { color: theme.text },
                      ]}
                    >
                      {message.text}
                    </Text>

                    <Text
                      style={[
                        styles.messageTime,
                        isCompany && styles.companyMessageTime,
                        isFreelancer && styles.freelancerMessageTime,
                        isFreelancer && { color: theme.textSecondary },
                      ]}
                    >
                      {message.time}
                    </Text>
                  </View>
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
              !canSendMessage && { opacity: 0.45 },
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
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

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    jobId?: string;
    candidaturaId?: string;
    freelancerId?: string;
    jobTitle?: string;
    candidateName?: string;
  }>();

  const jobId = params.jobId ?? "";
  const candidaturaId = params.candidaturaId ?? "";
  const freelancerId = params.freelancerId ?? "";
  const jobTitle = params.jobTitle ?? "Chamado";
  const candidateName = params.candidateName ?? "Freelancer selecionado";

  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentSender, setCurrentSender] = useState<MessageSender>("company");
  const [isLoading, setIsLoading] = useState(true);

  const { isDark, theme } = useTheme();

  const chatKey = `${CHAT_STORAGE_KEY}:${jobId || "sem-chamado"}:${
    candidaturaId || freelancerId || "sem-candidatura"
  }`;

  const systemMessage: Message = {
    id: "system-message",
    sender: "system",
    text: "Chat liberado para combinar os detalhes finais do serviço.",
    time: "Agora",
    createdAt: new Date().toISOString(),
  };

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

      if (loggedUser.tipoUsuario === "freelancer") {
        setCurrentSender("freelancer");
      } else {
        setCurrentSender("company");
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

  async function handleSendMessage() {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage: Message = {
      id: String(Date.now()),
      sender: currentSender,
      text: trimmedMessage,
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
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <View style={styles.headerInfo}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {candidateName}
            </Text>

            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
              Chat do chamado
            </Text>
          </View>

          <Pressable style={styles.finishButton} onPress={handleFinishService}>
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
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={theme.textSecondary}
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.sendButtonPressed,
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
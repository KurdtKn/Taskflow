import { useRef, useState } from "react";
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

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/chat";
import { useTheme } from "@/app/context/ThemeContext";

type Message = {
  id: string;
  sender: "company" | "freelancer" | "system";
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "system",
    text: "Chat liberado após confirmação do pagamento da taxa.",
    time: "Agora",
  },
  {
    id: "2",
    sender: "company",
    text: "Olá! Tudo certo para o serviço combinado?",
    time: "18:02",
  },
  {
    id: "3",
    sender: "freelancer",
    text: "Olá! Tudo certo sim. Pode me passar os últimos detalhes do local?",
    time: "18:03",
  },
  {
    id: "4",
    sender: "company",
    text: "Claro. O evento será no salão principal, no endereço informado no chamado.",
    time: "18:05",
  },
];

export default function ChatScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";

  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageText, setMessageText] = useState("");

  const { isDark, theme } = useTheme();

  function handleSendMessage() {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage: Message = {
      id: String(Date.now()),
      sender: "company",
      text: trimmedMessage,
      time: "Agora",
    };

    setMessages((currentMessages) => [...currentMessages, newMessage]);
    setMessageText("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }

  function handleFinishService() {
    router.push({
      pathname: "/service-completion",
      params: {
        jobTitle,
        candidateName,
      },
    });
  }

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
              Online agora
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
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => {
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
                    isFreelancer && [
                      styles.freelancerBubble,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                    ],
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isCompany && styles.companyMessageText,
                      isFreelancer && [
                        styles.freelancerMessageText,
                        { color: theme.text },
                      ],
                    ]}
                  >
                    {message.text}
                  </Text>

                  <Text
                    style={[
                      styles.messageTime,
                      isCompany && styles.companyMessageTime,
                      isFreelancer && [
                        styles.freelancerMessageTime,
                        { color: theme.textSecondary },
                      ],
                    ]}
                  >
                    {message.time}
                  </Text>
                </View>
              </View>
            );
          })}
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
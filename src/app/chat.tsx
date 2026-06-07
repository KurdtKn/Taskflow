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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{candidateName}</Text>
            <Text style={styles.headerSubtitle}>Online agora</Text>
          </View>

          <Pressable style={styles.finishButton} onPress={handleFinishService}>
            <Text style={styles.finishButtonText}>Finalizar</Text>
          </Pressable>
        </View>

        <View style={styles.jobCard}>
          <Text style={styles.jobLabel}>Chamado em andamento</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.jobText}>
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
                <View key={message.id} style={styles.systemMessage}>
                  <Text style={styles.systemMessageText}>{message.text}</Text>
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
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isCompany && styles.companyMessageText,
                      isFreelancer && styles.freelancerMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>

                  <Text
                    style={[
                      styles.messageTime,
                      isCompany && styles.companyMessageTime,
                      isFreelancer && styles.freelancerMessageTime,
                    ]}
                  >
                    {message.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="Digite uma mensagem..."
            placeholderTextColor="#9CA3AF"
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
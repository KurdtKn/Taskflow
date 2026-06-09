import type { ComponentType } from "react";
import { useState } from "react";
import {
  Alert,
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
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import ChatIcon from "../../assets/icons/chat.svg";
import SendIcon from "../../assets/icons/send.svg";
import TimeIcon from "../../assets/icons/access_time.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";

import { styles } from "@/app/styles/supportContact";

type SupportChannel = "chat" | "email" | "phone";

type ChannelOption = {
  id: SupportChannel;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

const channels: ChannelOption[] = [
  {
    id: "chat",
    title: "Chat",
    subtitle: "Resposta mais rápida",
    Icon: ChatIcon,
  },
  {
    id: "email",
    title: "E-mail",
    subtitle: "Para dúvidas detalhadas",
    Icon: SendIcon,
  },
  {
    id: "phone",
    title: "Telefone",
    subtitle: "Atendimento comercial",
    Icon: SupportIcon,
  },
];

export default function SupportContactScreen() {
  const [selectedChannel, setSelectedChannel] =
    useState<SupportChannel>("chat");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSendSupportRequest() {
    if (!subject.trim() || !message.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha o assunto e a mensagem para falar com o suporte."
      );
      return;
    }

    Alert.alert(
      "Solicitação enviada",
      "Sua mensagem foi enviada para o suporte. Em breve nossa equipe retornará o contato.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
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

          <Text style={styles.headerTitle}>Falar com suporte</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Central de ajuda</Text>
              <Text style={styles.heroTitle}>Como podemos ajudar?</Text>
              <Text style={styles.heroText}>
                Envie sua dúvida para o suporte do TaskFlow.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <SupportIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIconBox}>
              <TimeIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={styles.infoTitle}>Tempo médio de resposta</Text>
              <Text style={styles.infoText}>
                No protótipo, essa ação é simulada. Na versão final, a mensagem
                será enviada para a API de suporte.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escolha o canal</Text>

            <View style={styles.channelsList}>
              {channels.map((channel) => {
                const isSelected = selectedChannel === channel.id;
                const Icon = channel.Icon;

                return (
                  <Pressable
                    key={channel.id}
                    style={[
                      styles.channelCard,
                      isSelected && styles.channelCardActive,
                    ]}
                    onPress={() => setSelectedChannel(channel.id)}
                  >
                    <View style={styles.channelIconBox}>
                      <Icon width={24} height={24} />
                    </View>

                    <View style={styles.channelTextArea}>
                      <Text
                        style={[
                          styles.channelTitle,
                          isSelected && styles.channelTitleActive,
                        ]}
                      >
                        {channel.title}
                      </Text>

                      <Text
                        style={[
                          styles.channelSubtitle,
                          isSelected && styles.channelSubtitleActive,
                        ]}
                      >
                        {channel.subtitle}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.radio,
                        isSelected && styles.radioActive,
                      ]}
                    >
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Assunto</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Dúvida sobre minha conta"
              placeholderTextColor="#9CA3AF"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Mensagem</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva sua dúvida ou problema..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <View style={styles.quickHelpCard}>
            <View style={styles.quickHelpHeader}>
              <ChatIcon width={22} height={22} />
              <Text style={styles.quickHelpTitle}>Antes de enviar</Text>
            </View>

            <Text style={styles.quickHelpText}>
              Informe o máximo de detalhes possível para que o suporte consiga
              entender melhor sua solicitação.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSendSupportRequest}
          >
            <SendIcon width={20} height={20} />
            <Text style={styles.sendButtonText}>Enviar mensagem</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
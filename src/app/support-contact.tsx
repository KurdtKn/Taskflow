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

import { styles } from "@/app/styles/supportContact";
import { useTheme } from "@/app/context/ThemeContext";

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

  const { isDark, theme } = useTheme();

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
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Falar com suporte
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
            <View>
              <Text style={[styles.heroLabel, { color: theme.primary }]}>
                Central de ajuda
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Como podemos ajudar?
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Envie sua dúvida para o suporte do TaskFlow.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <SupportIcon width={34} height={34} />
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
            <View style={styles.infoIconBox}>
              <TimeIcon width={22} height={22} />
            </View>

            <View style={styles.infoTextArea}>
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Tempo médio de resposta
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                No protótipo, essa ação é simulada. Na versão final, a mensagem
                será enviada para a API de suporte.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Escolha o canal
            </Text>

            <View style={styles.channelsList}>
              {channels.map((channel) => {
                const isSelected = selectedChannel === channel.id;
                const Icon = channel.Icon;

                return (
                  <Pressable
                    key={channel.id}
                    style={[
                      styles.channelCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
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
                          { color: theme.text },
                          isSelected && styles.channelTitleActive,
                        ]}
                      >
                        {channel.title}
                      </Text>

                      <Text
                        style={[
                          styles.channelSubtitle,
                          { color: theme.textSecondary },
                          isSelected && styles.channelSubtitleActive,
                        ]}
                      >
                        {channel.subtitle}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.radio,
                        { borderColor: theme.border },
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
            <Text style={[styles.label, { color: theme.text }]}>
              Assunto
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Ex: Dúvida sobre minha conta"
              placeholderTextColor={theme.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Mensagem
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Descreva sua dúvida ou problema..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              value={message}
              onChangeText={setMessage}
            />
          </View>

          <View
            style={[
              styles.quickHelpCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.quickHelpHeader}>
              <ChatIcon width={22} height={22} />

              <Text style={[styles.quickHelpTitle, { color: theme.text }]}>
                Antes de enviar
              </Text>
            </View>

            <Text style={[styles.quickHelpText, { color: theme.textSecondary }]}>
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
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.cancelButtonText, { color: theme.text }]}>
              Cancelar
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
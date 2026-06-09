import type { ComponentType } from "react";
import { useState } from "react";
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
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import HelpIcon from "../../assets/icons/help_outline.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";

import { styles } from "@/app/styles/companySupport";
import { useTheme } from "@/app/context/ThemeContext";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

type SupportOption = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
  action: () => void;
};

const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "Como publicar um chamado?",
    answer:
      "Acesse o painel da empresa, toque em Criar novo chamado e preencha as informações do serviço, como categoria, local, horário e valor.",
  },
  {
    id: "2",
    question: "Quando o chat é liberado?",
    answer:
      "O chat é liberado após a empresa aceitar um candidato e confirmar o pagamento da taxa da plataforma.",
  },
  {
    id: "3",
    question: "Como funciona a avaliação?",
    answer:
      "Após a conclusão do serviço, empresa e freelancer podem avaliar um ao outro para manter a confiança dentro da plataforma.",
  },
  {
    id: "4",
    question: "Posso cancelar um chamado?",
    answer:
      "No protótipo, o cancelamento ainda é simulado. Na versão final, a empresa poderá cancelar ou editar chamados conforme as regras da plataforma.",
  },
];

export default function CompanySupportScreen() {
  const [selectedFaqId, setSelectedFaqId] = useState<string | null>("1");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const { isDark, theme } = useTheme();

  const supportOptions: SupportOption[] = [
    {
      id: "1",
      title: "Falar com suporte",
      subtitle: "Entre em contato com nossa equipe",
      Icon: SupportIcon,
      action: () => router.push("/support-contact"),
    },
    {
      id: "2",
      title: "Reportar problema",
      subtitle: "Informe erros, bugs ou dificuldades no aplicativo",
      Icon: NotificationIcon,
      action: () => router.push("/company-report-problem"),
    },
    {
      id: "3",
      title: "Central de segurança",
      subtitle: "Orientações sobre confiança, chat e avaliações",
      Icon: LockIcon,
      action: () => router.push("/company-security-center"),
    },
  ];

  function toggleFaq(faqId: string) {
    setSelectedFaqId((currentFaqId) => {
      if (currentFaqId === faqId) {
        return null;
      }

      return faqId;
    });
  }

  function handleSendSupportRequest() {
    console.log({
      subject,
      message,
    });

    setSubject("");
    setMessage("");
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
            Ajuda e suporte
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
                Central TaskFlow
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Como podemos ajudar?
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Tire dúvidas sobre chamados, pagamentos, candidatos, chat e
                avaliações da empresa.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <HelpIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.optionsArea}>
            {supportOptions.map((option) => {
              const Icon = option.Icon;

              return (
                <Pressable
                  key={option.id}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={option.action}
                >
                  <View style={styles.optionIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.optionTextArea}>
                    <Text style={[styles.optionTitle, { color: theme.text }]}>
                      {option.title}
                    </Text>

                    <Text
                      style={[
                        styles.optionSubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {option.subtitle}
                    </Text>
                  </View>

                  <Text style={[styles.optionArrow, { color: theme.textSecondary }]}>
                    ›
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Perguntas frequentes
            </Text>

            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Respostas rápidas para as principais dúvidas da empresa.
            </Text>

            <View style={styles.faqArea}>
              {faqItems.map((faq) => {
                const isOpen = selectedFaqId === faq.id;

                return (
                  <Pressable
                    key={faq.id}
                    style={[
                      styles.faqCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      isOpen && styles.faqCardActive,
                    ]}
                    onPress={() => toggleFaq(faq.id)}
                  >
                    <View style={styles.faqHeader}>
                      <Text style={[styles.faqQuestion, { color: theme.text }]}>
                        {faq.question}
                      </Text>

                      <Text style={[styles.faqIcon, { color: theme.primary }]}>
                        {isOpen ? "−" : "+"}
                      </Text>
                    </View>

                    {isOpen && (
                      <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
                        {faq.answer}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Enviar solicitação
            </Text>

            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Descreva sua dúvida ou problema para o suporte analisar.
            </Text>

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
              placeholder="Ex: Problema com pagamento"
              placeholderTextColor={theme.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />

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
              placeholder="Digite os detalhes da sua solicitação..."
              placeholderTextColor={theme.textSecondary}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
            />

            <Pressable
              style={({ pressed }) => [
                styles.sendButton,
                pressed && styles.sendButtonPressed,
              ]}
              onPress={handleSendSupportRequest}
            >
              <Text style={styles.sendButtonText}>Enviar para suporte</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Atendimento simulado
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Nesta versão do protótipo, o envio para suporte é apenas visual.
              Na versão final, ele poderá ser integrado ao back-end e salvo no
              banco de dados.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
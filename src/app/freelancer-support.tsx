import type { ComponentType } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import HelpIcon from "../../assets/icons/help_outline.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";

import { styles } from "@/app/styles/freelancerSupport";
import { useTheme } from "@/app/context/ThemeContext";

type HelpOption = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
  action: () => void;
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    id: "1",
    question: "Como me candidato a um chamado?",
    answer:
      "Entre nos detalhes do chamado e toque em Solicitar atendimento. Depois disso, a empresa poderá aceitar ou recusar sua candidatura.",
  },
  {
    id: "2",
    question: "Quando o chat é liberado?",
    answer:
      "O chat só é liberado após a empresa aceitar sua candidatura e confirmar o fluxo do chamado.",
  },
  {
    id: "3",
    question: "Como funcionam as avaliações?",
    answer:
      "Após a conclusão do serviço, empresa e freelancer podem avaliar um ao outro. Isso ajuda a construir reputação dentro do TaskFlow.",
  },
  {
    id: "4",
    question: "Como recebo novos chamados?",
    answer:
      "Quando uma empresa publica um chamado próximo da sua região, o app pode enviar uma notificação para freelancers disponíveis.",
  },
];

export default function FreelancerSupportScreen() {
  const { isDark, theme } = useTheme();

  const helpOptions: HelpOption[] = [
    {
      id: "1",
      title: "Falar com suporte",
      subtitle: "Entre em contato com nossa equipe",
      Icon: SupportIcon,
      action: () => router.push("/support-contact"),
    },
    {
      id: "2",
      title: "Problema com chamado",
      subtitle: "Relate erros, cancelamentos ou problemas no serviço",
      Icon: AssignmentIcon,
      action: () => router.push("/support-job-issue"),
    },
    {
      id: "3",
      title: "Problema com pagamento",
      subtitle: "Dúvidas sobre taxas, cobranças ou reembolsos",
      Icon: CreditCardIcon,
      action: () => router.push("/support-payment-issue"),
    },
    {
      id: "4",
      title: "Segurança da conta",
      subtitle: "Ajuda com acesso, login e proteção da conta",
      Icon: LockIcon,
      action: () => router.push("/support-account-security"),
    },
  ];

  function handleCreateTicket() {
    Alert.alert(
      "Atendimento criado",
      "Seu pedido de suporte foi registrado no protótipo."
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
              Central do freelancer
            </Text>

            <Text style={[styles.heroTitle, { color: theme.text }]}>
              Como podemos ajudar?
            </Text>

            <Text style={[styles.heroText, { color: theme.textSecondary }]}>
              Tire dúvidas sobre chamados, candidaturas, chat, avaliações e
              segurança.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <HelpIcon width={34} height={34} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Atendimento rápido
          </Text>

          <View style={styles.optionsArea}>
            {helpOptions.map((option) => {
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
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Dúvidas frequentes
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Veja respostas rápidas para as principais dúvidas sobre o uso do app.
          </Text>

          <View style={styles.faqArea}>
            {faqItems.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.faqCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.faqQuestion, { color: theme.text }]}>
                  {item.question}
                </Text>

                <Text style={[styles.faqAnswer, { color: theme.textSecondary }]}>
                  {item.answer}
                </Text>
              </View>
            ))}
          </View>
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
            Segurança no TaskFlow
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Para proteger as duas partes, o chat só é liberado após o aceite da
            empresa e confirmação do fluxo. Ao final do serviço, ambos podem se
            avaliar.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleCreateTicket}
        >
          <Text style={styles.primaryButtonText}>
            Abrir solicitação de suporte
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
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
import { styles } from "@/app/styles/freelancerSupport";

type HelpOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
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
  const helpOptions: HelpOption[] = [
    {
      id: "1",
      title: "Falar com suporte",
      subtitle: "Abrir atendimento com a equipe TaskFlow",
      icon: "💬",
      action: () =>
        Alert.alert(
          "Suporte",
          "No protótipo, essa opção apenas simula a abertura de um atendimento."
        ),
    },
    {
      id: "2",
      title: "Problema com chamado",
      subtitle: "Informar erro ou dúvida sobre uma solicitação",
      icon: "📋",
      action: () =>
        Alert.alert(
          "Chamado",
          "Na versão final, você poderá informar problemas relacionados a um serviço."
        ),
    },
    {
      id: "3",
      title: "Problema com pagamento",
      subtitle: "Dúvidas sobre taxa, recebimento ou confirmação",
      icon: "💳",
      action: () =>
        Alert.alert(
          "Pagamento",
          "Na versão final, essa área terá histórico e suporte financeiro."
        ),
    },
    {
      id: "4",
      title: "Segurança da conta",
      subtitle: "Ajuda com acesso, senha e privacidade",
      icon: "🛡️",
      action: () =>
        Alert.alert(
          "Segurança",
          "Na versão final, essa área terá recuperação de conta e orientações de segurança."
        ),
    },
  ];

  function handleCreateTicket() {
    Alert.alert(
      "Atendimento criado",
      "Seu pedido de suporte foi registrado no protótipo."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Ajuda e suporte</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Central do freelancer</Text>
            <Text style={styles.heroTitle}>Como podemos ajudar?</Text>
            <Text style={styles.heroText}>
              Tire dúvidas sobre chamados, candidaturas, chat, avaliações e
              segurança.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <Text style={styles.heroIcon}>❔</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atendimento rápido</Text>

          <View style={styles.optionsArea}>
            {helpOptions.map((option) => (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.optionCard,
                  pressed && styles.optionCardPressed,
                ]}
                onPress={option.action}
              >
                <View style={styles.optionIconBox}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>

                <Text style={styles.optionArrow}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dúvidas frequentes</Text>

          <Text style={styles.sectionSubtitle}>
            Veja respostas rápidas para as principais dúvidas sobre o uso do app.
          </Text>

          <View style={styles.faqArea}>
            {faqItems.map((item) => (
              <View key={item.id} style={styles.faqCard}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Segurança no TaskFlow</Text>

          <Text style={styles.infoText}>
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
          <Text style={styles.primaryButtonText}>Abrir solicitação de suporte</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
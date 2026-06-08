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
import LockIcon from "../../assets/icons/lock-icon.svg";
import CheckIcon from "../../assets/icons/check.svg";
import ChatIcon from "../../assets/icons/chat.svg";
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import StarIcon from "../../assets/icons/star_border.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import SettingsIcon from "../../assets/icons/settings.svg";

import { styles } from "@/app/styles/companySecurityCenter";

const securityTips = [
  {
    id: "1",
    title: "Confirme os dados do freelancer",
    description:
      "Antes de aceitar uma candidatura, confira perfil, habilidades, avaliações e histórico do profissional.",
    icon: "👤",
  },
  {
    id: "2",
    title: "Use o chat da plataforma",
    description:
      "Combine detalhes importantes pelo chat do TaskFlow para manter o histórico da conversa registrado.",
    icon: "💬",
  },
  {
    id: "3",
    title: "Evite pagamentos externos",
    description:
      "Para maior segurança, utilize os fluxos oficiais de pagamento e confirmação dentro da plataforma.",
    icon: "💳",
  },
  {
    id: "4",
    title: "Avalie após o serviço",
    description:
      "A avaliação ajuda outros usuários e fortalece a confiança entre empresas e freelancers.",
    icon: "⭐",
  },
];

const securityFeatures = [
  {
    id: "1",
    title: "Chat liberado após confirmação",
    subtitle:
      "A conversa é liberada somente após o aceite e avanço correto do chamado.",
    icon: <ChatIcon width={22} height={22} />,
  },
  {
    id: "2",
    title: "Avaliações mútuas",
    subtitle:
      "Empresa e freelancer podem se avaliar após a conclusão do serviço.",
    icon: <StarIcon width={22} height={22} />,
  },
  {
    id: "3",
    title: "Fluxo de pagamento controlado",
    subtitle:
      "A taxa da plataforma e pagamentos ficam organizados no fluxo do chamado.",
    icon: <CreditCardIcon width={22} height={22} />,
  },
  {
    id: "4",
    title: "Suporte para problemas",
    subtitle:
      "A empresa pode reportar erros, dúvidas ou situações de risco pelo suporte.",
    icon: <SupportIcon width={22} height={22} />,
  },
];

export default function CompanySecurityCenterScreen() {
  function handleReportSecurityIssue() {
    Alert.alert(
      "Central de segurança",
      "Para reportar um problema de segurança, use a opção Falar com suporte ou Reportar problema."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Central de segurança</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Empresa protegida</Text>
            <Text style={styles.heroTitle}>Contrate com mais segurança</Text>
            <Text style={styles.heroText}>
              Veja orientações para proteger sua empresa durante a contratação.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <LockIcon width={34} height={34} />
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusIconBox}>
            <CheckIcon width={24} height={24} />
          </View>

          <View style={styles.statusTextArea}>
            <Text style={styles.statusTitle}>Conta empresarial ativa</Text>
            <Text style={styles.statusText}>
              Sua empresa está apta para publicar chamados, avaliar candidatos e
              acompanhar contratações pelo TaskFlow.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Boas práticas</Text>

          <View style={styles.tipsList}>
            {securityTips.map((tip) => (
              <View key={tip.id} style={styles.tipCard}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>

                <View style={styles.tipTextArea}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos de segurança</Text>

          <View style={styles.featuresList}>
            {securityFeatures.map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={styles.featureIconBox}>{feature.icon}</View>

                <View style={styles.featureTextArea}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureSubtitle}>
                    {feature.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Atenção em contratações</Text>

          <Text style={styles.warningText}>
            Evite compartilhar dados sensíveis fora da plataforma. Caso perceba
            comportamento suspeito, registre o problema pelo suporte para análise.
          </Text>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Ações rápidas</Text>

          <Pressable
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
            onPress={() => router.push("/change-password")}
          >
            <View style={styles.actionIconBox}>
              <LockIcon width={20} height={20} />
            </View>

            <View style={styles.actionTextArea}>
              <Text style={styles.actionTitle}>Alterar senha</Text>
              <Text style={styles.actionSubtitle}>
                Atualize sua senha de acesso
              </Text>
            </View>

            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
            onPress={() => router.push("/privacy-security")}
          >
            <View style={styles.actionIconBox}>
              <SettingsIcon width={20} height={20} />
            </View>

            <View style={styles.actionTextArea}>
              <Text style={styles.actionTitle}>Privacidade e segurança</Text>
              <Text style={styles.actionSubtitle}>
                Gerencie permissões da conta
              </Text>
            </View>

            <Text style={styles.actionArrow}>›</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionItem,
              pressed && styles.actionItemPressed,
            ]}
            onPress={() => router.push("/support-contact")}
          >
            <View style={styles.actionIconBox}>
              <SupportIcon width={20} height={20} />
            </View>

            <View style={styles.actionTextArea}>
              <Text style={styles.actionTitle}>Falar com suporte</Text>
              <Text style={styles.actionSubtitle}>
                Entre em contato com a equipe
              </Text>
            </View>

            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleReportSecurityIssue}
        >
          <Text style={styles.primaryButtonText}>Reportar situação suspeita</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/terms")}
        >
          <Text style={styles.secondaryButtonText}>Ver termos e políticas</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
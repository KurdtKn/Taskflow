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
import LockIcon from "../../assets/icons/lock-icon.svg";
import CheckIcon from "../../assets/icons/check.svg";
import ChatIcon from "../../assets/icons/chat.svg";
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import StarIcon from "../../assets/icons/star_border.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import SettingsIcon from "../../assets/icons/settings.svg";

import { styles } from "@/app/styles/companySecurityCenter";
import { useTheme } from "@/app/context/ThemeContext";

type SecurityTip = {
  id: string;
  title: string;
  description: string;
  Icon: ComponentType<any>;
};

type SecurityFeature = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

const securityTips: SecurityTip[] = [
  {
    id: "1",
    title: "Confirme os dados do freelancer",
    description:
      "Antes de aceitar uma candidatura, confira perfil, habilidades, avaliações e histórico do profissional.",
    Icon: SupportIcon,
  },
  {
    id: "2",
    title: "Use o chat da plataforma",
    description:
      "Combine detalhes importantes pelo chat do TaskFlow para manter o histórico da conversa registrado.",
    Icon: ChatIcon,
  },
  {
    id: "3",
    title: "Evite pagamentos externos",
    description:
      "Para maior segurança, utilize os fluxos oficiais de pagamento e confirmação dentro da plataforma.",
    Icon: CreditCardIcon,
  },
  {
    id: "4",
    title: "Avalie após o serviço",
    description:
      "A avaliação ajuda outros usuários e fortalece a confiança entre empresas e freelancers.",
    Icon: StarIcon,
  },
];

const securityFeatures: SecurityFeature[] = [
  {
    id: "1",
    title: "Chat liberado após confirmação",
    subtitle:
      "A conversa é liberada somente após o aceite e avanço correto do chamado.",
    Icon: ChatIcon,
  },
  {
    id: "2",
    title: "Avaliações mútuas",
    subtitle:
      "Empresa e freelancer podem se avaliar após a conclusão do serviço.",
    Icon: StarIcon,
  },
  {
    id: "3",
    title: "Fluxo de pagamento controlado",
    subtitle:
      "A taxa da plataforma e pagamentos ficam organizados no fluxo do chamado.",
    Icon: CreditCardIcon,
  },
  {
    id: "4",
    title: "Suporte para problemas",
    subtitle:
      "A empresa pode reportar erros, dúvidas ou situações de risco pelo suporte.",
    Icon: SupportIcon,
  },
];

export default function CompanySecurityCenterScreen() {
  const { isDark, theme } = useTheme();

  function handleReportSecurityIssue() {
    Alert.alert(
      "Central de segurança",
      "Para reportar um problema de segurança, use a opção Falar com suporte ou Reportar problema."
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
          Central de segurança
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
              Empresa protegida
            </Text>

            <Text style={[styles.heroTitle, { color: theme.text }]}>
              Contrate com mais segurança
            </Text>

            <Text style={[styles.heroText, { color: theme.textSecondary }]}>
              Veja orientações para proteger sua empresa durante a contratação.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <LockIcon width={34} height={34} />
          </View>
        </View>

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.statusIconBox}>
            <CheckIcon width={24} height={24} />
          </View>

          <View style={styles.statusTextArea}>
            <Text style={[styles.statusTitle, { color: theme.text }]}>
              Conta empresarial ativa
            </Text>

            <Text style={[styles.statusText, { color: theme.textSecondary }]}>
              Sua empresa está apta para publicar chamados, avaliar candidatos e
              acompanhar contratações pelo TaskFlow.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Boas práticas
          </Text>

          <View style={styles.tipsList}>
            {securityTips.map((tip) => {
              const Icon = tip.Icon;

              return (
                <View
                  key={tip.id}
                  style={[
                    styles.tipCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.tipIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.tipTextArea}>
                    <Text style={[styles.tipTitle, { color: theme.text }]}>
                      {tip.title}
                    </Text>

                    <Text
                      style={[
                        styles.tipDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {tip.description}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recursos de segurança
          </Text>

          <View style={styles.featuresList}>
            {securityFeatures.map((feature) => {
              const Icon = feature.Icon;

              return (
                <View
                  key={feature.id}
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.featureIconBox}>
                    <Icon width={22} height={22} />
                  </View>

                  <View style={styles.featureTextArea}>
                    <Text style={[styles.featureTitle, { color: theme.text }]}>
                      {feature.title}
                    </Text>

                    <Text
                      style={[
                        styles.featureSubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {feature.subtitle}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.warningTitle, { color: theme.text }]}>
            Atenção em contratações
          </Text>

          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            Evite compartilhar dados sensíveis fora da plataforma. Caso perceba
            comportamento suspeito, registre o problema pelo suporte para análise.
          </Text>
        </View>

        <View
          style={[
            styles.actionsCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.actionsTitle, { color: theme.text }]}>
            Ações rápidas
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.actionItem,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
              pressed && styles.actionItemPressed,
            ]}
            onPress={() => router.push("/change-password")}
          >
            <View style={styles.actionIconBox}>
              <LockIcon width={20} height={20} />
            </View>

            <View style={styles.actionTextArea}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                Alterar senha
              </Text>

              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                Atualize sua senha de acesso
              </Text>
            </View>

            <Text style={[styles.actionArrow, { color: theme.textSecondary }]}>
              ›
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionItem,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
              pressed && styles.actionItemPressed,
            ]}
            onPress={() => router.push("/privacy-security")}
          >
            <View style={styles.actionIconBox}>
              <SettingsIcon width={20} height={20} />
            </View>

            <View style={styles.actionTextArea}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                Privacidade e segurança
              </Text>

              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                Gerencie permissões da conta
              </Text>
            </View>

            <Text style={[styles.actionArrow, { color: theme.textSecondary }]}>
              ›
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionItem,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
              pressed && styles.actionItemPressed,
            ]}
            onPress={() => router.push("/support-contact")}
          >
            <View style={styles.actionIconBox}>
              <SupportIcon width={20} height={20} />
            </View>

            <View style={styles.actionTextArea}>
              <Text style={[styles.actionTitle, { color: theme.text }]}>
                Falar com suporte
              </Text>

              <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>
                Entre em contato com a equipe
              </Text>
            </View>

            <Text style={[styles.actionArrow, { color: theme.textSecondary }]}>
              ›
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleReportSecurityIssue}
        >
          <Text style={styles.primaryButtonText}>
            Reportar situação suspeita
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/terms")}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Ver termos e políticas
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { styles } from "@/app/styles/supportContact";
import { useTheme } from "@/app/context/ThemeContext";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import SendIcon from "../../assets/icons/send.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";

const supportEmail = "empresa@taskflow.com";
const supportPhone = "(15) 99123-4567";

export default function SupportJobIssueScreen() {
  const { isDark, theme } = useTheme();

  function handleOpenEmail() {
    Linking.openURL(`mailto:${supportEmail}`);
  }

  function handleOpenPhone() {
    const phoneNumber = supportPhone.replace(/\D/g, "");
    Linking.openURL(`tel:${phoneNumber}`);
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.keyboardArea}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Contato do suporte
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
                Suporte TaskFlow
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Precisa de ajuda?
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Entre em contato com nossa equipe pelos canais abaixo.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <SupportIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Canais de atendimento
            </Text>

            <View style={styles.issueList}>
              <Pressable
                style={({ pressed }) => [
                  styles.issueCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleOpenEmail}
              >
                <View
                  style={[
                    styles.issueIconBox,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <SendIcon width={24} height={24} />
                </View>

                <View style={styles.issueTextArea}>
                  <Text style={[styles.issueTitle, { color: theme.text }]}>
                    E-mail de contato
                  </Text>

                  <Text
                    style={[
                      styles.issueSubtitle,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {supportEmail}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.issueCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleOpenPhone}
              >
                <View
                  style={[
                    styles.issueIconBox,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <SupportIcon width={24} height={24} />
                </View>

                <View style={styles.issueTextArea}>
                  <Text style={[styles.issueTitle, { color: theme.text }]}>
                    Número de suporte
                  </Text>

                  <Text
                    style={[
                      styles.issueSubtitle,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {supportPhone}
                  </Text>
                </View>
              </Pressable>
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
              Atendimento
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Use estes canais para dúvidas sobre conta, chamados, pagamentos ou
              problemas na plataforma.
            </Text>
          </View>

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
              Voltar
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
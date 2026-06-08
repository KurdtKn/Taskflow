import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import CheckIcon from "../../assets/icons/check.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";
import SendIcon from "../../assets/icons/send.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";

import { colors } from "@/styles/colors";
import { styles } from "@/app/styles/supportAccountSecurity";

const securityIssues = [
  {
    id: "login",
    title: "Problema de login",
    subtitle: "Não consigo acessar minha conta",
    icon: "🔐",
  },
  {
    id: "suspeita",
    title: "Acesso suspeito",
    subtitle: "Acredito que alguém acessou minha conta",
    icon: "⚠️",
  },
  {
    id: "dados",
    title: "Dados alterados",
    subtitle: "Minhas informações foram modificadas",
    icon: "📝",
  },
  {
    id: "bloqueio",
    title: "Conta bloqueada",
    subtitle: "Minha conta foi limitada ou bloqueada",
    icon: "🚫",
  },
] as const;

type SecurityIssueType = (typeof securityIssues)[number]["id"];

export default function SupportAccountSecurityScreen() {
  const [selectedIssue, setSelectedIssue] =
    useState<SecurityIssueType>("login");

  const [urgentAlert, setUrgentAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [lastAccess, setLastAccess] = useState("");
  const [description, setDescription] = useState("");

  function handleSendSecurityIssue() {
    if (!email.trim() || !description.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe seu e-mail e descreva o problema para continuar."
      );
      return;
    }

    Alert.alert(
      "Solicitação enviada",
      "Sua solicitação de segurança foi registrada. O suporte irá analisar sua conta.",
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

          <Text style={styles.headerTitle}>Segurança da conta</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Proteção da conta</Text>
              <Text style={styles.heroTitle}>Relate um risco</Text>
              <Text style={styles.heroText}>
                Informe problemas de acesso, login suspeito ou alterações não
                reconhecidas.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <LockIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.warningBox}>
            <View style={styles.warningHeader}>
              <NotificationIcon width={22} height={22} />
              <Text style={styles.warningTitle}>Atenção</Text>
            </View>

            <Text style={styles.warningText}>
              Caso perceba acesso estranho, altere sua senha e evite compartilhar
              códigos de verificação com terceiros.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de problema</Text>

            <View style={styles.issueList}>
              {securityIssues.map((issue) => {
                const isSelected = selectedIssue === issue.id;

                return (
                  <Pressable
                    key={issue.id}
                    style={[
                      styles.issueCard,
                      isSelected && styles.issueCardActive,
                    ]}
                    onPress={() => setSelectedIssue(issue.id)}
                  >
                    <Text style={styles.issueIcon}>{issue.icon}</Text>

                    <View style={styles.issueTextArea}>
                      <Text
                        style={[
                          styles.issueTitle,
                          isSelected && styles.issueTitleActive,
                        ]}
                      >
                        {issue.title}
                      </Text>

                      <Text
                        style={[
                          styles.issueSubtitle,
                          isSelected && styles.issueSubtitleActive,
                        ]}
                      >
                        {issue.subtitle}
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
            <Text style={styles.label}>E-mail da conta</Text>

            <TextInput
              style={styles.input}
              placeholder="Digite o e-mail cadastrado"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Último acesso reconhecido</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Hoje pela manhã, ontem à noite..."
              placeholderTextColor="#9CA3AF"
              value={lastAccess}
              onChangeText={setLastAccess}
            />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.switchIconBox}>
              <CheckIcon width={22} height={22} />
            </View>

            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Marcar como urgente</Text>
              <Text style={styles.switchSubtitle}>
                Use se houver suspeita real de invasão ou perda de acesso.
              </Text>
            </View>

            <Switch
              value={urgentAlert}
              onValueChange={setUrgentAlert}
              trackColor={{
                false: colors.border,
                true: "rgba(220,38,38,0.28)",
              }}
              thumbColor={urgentAlert ? colors.danger : "#F9FAFB"}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Descreva o problema</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Explique o que aconteceu com sua conta..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <SupportIcon width={22} height={22} />
              <Text style={styles.infoTitle}>Análise de segurança</Text>
            </View>

            <Text style={styles.infoText}>
              No protótipo, o envio é simulado. Na versão final, essa solicitação
              será enviada para a API e analisada pelo suporte.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSendSecurityIssue}
          >
            <SendIcon width={20} height={20} />
            <Text style={styles.sendButtonText}>Enviar solicitação</Text>
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
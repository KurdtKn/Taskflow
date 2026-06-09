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
import CreditCardIcon from "../../assets/icons/credit_card.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";
import SendIcon from "../../assets/icons/send.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import CrossIcon from "../../assets/icons/cross.svg";

import { styles } from "@/app/styles/supportPaymentIssue";
import { useTheme } from "@/app/context/ThemeContext";

type PaymentIssueType = "taxa" | "pix" | "cartao" | "reembolso";
type PaymentMethod = "pix" | "card" | "wallet";

type PaymentIssue = {
  id: PaymentIssueType;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

const paymentIssues: PaymentIssue[] = [
  {
    id: "taxa",
    title: "Taxa da plataforma",
    subtitle: "Dúvida ou erro na cobrança da taxa",
    Icon: CreditCardIcon,
  },
  {
    id: "pix",
    title: "Pagamento via Pix",
    subtitle: "Problema com QR Code, chave ou confirmação",
    Icon: WalletIcon,
  },
  {
    id: "cartao",
    title: "Cartão recusado",
    subtitle: "Falha ao pagar usando cartão de crédito",
    Icon: CreditCardIcon,
  },
  {
    id: "reembolso",
    title: "Reembolso",
    subtitle: "Solicitação ou dúvida sobre devolução de valor",
    Icon: CrossIcon,
  },
];

export default function SupportPaymentIssueScreen() {
  const [selectedIssue, setSelectedIssue] =
    useState<PaymentIssueType>("taxa");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [jobTitle, setJobTitle] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentValue, setPaymentValue] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [description, setDescription] = useState("");

  const { isDark, theme } = useTheme();

  function handleSendPaymentIssue() {
    if (!jobTitle.trim() || !paymentValue.trim() || !description.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe o chamado, o valor e descreva o problema para continuar."
      );
      return;
    }

    Alert.alert(
      "Problema registrado",
      "Sua solicitação sobre pagamento foi enviada para análise do suporte.",
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
            Problema com pagamento
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
                Suporte financeiro
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Ajuda com pagamento
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Relate cobranças, taxas, Pix, cartão ou reembolsos.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <CreditCardIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tipo de problema
            </Text>

            <View style={styles.issueList}>
              {paymentIssues.map((issue) => {
                const isSelected = selectedIssue === issue.id;
                const Icon = issue.Icon;

                return (
                  <Pressable
                    key={issue.id}
                    style={[
                      styles.issueCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      isSelected && styles.issueCardActive,
                    ]}
                    onPress={() => setSelectedIssue(issue.id)}
                  >
                    <View style={styles.issueIconBox}>
                      <Icon width={24} height={24} />
                    </View>

                    <View style={styles.issueTextArea}>
                      <Text
                        style={[
                          styles.issueTitle,
                          { color: theme.text },
                          isSelected && styles.issueTitleActive,
                        ]}
                      >
                        {issue.title}
                      </Text>

                      <Text
                        style={[
                          styles.issueSubtitle,
                          { color: theme.textSecondary },
                          isSelected && styles.issueSubtitleActive,
                        ]}
                      >
                        {issue.subtitle}
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
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Forma de pagamento
            </Text>

            <View style={styles.paymentMethods}>
              <Pressable
                style={[
                  styles.paymentMethod,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  paymentMethod === "pix" && styles.paymentMethodActive,
                ]}
                onPress={() => setPaymentMethod("pix")}
              >
                <WalletIcon width={24} height={24} />

                <Text
                  style={[
                    styles.paymentMethodText,
                    { color: theme.textSecondary },
                    paymentMethod === "pix" && styles.paymentMethodTextActive,
                  ]}
                >
                  Pix
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.paymentMethod,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  paymentMethod === "card" && styles.paymentMethodActive,
                ]}
                onPress={() => setPaymentMethod("card")}
              >
                <CreditCardIcon width={24} height={24} />

                <Text
                  style={[
                    styles.paymentMethodText,
                    { color: theme.textSecondary },
                    paymentMethod === "card" && styles.paymentMethodTextActive,
                  ]}
                >
                  Cartão
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.paymentMethod,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  paymentMethod === "wallet" && styles.paymentMethodActive,
                ]}
                onPress={() => setPaymentMethod("wallet")}
              >
                <WalletIcon width={24} height={24} />

                <Text
                  style={[
                    styles.paymentMethodText,
                    { color: theme.textSecondary },
                    paymentMethod === "wallet" &&
                      styles.paymentMethodTextActive,
                  ]}
                >
                  Carteira
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Chamado relacionado
            </Text>

            <View
              style={[
                styles.inputWithIcon,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <AssignmentIcon width={20} height={20} />

              <TextInput
                style={[styles.inputInside, { color: theme.text }]}
                placeholder="Ex: Garçom para Evento"
                placeholderTextColor={theme.textSecondary}
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>
          </View>

          <View style={styles.twoColumns}>
            <View style={styles.columnItem}>
              <Text style={[styles.label, { color: theme.text }]}>
                Valor
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
                placeholder="R$ 200,00"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={paymentValue}
                onChangeText={setPaymentValue}
              />
            </View>

            <View style={styles.columnItem}>
              <Text style={[styles.label, { color: theme.text }]}>
                Data
              </Text>

              <View
                style={[
                  styles.inputWithIcon,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <CalendarIcon width={18} height={18} />

                <TextInput
                  style={[styles.inputInside, { color: theme.text }]}
                  placeholder="Hoje"
                  placeholderTextColor={theme.textSecondary}
                  value={paymentDate}
                  onChangeText={setPaymentDate}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Código da transação
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
              placeholder="Ex: TX-123456 ou ID do pagamento"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="characters"
              value={transactionCode}
              onChangeText={setTransactionCode}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Descreva o problema
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
              placeholder="Explique o que aconteceu com o pagamento..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
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
              Importante
            </Text>

            <Text style={[styles.warningText, { color: theme.textSecondary }]}>
              Guarde comprovantes, prints e dados da transação. Na versão final,
              esses anexos poderão ser enviados junto da solicitação.
            </Text>
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
            <View style={styles.infoHeader}>
              <SupportIcon width={22} height={22} />

              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Análise financeira
              </Text>
            </View>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              No protótipo, o envio é simulado. Depois, essa solicitação será
              enviada para a API e vinculada ao pagamento no banco.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSendPaymentIssue}
          >
            <SendIcon width={20} height={20} />
            <Text style={styles.sendButtonText}>Enviar problema</Text>
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
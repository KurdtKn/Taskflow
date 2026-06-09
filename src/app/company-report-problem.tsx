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
import SendIcon from "../../assets/icons/send.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";

import { styles } from "@/app/styles/companyReportProblem";
import { useTheme } from "@/app/context/ThemeContext";

type ProblemType = "bug" | "chamado" | "candidato" | "outro";
type PriorityType = "baixa" | "media" | "alta";

type ProblemOption = {
  id: ProblemType;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

const problemTypes: ProblemOption[] = [
  {
    id: "bug",
    title: "Erro no aplicativo",
    subtitle: "Tela travando, botão não funcionando ou erro visual",
    Icon: NotificationIcon,
  },
  {
    id: "chamado",
    title: "Erro em chamado",
    subtitle: "Problema ao criar, editar ou acompanhar um chamado",
    Icon: AssignmentIcon,
  },
  {
    id: "candidato",
    title: "Erro com candidato",
    subtitle: "Problema ao visualizar, aceitar ou recusar candidatos",
    Icon: SupportIcon,
  },
  {
    id: "outro",
    title: "Outro problema",
    subtitle: "Informe uma dificuldade diferente das opções acima",
    Icon: SettingsIcon,
  },
];

export default function CompanyReportProblemScreen() {
  const [selectedProblem, setSelectedProblem] = useState<ProblemType>("bug");
  const [priority, setPriority] = useState<PriorityType>("media");
  const [screenName, setScreenName] = useState("");
  const [description, setDescription] = useState("");

  const { isDark, theme } = useTheme();

  function handleSendReport() {
    if (!screenName.trim() || !description.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe onde aconteceu o problema e descreva o ocorrido."
      );
      return;
    }

    Alert.alert(
      "Problema reportado",
      "Sua solicitação foi enviada para o suporte da empresa. No protótipo, essa ação é simulada.",
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
            Reportar problema
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
                Suporte da empresa
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Encontrou um erro?
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Informe bugs, dificuldades ou falhas encontradas no aplicativo.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <SupportIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tipo de problema
            </Text>

            <View style={styles.problemList}>
              {problemTypes.map((problem) => {
                const isSelected = selectedProblem === problem.id;
                const Icon = problem.Icon;

                return (
                  <Pressable
                    key={problem.id}
                    style={[
                      styles.problemCard,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      isSelected && styles.problemCardActive,
                    ]}
                    onPress={() => setSelectedProblem(problem.id)}
                  >
                    <View style={styles.problemIconBox}>
                      <Icon width={24} height={24} />
                    </View>

                    <View style={styles.problemTextArea}>
                      <Text
                        style={[
                          styles.problemTitle,
                          { color: theme.text },
                          isSelected && styles.problemTitleActive,
                        ]}
                      >
                        {problem.title}
                      </Text>

                      <Text
                        style={[
                          styles.problemSubtitle,
                          { color: theme.textSecondary },
                          isSelected && styles.problemSubtitleActive,
                        ]}
                      >
                        {problem.subtitle}
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
              Onde aconteceu?
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
              placeholder="Ex: Criar chamado, candidatos, pagamentos..."
              placeholderTextColor={theme.textSecondary}
              value={screenName}
              onChangeText={setScreenName}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Prioridade
            </Text>

            <View style={styles.priorityRow}>
              <Pressable
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  priority === "baixa" && styles.priorityChipActive,
                ]}
                onPress={() => setPriority("baixa")}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: theme.textSecondary },
                    priority === "baixa" && styles.priorityTextActive,
                  ]}
                >
                  Baixa
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  priority === "media" && styles.priorityChipActive,
                ]}
                onPress={() => setPriority("media")}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: theme.textSecondary },
                    priority === "media" && styles.priorityTextActive,
                  ]}
                >
                  Média
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  priority === "alta" && styles.priorityChipDanger,
                ]}
                onPress={() => setPriority("alta")}
              >
                <Text
                  style={[
                    styles.priorityText,
                    { color: theme.textSecondary },
                    priority === "alta" && styles.priorityTextDanger,
                  ]}
                >
                  Alta
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Descrição do problema
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
              placeholder="Explique o que aconteceu, quando ocorreu e o que você tentou fazer..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
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
              <SettingsIcon width={22} height={22} />
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Análise do suporte
              </Text>
            </View>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Na versão final, esse relatório será enviado para a API e poderá
              ficar vinculado à conta da empresa para acompanhamento.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSendReport}
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
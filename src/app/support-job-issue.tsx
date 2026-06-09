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
import AssignmentIcon from "../../assets/icons/assignment.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import CalendarIcon from "../../assets/icons/calendar.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import EditIcon from "../../assets/icons/edit.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";

import { styles } from "@/app/styles/supportJobIssue";
import { useTheme } from "@/app/context/ThemeContext";

type IssueType = "cancelamento" | "candidato" | "informacoes" | "andamento";
type PriorityType = "baixa" | "media" | "alta";

type IssueOption = {
  id: IssueType;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
};

const issueTypes: IssueOption[] = [
  {
    id: "cancelamento",
    title: "Cancelamento",
    subtitle: "Problemas para cancelar ou remarcar um chamado",
    Icon: CalendarIcon,
  },
  {
    id: "candidato",
    title: "Candidato ou empresa",
    subtitle: "Dúvidas sobre aceite, recusa ou perfil",
    Icon: SupportIcon,
  },
  {
    id: "informacoes",
    title: "Informações incorretas",
    subtitle: "Local, horário, valor ou descrição com erro",
    Icon: EditIcon,
  },
  {
    id: "andamento",
    title: "Andamento do serviço",
    subtitle: "Problema durante a execução do chamado",
    Icon: NotificationIcon,
  },
];

export default function SupportJobIssueScreen() {
  const [selectedIssue, setSelectedIssue] =
    useState<IssueType>("cancelamento");

  const [priority, setPriority] = useState<PriorityType>("media");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [description, setDescription] = useState("");

  const { isDark, theme } = useTheme();

  function handleSendIssue() {
    if (!jobTitle.trim() || !description.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Informe o chamado e descreva o problema para continuar."
      );
      return;
    }

    Alert.alert(
      "Problema registrado",
      "Sua solicitação sobre o chamado foi registrada. O suporte irá analisar o caso.",
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
            Problema com chamado
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
                Relate um problema
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Informe o que aconteceu para que o suporte acompanhe o chamado.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <AssignmentIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Tipo de problema
            </Text>

            <View style={styles.issueList}>
              {issueTypes.map((issue) => {
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
                    <View
                      style={[
                        styles.issueIconBox,
                        {
                          backgroundColor: theme.inputBackground,
                          borderColor: theme.border,
                        },
                      ]}
                    >
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
            <Text style={[styles.label, { color: theme.text }]}>
              Nome do chamado
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
                style={[styles.input, { color: theme.text }]}
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
                Data
              </Text>

              <View
                style={[
                  styles.smallInputWithIcon,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <CalendarIcon width={18} height={18} />

                <TextInput
                  style={[styles.smallInput, { color: theme.text }]}
                  placeholder="Hoje"
                  placeholderTextColor={theme.textSecondary}
                  value={jobDate}
                  onChangeText={setJobDate}
                />
              </View>
            </View>

            <View style={styles.columnItem}>
              <Text style={[styles.label, { color: theme.text }]}>
                Local
              </Text>

              <View
                style={[
                  styles.smallInputWithIcon,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <LocationIcon width={18} height={18} />

                <TextInput
                  style={[styles.smallInput, { color: theme.text }]}
                  placeholder="Centro"
                  placeholderTextColor={theme.textSecondary}
                  value={jobLocation}
                  onChangeText={setJobLocation}
                />
              </View>
            </View>
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
              placeholder="Explique o que aconteceu com o chamado..."
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
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Como o suporte analisa?
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              O suporte poderá verificar as informações do chamado, mensagens,
              candidatura e status para entender o problema relatado.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSendIssue}
          >
            <Text style={styles.sendButtonText}>Enviar solicitação</Text>
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
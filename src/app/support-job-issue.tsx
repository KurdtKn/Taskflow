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
import SendIcon from "../../assets/icons/send.svg";
import SupportIcon from "../../assets/icons/support_agent.svg";
import EditIcon from "../../assets/icons/edit.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";

import { styles } from "@/app/styles/supportJobIssue";

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

          <Text style={styles.headerTitle}>Problema com chamado</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Suporte TaskFlow</Text>
              <Text style={styles.heroTitle}>Relate um problema</Text>
              <Text style={styles.heroText}>
                Informe o que aconteceu para que o suporte acompanhe o chamado.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <AssignmentIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de problema</Text>

            <View style={styles.issueList}>
              {issueTypes.map((issue) => {
                const isSelected = selectedIssue === issue.id;
                const Icon = issue.Icon;

                return (
                  <Pressable
                    key={issue.id}
                    style={[
                      styles.issueCard,
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
            <Text style={styles.label}>Nome do chamado</Text>

            <View style={styles.inputWithIcon}>
              <AssignmentIcon width={20} height={20} />

              <TextInput
                style={styles.input}
                placeholder="Ex: Garçom para Evento"
                placeholderTextColor="#9CA3AF"
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>
          </View>

          <View style={styles.twoColumns}>
            <View style={styles.columnItem}>
              <Text style={styles.label}>Data</Text>

              <View style={styles.smallInputWithIcon}>
                <CalendarIcon width={18} height={18} />

                <TextInput
                  style={styles.smallInput}
                  placeholder="Hoje"
                  placeholderTextColor="#9CA3AF"
                  value={jobDate}
                  onChangeText={setJobDate}
                />
              </View>
            </View>

            <View style={styles.columnItem}>
              <Text style={styles.label}>Local</Text>

              <View style={styles.smallInputWithIcon}>
                <LocationIcon width={18} height={18} />

                <TextInput
                  style={styles.smallInput}
                  placeholder="Centro"
                  placeholderTextColor="#9CA3AF"
                  value={jobLocation}
                  onChangeText={setJobLocation}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prioridade</Text>

            <View style={styles.priorityRow}>
              <Pressable
                style={[
                  styles.priorityChip,
                  priority === "baixa" && styles.priorityChipActive,
                ]}
                onPress={() => setPriority("baixa")}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === "baixa" && styles.priorityTextActive,
                  ]}
                >
                  Baixa
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.priorityChip,
                  priority === "media" && styles.priorityChipActive,
                ]}
                onPress={() => setPriority("media")}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === "media" && styles.priorityTextActive,
                  ]}
                >
                  Média
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.priorityChip,
                  priority === "alta" && styles.priorityChipDanger,
                ]}
                onPress={() => setPriority("alta")}
              >
                <Text
                  style={[
                    styles.priorityText,
                    priority === "alta" && styles.priorityTextDanger,
                  ]}
                >
                  Alta
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Descreva o problema</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Explique o que aconteceu com o chamado..."
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
              <Text style={styles.infoTitle}>Análise do suporte</Text>
            </View>

            <Text style={styles.infoText}>
              No protótipo, o envio é simulado. Na versão final, essa solicitação
              será enviada para a API e vinculada ao chamado no banco de dados.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.sendButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSendIssue}
          >
            <SendIcon width={20} height={20} />
            <Text style={styles.sendButtonText}>Enviar problema</Text>
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
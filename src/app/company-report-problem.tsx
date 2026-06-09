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

          <Text style={styles.headerTitle}>Reportar problema</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Suporte da empresa</Text>
              <Text style={styles.heroTitle}>Encontrou um erro?</Text>
              <Text style={styles.heroText}>
                Informe bugs, dificuldades ou falhas encontradas no aplicativo.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <SupportIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de problema</Text>

            <View style={styles.problemList}>
              {problemTypes.map((problem) => {
                const isSelected = selectedProblem === problem.id;
                const Icon = problem.Icon;

                return (
                  <Pressable
                    key={problem.id}
                    style={[
                      styles.problemCard,
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
                          isSelected && styles.problemTitleActive,
                        ]}
                      >
                        {problem.title}
                      </Text>

                      <Text
                        style={[
                          styles.problemSubtitle,
                          isSelected && styles.problemSubtitleActive,
                        ]}
                      >
                        {problem.subtitle}
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
            <Text style={styles.label}>Onde aconteceu?</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Criar chamado, candidatos, pagamentos..."
              placeholderTextColor="#9CA3AF"
              value={screenName}
              onChangeText={setScreenName}
            />
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
            <Text style={styles.label}>Descrição do problema</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Explique o que aconteceu, quando ocorreu e o que você tentou fazer..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <SettingsIcon width={22} height={22} />
              <Text style={styles.infoTitle}>Análise do suporte</Text>
            </View>

            <Text style={styles.infoText}>
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
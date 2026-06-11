import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import CheckIcon from "../../assets/icons/check.svg";

import { styles } from "@/app/styles/serviceCompletion";
import { useTheme } from "@/app/context/ThemeContext";

type ChecklistItem = {
  id: string;
  title: string;
  description: string;
};

const checklistItems: ChecklistItem[] = [
  {
    id: "1",
    title: "Serviço realizado",
    description: "O freelancer compareceu e executou o serviço combinado.",
  },
  {
    id: "2",
    title: "Detalhes alinhados",
    description: "As informações finais foram combinadas pelo chat.",
  },
  {
    id: "3",
    title: "Tudo certo com a entrega",
    description: "A empresa confirma que o serviço foi concluído.",
  },
];

export default function ServiceCompletionScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    candidateName?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const candidateName = params.candidateName ?? "Usuário TaskFlow";

  const [checkedItems, setCheckedItems] = useState<string[]>(["1"]);

  const { isDark, theme } = useTheme();

  function toggleChecklistItem(itemId: string) {
    setCheckedItems((currentItems) => {
      if (currentItems.includes(itemId)) {
        return currentItems.filter((id) => id !== itemId);
      }

      return [...currentItems, itemId];
    });
  }

  const allItemsChecked = checkedItems.length === checklistItems.length;

  function handleConfirmCompletion() {
    if (!allItemsChecked) {
      console.log("Confirme todos os itens antes de concluir.");
      return;
    }

    console.log("Serviço concluído:", {
      jobTitle,
      candidateName,
    });

    router.push({
      pathname: "/service-completed",
      params: {
        jobTitle,
        candidateName,
      },
    });
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
          <ArrowBack
              width={28}
              height={28}
              color={theme.text}
              fill={theme.text}
            />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Conclusão do serviço
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.introCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.iconBox}>
            <CheckIcon width={34} height={34} />
          </View>

          <Text style={[styles.introTitle, { color: theme.text }]}>
            Finalizar chamado
          </Text>

          <Text style={[styles.introText, { color: theme.textSecondary }]}>
            Confirme se o serviço foi realizado corretamente antes de encerrar o
            chamado.
          </Text>
        </View>

        <View
          style={[
            styles.serviceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.primary }]}>
            Chamado em andamento
          </Text>

          <Text style={[styles.serviceTitle, { color: theme.text }]}>
            {jobTitle}
          </Text>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Freelancer
            </Text>

            <Text style={[styles.infoValue, { color: theme.text }]}>
              {candidateName}
            </Text>
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.border },
            ]}
          />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
              Status
            </Text>

            <Text style={styles.statusValue}>Aguardando conclusão</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Checklist de finalização
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Marque os itens abaixo para confirmar que está tudo certo.
          </Text>

          <View style={styles.checklistArea}>
            {checklistItems.map((item) => {
              const isChecked = checkedItems.includes(item.id);

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.checkItem,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    isChecked && styles.checkItemActive,
                  ]}
                  onPress={() => toggleChecklistItem(item.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      { borderColor: theme.border },
                      isChecked && styles.checkboxActive,
                    ]}
                  >
                    {isChecked && <CheckIcon width={16} height={16} />}
                  </View>

                  <View style={styles.checkTextArea}>
                    <Text style={[styles.checkTitle, { color: theme.text }]}>
                      {item.title}
                    </Text>

                    <Text
                      style={[
                        styles.checkDescription,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {item.description}
                    </Text>
                  </View>
                </Pressable>
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
            Depois da conclusão
          </Text>

          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            Após finalizar o serviço, a próxima etapa será avaliar o freelancer.
            Essa avaliação ajuda a manter a confiança dentro da plataforma.
          </Text>
        </View>

        <Pressable
          disabled={!allItemsChecked}
          style={({ pressed }) => [
            styles.confirmButton,
            !allItemsChecked && styles.confirmButtonDisabled,
            pressed && allItemsChecked && styles.confirmButtonPressed,
          ]}
          onPress={handleConfirmCompletion}
        >
          <Text style={styles.confirmButtonText}>Confirmar conclusão</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.secondaryButtonPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Voltar ao chat
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
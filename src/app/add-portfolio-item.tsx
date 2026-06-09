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
import PlusIcon from "../../assets/icons/Plus-icon.svg";
import BadgeIcon from "../../assets/icons/badge.svg";

import { styles } from "@/app/styles/addPortfolioItem";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

const categories = [
  "Eventos",
  "Fotografia",
  "Manutenção",
  "Limpeza",
  "Tecnologia",
  "Serviços gerais",
];

export default function AddPortfolioItemScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Eventos");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  const { isDark, theme } = useTheme();

  function handleSavePortfolioItem() {
    if (!title.trim() || !description.trim()) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha pelo menos o título e a descrição do item."
      );
      return;
    }

    Alert.alert(
      "Item adicionado",
      "O item foi adicionado ao seu portfólio com sucesso.",
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
            Novo item
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
                Portfólio
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Adicione um trabalho
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Mostre suas experiências para aumentar suas chances de ser
                contratado.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <PlusIcon width={34} height={34} color={colors.plus}/>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Título do trabalho
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
              placeholder="Ex: Garçom em evento corporativo"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Categoria
            </Text>

            <View style={styles.chipsArea}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      isSelected && styles.chipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: theme.textSecondary },
                        isSelected && styles.chipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Descrição
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
              placeholder="Descreva o que você fez nesse serviço..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Cliente ou empresa
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
              placeholder="Ex: Buffet Aurora"
              placeholderTextColor={theme.textSecondary}
              value={clientName}
              onChangeText={setClientName}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Data do serviço
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
              placeholder="Ex: Maio de 2026"
              placeholderTextColor={theme.textSecondary}
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Link ou referência
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
              placeholder="Ex: link de foto, Instagram ou site"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              value={link}
              onChangeText={setLink}
            />
          </View>

          <View
            style={[
              styles.previewCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.previewTitle, { color: theme.text }]}>
              Prévia do item
            </Text>

            <View
              style={[
                styles.previewBox,
                {
                  backgroundColor: theme.background,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.previewImage}>
                <BadgeIcon width={30} height={30} />
              </View>

              <View style={styles.previewContent}>
                <Text style={[styles.previewItemTitle, { color: theme.text }]}>
                  {title || "Título do trabalho"}
                </Text>

                <Text style={[styles.previewCategory, { color: theme.primary }]}>
                  {selectedCategory}
                </Text>

                <Text
                  style={[
                    styles.previewDescription,
                    { color: theme.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {description ||
                    "A descrição do serviço aparecerá aqui como prévia."}
                </Text>
              </View>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSavePortfolioItem}
          >
            <Text style={styles.saveButtonText}>Salvar item</Text>
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
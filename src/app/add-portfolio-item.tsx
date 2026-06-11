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

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;
const CLIENT_MAX_LENGTH = 100;
const DATE_MAX_LENGTH = 30;
const LINK_MAX_LENGTH = 150;

function removeSpaces(value: string) {
  return value.replace(/\s/g, "");
}

export default function AddPortfolioItemScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Eventos");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  function normalizeLink(value: string) {
    const cleanedValue = removeSpaces(value.trim()).slice(0, LINK_MAX_LENGTH);

    if (!cleanedValue) {
      return "";
    }

    if (
      cleanedValue.startsWith("http://") ||
      cleanedValue.startsWith("https://")
    ) {
      return cleanedValue;
    }

    return `https://${cleanedValue}`;
  }

  function handleChangeTitle(value: string) {
    setTitle(value.slice(0, TITLE_MAX_LENGTH));
  }

  function handleChangeDescription(value: string) {
    setDescription(value.slice(0, DESCRIPTION_MAX_LENGTH));
  }

  function handleChangeClientName(value: string) {
    setClientName(value.slice(0, CLIENT_MAX_LENGTH));
  }

  function handleChangeDate(value: string) {
    setDate(value.slice(0, DATE_MAX_LENGTH));
  }

  function handleChangeLink(value: string) {
    setLink(removeSpaces(value).slice(0, LINK_MAX_LENGTH));
  }

  function getValidationError() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedClientName = clientName.trim();
    const trimmedDate = date.trim();
    const normalizedUrl = normalizeLink(link);

    if (!trimmedTitle) {
      return "Informe o título do trabalho.";
    }

    if (trimmedTitle.length < 3) {
      return "O título precisa ter pelo menos 3 caracteres.";
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      return `O título pode ter no máximo ${TITLE_MAX_LENGTH} caracteres.`;
    }

    if (!trimmedDescription) {
      return "Informe a descrição do item.";
    }

    if (trimmedDescription.length < 10) {
      return "A descrição precisa ter pelo menos 10 caracteres.";
    }

    if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
      return `A descrição pode ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;
    }

    if (trimmedClientName.length > CLIENT_MAX_LENGTH) {
      return `O cliente ou empresa pode ter no máximo ${CLIENT_MAX_LENGTH} caracteres.`;
    }

    if (trimmedDate.length > DATE_MAX_LENGTH) {
      return `A data pode ter no máximo ${DATE_MAX_LENGTH} caracteres.`;
    }

    if (normalizedUrl.length > LINK_MAX_LENGTH) {
      return `O link pode ter no máximo ${LINK_MAX_LENGTH} caracteres.`;
    }

    return "";
  }

  function handleSavePortfolioItem() {
    const validationError = getValidationError();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const normalizedUrl = normalizeLink(link);

    setLink(normalizedUrl);

    console.log("Item do portfólio:", {
      title: title.trim(),
      category: selectedCategory,
      description: description.trim(),
      clientName: clientName.trim(),
      date: date.trim(),
      link: normalizedUrl,
    });

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
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack
              width={28}
              height={28}
              color={theme.text}
              fill={theme.text}
            />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Novo item
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={{ backgroundColor: theme.background }}
          keyboardShouldPersistTaps="handled"
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

            <View
              style={[
                styles.heroIconBox,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.white,
                  borderWidth: 0,
                },
              ]}
            >
              <PlusIcon
                width={34}
                height={34}
                color={colors.black}
                fill={colors.black}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Título do trabalho
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Ex: Garçom em evento corporativo"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={handleChangeTitle}
              maxLength={TITLE_MAX_LENGTH}
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.label, { color: theme.text }]}>
                Descrição
              </Text>

              <Text
                style={{
                  color:
                    description.length >= DESCRIPTION_MAX_LENGTH
                      ? "#DC2626"
                      : theme.textSecondary,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </Text>
            </View>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
                cleanInputStyle,
              ]}
              placeholder="Descreva o que você fez nesse serviço..."
              placeholderTextColor={theme.textSecondary}
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={handleChangeDescription}
              maxLength={DESCRIPTION_MAX_LENGTH}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Cliente ou empresa
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Ex: Buffet Aurora"
              placeholderTextColor={theme.textSecondary}
              value={clientName}
              onChangeText={handleChangeClientName}
              maxLength={CLIENT_MAX_LENGTH}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Data do serviço
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Ex: Maio de 2026"
              placeholderTextColor={theme.textSecondary}
              value={date}
              onChangeText={handleChangeDate}
              maxLength={DATE_MAX_LENGTH}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.text }]}>
              Link ou referência
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Ex: link de foto, Instagram ou site"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              value={link}
              onChangeText={handleChangeLink}
              onBlur={() =>
                setLink((currentValue) => normalizeLink(currentValue))
              }
              maxLength={LINK_MAX_LENGTH}
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
              <View
                style={[
                  styles.previewImage,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.white,
                    borderWidth: 0,
                  },
                ]}
              >
                <BadgeIcon
                  width={30}
                  height={30}
                  color={colors.black}
                  fill={colors.black}
                />
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
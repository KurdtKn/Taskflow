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

import { styles } from "@/app/styles/addPortfolioItem";

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

          <Text style={styles.headerTitle}>Novo item</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View>
              <Text style={styles.heroLabel}>Portfólio</Text>
              <Text style={styles.heroTitle}>Adicione um trabalho</Text>
              <Text style={styles.heroText}>
                Mostre suas experiências para aumentar suas chances de ser
                contratado.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <PlusIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Título do trabalho</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Garçom em evento corporativo"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Categoria</Text>

            <View style={styles.chipsArea}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.chipText,
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
            <Text style={styles.label}>Descrição</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o que você fez nesse serviço..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cliente ou empresa</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Buffet Aurora"
              placeholderTextColor="#9CA3AF"
              value={clientName}
              onChangeText={setClientName}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Data do serviço</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: Maio de 2026"
              placeholderTextColor="#9CA3AF"
              value={date}
              onChangeText={setDate}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Link ou referência</Text>

            <TextInput
              style={styles.input}
              placeholder="Ex: link de foto, Instagram ou site"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={link}
              onChangeText={setLink}
            />
          </View>

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Prévia do item</Text>

            <View style={styles.previewBox}>
              <View style={styles.previewImage}>
                <Text style={styles.previewImageText}>📁</Text>
              </View>

              <View style={styles.previewContent}>
                <Text style={styles.previewItemTitle}>
                  {title || "Título do trabalho"}
                </Text>

                <Text style={styles.previewCategory}>{selectedCategory}</Text>

                <Text style={styles.previewDescription} numberOfLines={2}>
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
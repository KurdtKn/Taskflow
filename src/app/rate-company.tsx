import { useState } from "react";
import {
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
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/rateCompany";

const ratingTags = [
  "Boa comunicação",
  "Empresa organizada",
  "Pagamento correto",
  "Informações claras",
  "Respeitosa",
  "Recomendo",
];

export default function RateCompanyScreen() {
  const params = useLocalSearchParams<{
    jobTitle?: string;
    companyName?: string;
  }>();

  const jobTitle = params.jobTitle ?? "Garçom para Evento";
  const companyName = params.companyName ?? "TaskFlow Eventos";

  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    "Boa comunicação",
    "Pagamento correto",
  ]);
  const [comment, setComment] = useState("");

  function toggleTag(tag: string) {
    setSelectedTags((currentTags) => {
      if (currentTags.includes(tag)) {
        return currentTags.filter((item) => item !== tag);
      }

      return [...currentTags, tag];
    });
  }

  function handleSubmitReview() {
    console.log({
      jobTitle,
      companyName,
      rating,
      selectedTags,
      comment,
    });

    router.replace("/home");
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

          <Text style={styles.headerTitle}>Avaliar empresa</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.introCard}>
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>⭐</Text>
            </View>

            <Text style={styles.introTitle}>Como foi trabalhar com a empresa?</Text>

            <Text style={styles.introText}>
              Sua avaliação ajuda outros freelancers a entenderem se a empresa é
              confiável e organizada.
            </Text>
          </View>

          <View style={styles.serviceCard}>
            <Text style={styles.cardLabel}>Serviço concluído</Text>

            <Text style={styles.serviceTitle}>{jobTitle}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{companyName}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sua nota</Text>

            <View style={styles.starsArea}>
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                const isActive = starValue <= rating;

                return (
                  <Pressable
                    key={starValue}
                    style={styles.starButton}
                    onPress={() => setRating(starValue)}
                  >
                    <Text
                      style={[
                        styles.star,
                        isActive ? styles.starActive : styles.starInactive,
                      ]}
                    >
                      ★
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.ratingText}>
              {rating === 5
                ? "Excelente"
                : rating === 4
                ? "Muito boa"
                : rating === 3
                ? "Regular"
                : rating === 2
                ? "Ruim"
                : "Muito ruim"}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>O que se destacou?</Text>

            <Text style={styles.sectionSubtitle}>
              Selecione pontos sobre a experiência com a empresa.
            </Text>

            <View style={styles.tagsArea}>
              {ratingTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);

                return (
                  <Pressable
                    key={tag}
                    style={[styles.tag, isSelected && styles.tagActive]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        isSelected && styles.tagTextActive,
                      ]}
                    >
                      {tag}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comentário</Text>

            <TextInput
              style={styles.textArea}
              placeholder="Escreva um comentário sobre sua experiência..."
              placeholderTextColor="#9CA3AF"
              value={comment}
              onChangeText={setComment}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Avaliação mútua</Text>

            <Text style={styles.infoText}>
              Essa etapa complementa a avaliação feita pela empresa. Assim, os
              dois lados constroem reputação dentro do TaskFlow.
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              pressed && styles.submitButtonPressed,
            ]}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>Enviar avaliação</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.secondaryButtonText}>Voltar para início</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
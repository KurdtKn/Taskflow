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
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/createJob";

const categories = [
  "Eventos",
  "Fotografia",
  "Manutenção",
  "Limpeza",
  "Suporte técnico",
  "Serviços gerais",
];

export default function CreateJobScreen() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Eventos");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [price, setPrice] = useState("");
  const [professionals, setProfessionals] = useState("1");

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    location.trim().length > 0 &&
    date.trim().length > 0 &&
    hour.trim().length > 0 &&
    price.trim().length > 0;

  function handlePublishJob() {
    if (!isFormValid) {
      console.log("Preencha os campos obrigatórios.");
      return;
    }

    console.log({
      title,
      selectedCategory,
      description,
      location,
      date,
      hour,
      price,
      professionals,
    });

    router.replace("/company-dashboard");
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

          <Text style={styles.headerTitle}>Criar chamado</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.introCard}>
            <Text style={styles.introTitle}>Publique uma nova demanda</Text>

            <Text style={styles.introText}>
              Informe os detalhes do serviço para que freelancers próximos
              possam se candidatar ao chamado.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Título do chamado</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Garçom para evento"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Categoria</Text>

            <View style={styles.categoriesArea}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Descrição do serviço</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o que precisa ser feito, requisitos e observações importantes."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Local do serviço</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Centro, Sorocaba - SP"
              placeholderTextColor="#9CA3AF"
              value={location}
              onChangeText={setLocation}
            />

            <View style={styles.doubleInputArea}>
              <View style={styles.doubleInputBox}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 15/06"
                  placeholderTextColor="#9CA3AF"
                  value={date}
                  onChangeText={setDate}
                />
              </View>

              <View style={styles.doubleInputBox}>
                <Text style={styles.label}>Horário</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 18:00"
                  placeholderTextColor="#9CA3AF"
                  value={hour}
                  onChangeText={setHour}
                />
              </View>
            </View>

            <View style={styles.doubleInputArea}>
              <View style={styles.doubleInputBox}>
                <Text style={styles.label}>Valor estimado</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: R$200,00"
                  placeholderTextColor="#9CA3AF"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.doubleInputBox}>
                <Text style={styles.label}>Profissionais</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 1"
                  placeholderTextColor="#9CA3AF"
                  value={professionals}
                  onChangeText={setProfessionals}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Como funciona?</Text>

              <Text style={styles.infoText}>
                Após publicar o chamado, freelancers da região poderão visualizar
                a demanda e enviar uma solicitação. Você poderá analisar os
                candidatos antes de aceitar um profissional.
              </Text>
            </View>

            <Pressable
              disabled={!isFormValid}
              style={({ pressed }) => [
                styles.publishButton,
                !isFormValid && styles.publishButtonDisabled,
                pressed && isFormValid && styles.publishButtonPressed,
              ]}
              onPress={handlePublishJob}
            >
              <Text style={styles.publishButtonText}>Publicar chamado</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
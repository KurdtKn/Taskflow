import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/editProfile";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type Skill = {
  id: string;
  name: string;
};

const availableSkills: Skill[] = [
  { id: "1", name: "Eventos" },
  { id: "2", name: "Garçom" },
  { id: "3", name: "Fotografia" },
  { id: "4", name: "Manutenção" },
  { id: "5", name: "Limpeza" },
  { id: "6", name: "Suporte técnico" },
];

export default function EditProfileScreen() {
  const [name, setName] = useState("Usuário TaskFlow");
  const [phone, setPhone] = useState("(15) 99999-9999");
  const [bio, setBio] = useState(
    "Profissional disponível para serviços sob demanda, eventos e atividades rápidas."
  );
  const [experience, setExperience] = useState(
    "Experiência com atendimento ao público, organização de eventos e serviços pontuais."
  );
  const [portfolioUrl, setPortfolioUrl] = useState(
    "https://meuportfolio.com"
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Eventos",
    "Garçom",
    "Serviços gerais",
  ]);

  const { isDark, theme } = useTheme();

  function formatPhone(value: string) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 11);

    if (numbersOnly.length <= 2) {
      return numbersOnly;
    }

    if (numbersOnly.length <= 7) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    }

    return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
      2,
      7
    )}-${numbersOnly.slice(7)}`;
  }

  function handleChangePhone(value: string) {
    setPhone(formatPhone(value));
  }

  function toggleSkill(skillName: string) {
    setSelectedSkills((currentSkills) => {
      if (currentSkills.includes(skillName)) {
        return currentSkills.filter((skill) => skill !== skillName);
      }

      return [...currentSkills, skillName];
    });
  }

  function handleSaveProfile() {
    console.log({
      name,
      phone,
      bio,
      experience,
      portfolioUrl,
      isAvailable,
      selectedSkills,
    });

    router.back();
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
            Editar perfil
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarArea}>
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.avatar}
                resizeMode="contain"
              />

              <Pressable style={styles.editPhotoButton}>
                <Text style={styles.editPhotoIcon}>✎</Text>
              </Pressable>
            </View>

            <Text style={[styles.avatarText, { color: theme.textSecondary }]}>
              Alterar foto do perfil
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              Nome completo
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
              placeholder="Digite seu nome"
              placeholderTextColor={theme.textSecondary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Telefone
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
              placeholder="(00) 00000-0000"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={handleChangePhone}
              keyboardType="phone-pad"
              maxLength={15}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Biografia
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
              placeholder="Conte um pouco sobre você"
              placeholderTextColor={theme.textSecondary}
              value={bio}
              onChangeText={setBio}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Experiência
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
              placeholder="Descreva suas experiências profissionais"
              placeholderTextColor={theme.textSecondary}
              value={experience}
              onChangeText={setExperience}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Link do portfólio
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
              placeholder="https://seuportfolio.com"
              placeholderTextColor={theme.textSecondary}
              value={portfolioUrl}
              onChangeText={setPortfolioUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <View
              style={[
                styles.availabilityCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View>
                <Text style={[styles.availabilityTitle, { color: theme.text }]}>
                  Disponível para chamados
                </Text>

                <Text
                  style={[
                    styles.availabilitySubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  Ative para aparecer como disponível no TaskFlow.
                </Text>
              </View>

              <Switch
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{
                  false: colors.border,
                  true: "rgba(11,87,208,0.35)",
                }}
                thumbColor={isAvailable ? colors.primary : "#F4F4F5"}
              />
            </View>

            <View style={styles.skillsSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Habilidades e categorias
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Selecione as áreas em que você deseja receber chamados.
              </Text>

              <View style={styles.skillsArea}>
                {availableSkills.map((skill) => {
                  const isSelected = selectedSkills.includes(skill.name);

                  return (
                    <Pressable
                      key={skill.id}
                      style={[
                        styles.skillChip,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                        isSelected && styles.skillChipActive,
                      ]}
                      onPress={() => toggleSkill(skill.name)}
                    >
                      <Text
                        style={[
                          styles.skillText,
                          { color: theme.textSecondary },
                          isSelected && styles.skillTextActive,
                        ]}
                      >
                        {skill.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
import { useEffect, useState } from "react";
import {
  Alert,
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
import * as ImagePicker from "expo-image-picker";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/editProfile";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import {
  getFreelancerData,
  getLoggedUser,
  saveFreelancerData,
} from "@/services/storage";

type Skill = {
  id: string;
  name: string;
};

type FreelancerProfileForm = {
  name: string;
  phone: string;
  bio: string;
  experience: string;
  portfolioUrl: string;
  isAvailable: boolean;
  selectedSkills: string[];
  photoUrl?: string;
};

const defaultSkills: Skill[] = [
  { id: "1", name: "Eventos" },
  { id: "2", name: "Garçom" },
  { id: "3", name: "Fotografia" },
  { id: "4", name: "DJ" },
  { id: "5", name: "Babá" },
  { id: "6", name: "Manutenção" },
  { id: "7", name: "Limpeza" },
  { id: "8", name: "Suporte técnico" },
];

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    loadProfile();
    loadAvailableSkills();
  }, []);

  async function loadProfile() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      const savedFreelancerData = await getFreelancerData(loggedUser.id);

      setName(savedFreelancerData?.name || loggedUser.nome || "");
      setPhone(
        formatPhone(savedFreelancerData?.phone || loggedUser.telefone || "")
      );
      setBio(savedFreelancerData?.about || "");
      setExperience(savedFreelancerData?.experience || "");
      setPortfolioUrl(savedFreelancerData?.portfolioUrl || "");
      setPhotoUrl(savedFreelancerData?.photoUrl);
      setIsAvailable(savedFreelancerData?.isAvailable ?? true);
      setSelectedSkills(savedFreelancerData?.tags ?? []);
    } catch (error) {
      console.log("Erro ao carregar perfil:", error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados do seu perfil agora."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadAvailableSkills() {
    setAvailableSkills(defaultSkills);
  }

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

  function getCurrentProfileData(): FreelancerProfileForm {
    return {
      name: name.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      experience: experience.trim(),
      portfolioUrl: portfolioUrl.trim(),
      isAvailable,
      selectedSkills,
      photoUrl,
    };
  }

  async function handleChangePhoto() {
    try {
      if (Platform.OS !== "web") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          Alert.alert(
            "Permissão necessária",
            "Permita o acesso à galeria para escolher sua foto de perfil."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });

      if (result.canceled) {
        return;
      }

      const selectedImage = result.assets[0];

      if (!selectedImage) {
        Alert.alert("Erro", "Não foi possível carregar a imagem selecionada.");
        return;
      }

      if (selectedImage.base64) {
        const mimeType = selectedImage.mimeType ?? "image/jpeg";
        const base64Image = `data:${mimeType};base64,${selectedImage.base64}`;

        setPhotoUrl(base64Image);
        return;
      }

      if (selectedImage.uri) {
        setPhotoUrl(selectedImage.uri);
        return;
      }

      Alert.alert("Erro", "Não foi possível carregar a imagem selecionada.");
    } catch (error) {
      console.log("Erro ao selecionar foto:", error);

      Alert.alert(
        "Erro",
        "Não foi possível selecionar sua foto de perfil agora."
      );
    }
  }

  async function handleSaveProfile() {
    console.log("Clicou em salvar perfil");

    const profileData = getCurrentProfileData();

    console.log("Dados do formulário:", profileData);

    if (!profileData.name) {
      Alert.alert("Campo obrigatório", "Informe seu nome completo.");
      return;
    }

    try {
      setIsSaving(true);

      const loggedUser = await getLoggedUser();

      console.log("Usuário logado:", loggedUser);

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      const savedFreelancerData = await getFreelancerData(loggedUser.id);

      const dataToSave = {
        name: profileData.name,
        email: savedFreelancerData?.email || loggedUser.email,
        phone: profileData.phone || loggedUser.telefone || "",
        city: savedFreelancerData?.city || "",
        about: profileData.bio,
        experience: profileData.experience,
        portfolioUrl: profileData.portfolioUrl,
        isAvailable: profileData.isAvailable,
        tags: profileData.selectedSkills,
        photoUrl: profileData.photoUrl,
      };

      console.log("Objeto enviado para salvar:", dataToSave);

      await saveFreelancerData(loggedUser.id, dataToSave);

      const checkSavedData = await getFreelancerData(loggedUser.id);

      console.log("Dados salvos no AsyncStorage:", checkSavedData);

      Alert.alert("Perfil atualizado", "Suas alterações foram salvas.");

      router.replace("/profile");
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível salvar seu perfil agora. Tente novamente.";

      Alert.alert("Erro", errorMessage);
    } finally {
      setIsSaving(false);
    }
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
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isSaving}
          >
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarArea}>
              {photoUrl ? (
                <Image
                  source={{ uri: photoUrl }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: theme.inputBackground,
                      alignItems: "center",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: 30,
                      fontWeight: "900",
                    }}
                  >
                    {name ? name.charAt(0).toUpperCase() : "?"}
                  </Text>
                </View>
              )}

              <Pressable
                style={styles.editPhotoButton}
                onPress={handleChangePhoto}
                disabled={isSaving}
              >
                <Text style={styles.editPhotoIcon}>✎</Text>
              </Pressable>
            </View>

            <Text style={[styles.avatarText, { color: theme.textSecondary }]}>
              Alterar foto do perfil
            </Text>
          </View>

          {isLoading && (
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
                  Carregando perfil...
                </Text>

                <Text
                  style={[
                    styles.availabilitySubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  Buscando os dados da sua conta.
                </Text>
              </View>
            </View>
          )}

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
              autoCapitalize="words"
              editable={!isSaving}
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
              editable={!isSaving}
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
              editable={!isSaving}
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
              editable={!isSaving}
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
              autoCorrect={false}
              keyboardType="url"
              editable={!isSaving}
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
                disabled={isSaving}
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
                      disabled={isSaving}
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
              disabled={isSaving}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                isSaving && { opacity: 0.7 },
              ]}
              onPress={handleSaveProfile}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "Salvando..." : "Salvar alterações"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
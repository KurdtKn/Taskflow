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

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "@/app/styles/editProfile";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

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

      /*
        Aqui futuramente entra a API para buscar o perfil do usuário logado.

        Exemplo:
        const response = await userService.getMyFreelancerProfile();

        setName(response.name);
        setPhone(formatPhone(response.phone ?? ""));
        setBio(response.bio ?? "");
        setExperience(response.experience ?? "");
        setPortfolioUrl(response.portfolioUrl ?? "");
        setPhotoUrl(response.photoUrl);
        setIsAvailable(response.isAvailable);
        setSelectedSkills(response.skills ?? []);

        A API identifica o usuário pelo token salvo após o login.
      */
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
    try {
      /*
        Aqui futuramente entra a API para buscar categorias/habilidades.

        Exemplo:
        const response = await categoriesService.getCategories();
        setAvailableSkills(response);

        Por enquanto fica vazio para não manter dados forjados.
      */

      setAvailableSkills([]);
    } catch (error) {
      console.log("Erro ao carregar habilidades:", error);
      setAvailableSkills([]);
    }
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

  async function handleSaveProfile() {
    const profileData = getCurrentProfileData();

    if (!profileData.name) {
      Alert.alert("Campo obrigatório", "Informe seu nome completo.");
      return;
    }

    if (!profileData.phone) {
      Alert.alert("Campo obrigatório", "Informe seu telefone.");
      return;
    }

    try {
      setIsSaving(true);

      /*
        Aqui futuramente entra a API para salvar no banco.

        Exemplo:
        await userService.updateMyFreelancerProfile({
          name: profileData.name,
          phone: profileData.phone.replace(/\D/g, ""),
          bio: profileData.bio,
          experience: profileData.experience,
          portfolioUrl: profileData.portfolioUrl,
          isAvailable: profileData.isAvailable,
          skills: profileData.selectedSkills,
          photoUrl: profileData.photoUrl,
        });

        A API vai atualizar os dados do usuário logado pelo token.
      */

      console.log("Perfil salvo:", profileData);

      Alert.alert("Perfil atualizado", "Suas alterações foram salvas.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("Erro ao salvar perfil:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar seu perfil agora. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleChangePhoto() {
    /*
      Aqui futuramente entra seleção/upload de imagem.

      Exemplo:
      usar expo-image-picker para escolher imagem
      e enviar para API ou storage.
    */

    Alert.alert(
      "Alterar foto",
      "A seleção de foto será integrada depois com upload de imagem."
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
              autoCorrect={false}
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

              {availableSkills.length === 0 ? (
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
                    <Text
                      style={[
                        styles.availabilityTitle,
                        { color: theme.text },
                      ]}
                    >
                      Nenhuma categoria carregada
                    </Text>

                    <Text
                      style={[
                        styles.availabilitySubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      Quando a API retornar categorias, elas aparecerão aqui.
                    </Text>
                  </View>
                </View>
              ) : (
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
              )}
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
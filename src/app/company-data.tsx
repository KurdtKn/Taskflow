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

import { styles } from "@/app/styles/companyData";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import {
  getCompanyData,
  getLoggedUser,
  saveCompanyData,
} from "@/services/storage";

type ServiceArea = {
  id: string;
  name: string;
};

type CompanyDataForm = {
  companyName: string;
  cnpj: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  description: string;
  isVerified: boolean;
  selectedAreas: string[];
  logoUrl?: string;
};

const COMPANY_NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 120;
const CITY_MAX_LENGTH = 60;
const ADDRESS_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 1000;

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function removeSpaces(value: string) {
  return value.replace(/\s/g, "");
}

function resolveImageUrl(...sources: any[]) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    const value =
      source.logoUrl ??
      source.logo_url ??
      source.photoUrl ??
      source.photo_url ??
      source.fotoUrl ??
      source.foto_url ??
      source.imageUrl ??
      source.image_url ??
      source.avatarUrl ??
      source.avatar_url;

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

export default function CompanyDataScreen() {
  const [companyName, setCompanyName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  useEffect(() => {
    loadCompanyData();
    loadServiceAreas();
  }, []);

  async function loadCompanyData() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        router.replace("/login");
        return;
      }

      const savedCompanyData = await getCompanyData(loggedUser.id);

      if (savedCompanyData) {
        const savedData = savedCompanyData as any;

        setCompanyName(
          String(savedData.name ?? loggedUser.nome ?? "").slice(
            0,
            COMPANY_NAME_MAX_LENGTH
          )
        );
        setCnpj(formatCnpj(String(savedData.cnpj ?? "")));
        setEmail(
          removeSpaces(String(savedData.email ?? loggedUser.email ?? "")).slice(
            0,
            EMAIL_MAX_LENGTH
          )
        );
        setPhone(formatPhone(String(savedData.phone ?? loggedUser.telefone ?? "")));
        setCity(String(savedData.location ?? "").slice(0, CITY_MAX_LENGTH));
        setAddress(String(savedData.address ?? "").slice(0, ADDRESS_MAX_LENGTH));
        setDescription(String(savedData.about ?? "").slice(0, DESCRIPTION_MAX_LENGTH));
        setIsVerified(Boolean(savedData.isVerified));
        setSelectedAreas(Array.isArray(savedData.tags) ? savedData.tags : []);
        setLogoUrl(resolveImageUrl(savedData, loggedUser));
        return;
      }

      setCompanyName(String(loggedUser.nome ?? "").slice(0, COMPANY_NAME_MAX_LENGTH));
      setEmail(removeSpaces(String(loggedUser.email ?? "")).slice(0, EMAIL_MAX_LENGTH));
      setPhone(formatPhone(String(loggedUser.telefone ?? "")));
      setLogoUrl(resolveImageUrl(loggedUser));
    } catch (error) {
      console.log("Erro ao carregar dados da empresa:", error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar os dados da empresa agora."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function loadServiceAreas() {
    try {
      setServiceAreas([
        { id: "1", name: "Eventos" },
        { id: "2", name: "Fotografia" },
        { id: "3", name: "Manutenção" },
        { id: "4", name: "Limpeza" },
        { id: "5", name: "Atendimento" },
        { id: "6", name: "Serviços gerais" },
      ]);
    } catch (error) {
      console.log("Erro ao carregar áreas de atuação:", error);
      setServiceAreas([]);
    }
  }

  function isValidEmail(value: string) {
    return /\S+@\S+\.\S+/.test(value);
  }

  function formatCnpj(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 14);

    return numbersOnly
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  function formatPhone(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 11);

    if (numbersOnly.length <= 2) {
      return numbersOnly;
    }

    if (numbersOnly.length <= 6) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(2)}`;
    }

    if (numbersOnly.length <= 10) {
      return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
        2,
        6
      )}-${numbersOnly.slice(6)}`;
    }

    return `(${numbersOnly.slice(0, 2)}) ${numbersOnly.slice(
      2,
      7
    )}-${numbersOnly.slice(7)}`;
  }

  function handleChangeCompanyName(value: string) {
    setCompanyName(value.slice(0, COMPANY_NAME_MAX_LENGTH));
  }

  function handleChangeCnpj(value: string) {
    setCnpj(formatCnpj(value));
  }

  function handleChangeEmail(value: string) {
    setEmail(removeSpaces(value).slice(0, EMAIL_MAX_LENGTH));
  }

  function handleChangePhone(value: string) {
    setPhone(formatPhone(value));
  }

  function handleChangeCity(value: string) {
    setCity(value.slice(0, CITY_MAX_LENGTH));
  }

  function handleChangeAddress(value: string) {
    setAddress(value.slice(0, ADDRESS_MAX_LENGTH));
  }

  function handleChangeDescription(value: string) {
    setDescription(value.slice(0, DESCRIPTION_MAX_LENGTH));
  }

  function toggleArea(area: string) {
    if (isSaving || isLoading) {
      return;
    }

    setSelectedAreas((currentAreas) => {
      if (currentAreas.includes(area)) {
        return currentAreas.filter((item) => item !== area);
      }

      return [...currentAreas, area];
    });
  }

  function getCurrentCompanyData(): CompanyDataForm {
    return {
      companyName: companyName.trim(),
      cnpj: cnpj.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      description: description.trim(),
      isVerified,
      selectedAreas,
      logoUrl,
    };
  }

  function getValidationError(companyData: CompanyDataForm) {
    const cleanedCnpj = onlyNumbers(companyData.cnpj);
    const cleanedPhone = onlyNumbers(companyData.phone);

    if (!companyData.companyName) {
      return "Informe o nome da empresa.";
    }

    if (companyData.companyName.length < 3) {
      return "O nome da empresa precisa ter pelo menos 3 caracteres.";
    }

    if (companyData.companyName.length > COMPANY_NAME_MAX_LENGTH) {
      return `O nome da empresa pode ter no máximo ${COMPANY_NAME_MAX_LENGTH} caracteres.`;
    }

    if (!cleanedCnpj) {
      return "Informe o CNPJ da empresa.";
    }

    if (cleanedCnpj.length !== 14) {
      return "Informe um CNPJ com 14 números.";
    }

    if (!companyData.email) {
      return "Informe o e-mail comercial.";
    }

    if (companyData.email.length > EMAIL_MAX_LENGTH) {
      return `O e-mail pode ter no máximo ${EMAIL_MAX_LENGTH} caracteres.`;
    }

    if (!isValidEmail(companyData.email)) {
      return "Informe um e-mail comercial válido.";
    }

    if (cleanedPhone && cleanedPhone.length < 10) {
      return "Informe um telefone válido com DDD.";
    }

    if (cleanedPhone && cleanedPhone.length > 11) {
      return "O telefone pode ter no máximo 11 números.";
    }

    if (companyData.city && companyData.city.length < 3) {
      return "A cidade precisa ter pelo menos 3 caracteres.";
    }

    if (companyData.city.length > CITY_MAX_LENGTH) {
      return `A cidade pode ter no máximo ${CITY_MAX_LENGTH} caracteres.`;
    }

    if (companyData.address.length > ADDRESS_MAX_LENGTH) {
      return `O endereço pode ter no máximo ${ADDRESS_MAX_LENGTH} caracteres.`;
    }

    if (companyData.description.length > DESCRIPTION_MAX_LENGTH) {
      return `A descrição pode ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`;
    }

    return "";
  }

  async function handleSaveCompanyData() {
    console.log("Clicou em salvar dados da empresa");

    const companyData = getCurrentCompanyData();
    const validationError = getValidationError(companyData);

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    try {
      setIsSaving(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      const dataToSave = {
        name: companyData.companyName,
        cnpj: companyData.cnpj,
        email: companyData.email,
        phone: companyData.phone,
        location: companyData.city,
        address: companyData.address,
        about: companyData.description,
        isVerified: companyData.isVerified,
        tags: companyData.selectedAreas,

        // Mantemos vários nomes para a foto aparecer em qualquer tela do app.
        logoUrl: companyData.logoUrl,
        photoUrl: companyData.logoUrl,
        fotoUrl: companyData.logoUrl,
        imageUrl: companyData.logoUrl,
        avatarUrl: companyData.logoUrl,
      };

      await saveCompanyData(loggedUser.id, dataToSave as any);

      console.log("Dados da empresa salvos com sucesso:", companyData);

      Alert.alert("Dados atualizados", "As alterações foram salvas.");

      router.replace("/company-profile");
    } catch (error) {
      console.log("Erro ao salvar dados da empresa:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar os dados da empresa agora."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangeLogo() {
    if (isSaving || isLoading) {
      return;
    }

    try {
      if (Platform.OS !== "web") {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
          Alert.alert(
            "Permissão necessária",
            "Permita o acesso à galeria para escolher a logo da empresa."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.45,
        base64: false,
      });

      if (result.canceled) {
        return;
      }

      const selectedImage = result.assets[0];

      if (!selectedImage) {
        Alert.alert("Erro", "Não foi possível carregar a imagem selecionada.");
        return;
      }

      if (selectedImage.uri) {
        setLogoUrl(selectedImage.uri);
        return;
      }

      if (selectedImage.base64) {
        const mimeType = selectedImage.mimeType ?? "image/jpeg";
        const base64Image = `data:${mimeType};base64,${selectedImage.base64}`;

        setLogoUrl(base64Image);
        return;
      }

      Alert.alert("Erro", "Não foi possível carregar a imagem selecionada.");
    } catch (error) {
      console.log("Erro ao selecionar logo:", error);

      Alert.alert(
        "Erro",
        "Não foi possível selecionar a logo da empresa agora."
      );
    }
  }

  const isProfileActive =
    companyName.trim().length > 0 &&
    email.trim().length > 0 &&
    isValidEmail(email.trim());

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
            Dados da empresa
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          style={{ backgroundColor: theme.background }}
        >
          <View style={styles.logoSection}>
            <View style={[styles.logoArea, { position: "relative" }]}>
              {logoUrl ? (
                <Image
                  source={{ uri: logoUrl }}
                  style={styles.logo}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={[
                    styles.logo,
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
                      fontSize: 28,
                      fontWeight: "900",
                    }}
                  >
                    {companyName ? companyName.charAt(0).toUpperCase() : "?"}
                  </Text>
                </View>
              )}

              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: isProfileActive ? "#22C55E" : "#A1A1AA",
                  borderWidth: 3,
                  borderColor: theme.background,
                  zIndex: 20,
                  elevation: 20,
                }}
              />

              <Pressable
                style={[
                  styles.editLogoButton,
                  {
                    zIndex: 30,
                    elevation: 30,
                  },
                ]}
                onPress={handleChangeLogo}
                disabled={isSaving || isLoading}
              >
                <Text style={styles.editLogoIcon}>✎</Text>
              </Pressable>
            </View>

            <Text
              style={[
                styles.logoText,
                {
                  color: isProfileActive ? "#22C55E" : theme.textSecondary,
                  fontWeight: "800",
                },
              ]}
            >
              {isProfileActive ? "Perfil ativo" : "Perfil incompleto"}
            </Text>
          </View>

          {isLoading && (
            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Carregando dados...
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Buscando as informações da empresa.
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              Nome da empresa
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Digite o nome da empresa"
              placeholderTextColor={theme.textSecondary}
              value={companyName}
              onChangeText={handleChangeCompanyName}
              maxLength={COMPANY_NAME_MAX_LENGTH}
              editable={!isLoading && !isSaving}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              CNPJ
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="00.000.000/0000-00"
              placeholderTextColor={theme.textSecondary}
              value={cnpj}
              onChangeText={handleChangeCnpj}
              keyboardType="numeric"
              maxLength={18}
              editable={!isLoading && !isSaving}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              E-mail comercial
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="empresa@email.com"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={handleChangeEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              maxLength={EMAIL_MAX_LENGTH}
              editable={!isLoading && !isSaving}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Telefone
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="(00) 00000-0000"
              placeholderTextColor={theme.textSecondary}
              value={phone}
              onChangeText={handleChangePhone}
              keyboardType="phone-pad"
              maxLength={15}
              editable={!isLoading && !isSaving}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Cidade / Estado
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Ex: Sorocaba - SP"
              placeholderTextColor={theme.textSecondary}
              value={city}
              onChangeText={handleChangeCity}
              maxLength={CITY_MAX_LENGTH}
              editable={!isLoading && !isSaving}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Endereço
            </Text>

            <TextInput
              style={[
                styles.input,
                cleanInputStyle,
              ]}
              placeholder="Rua, número, bairro"
              placeholderTextColor={theme.textSecondary}
              value={address}
              onChangeText={handleChangeAddress}
              maxLength={ADDRESS_MAX_LENGTH}
              editable={!isLoading && !isSaving}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.label, { color: theme.text }]}>
                Descrição da empresa
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
              placeholder="Conte um pouco sobre a empresa"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={handleChangeDescription}
              maxLength={DESCRIPTION_MAX_LENGTH}
              multiline
              textAlignVertical="top"
              editable={!isLoading && !isSaving}
            />

            <View
              style={[
                styles.verifiedCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View>
                <Text style={[styles.verifiedTitle, { color: theme.text }]}>
                  Empresa verificada
                </Text>

                <Text
                  style={[
                    styles.verifiedSubtitle,
                    { color: theme.textSecondary },
                  ]}
                >
                  Indica que os dados principais foram conferidos pela
                  plataforma.
                </Text>
              </View>

              <Switch
                value={isVerified}
                disabled
                trackColor={{
                  false: colors.border,
                  true: "rgba(0,176,80,0.35)",
                }}
                thumbColor={isVerified ? colors.success : "#F4F4F5"}
              />
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Áreas de atuação
              </Text>

              <Text
                style={[
                  styles.sectionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Selecione as categorias em que sua empresa costuma contratar.
              </Text>

              {serviceAreas.length === 0 ? (
                <View
                  style={[
                    styles.infoBox,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                  ]}
                >
                  <Text style={[styles.infoTitle, { color: theme.text }]}>
                    Nenhuma área carregada
                  </Text>

                  <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                    Quando a API retornar categorias, elas aparecerão aqui.
                  </Text>
                </View>
              ) : (
                <View style={styles.areasArea}>
                  {serviceAreas.map((area) => {
                    const isSelected = selectedAreas.includes(area.name);

                    return (
                      <Pressable
                        key={area.id}
                        style={[
                          styles.areaChip,
                          {
                            backgroundColor: theme.card,
                            borderColor: theme.border,
                          },
                          isSelected && styles.areaChipActive,
                        ]}
                        onPress={() => toggleArea(area.name)}
                        disabled={isLoading || isSaving}
                      >
                        <Text
                          style={[
                            styles.areaText,
                            { color: theme.textSecondary },
                            isSelected && styles.areaTextActive,
                          ]}
                        >
                          {area.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>

            <View
              style={[
                styles.infoBox,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.infoTitle, { color: theme.text }]}>
                Por que manter atualizado?
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Dados completos aumentam a confiança dos freelancers e ajudam a
                plataforma a organizar melhor os chamados publicados.
              </Text>
            </View>

            <Pressable
              disabled={isSaving || isLoading}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && !isSaving && !isLoading && styles.saveButtonPressed,
                (isSaving || isLoading) && { opacity: 0.7 },
              ]}
              onPress={handleSaveCompanyData}
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
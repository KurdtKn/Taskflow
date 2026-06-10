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

import { styles } from "@/app/styles/companyData";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

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

  useEffect(() => {
    loadCompanyData();
    loadServiceAreas();
  }, []);

  async function loadCompanyData() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a API para buscar os dados da empresa logada.

        Exemplo:
        const response = await companyService.getMyCompanyData();

        setCompanyName(response.companyName ?? "");
        setCnpj(formatCnpj(response.cnpj ?? ""));
        setEmail(response.email ?? "");
        setPhone(formatPhone(response.phone ?? ""));
        setCity(response.city ?? "");
        setAddress(response.address ?? "");
        setDescription(response.description ?? "");
        setIsVerified(response.isVerified ?? false);
        setSelectedAreas(response.serviceAreas ?? []);
        setLogoUrl(response.logoUrl);

        A API deve identificar a empresa pelo token salvo depois do login.
      */
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
      /*
        Futuramente entra aqui a API para buscar categorias/áreas de atuação.

        Exemplo:
        const response = await categoriesService.getCategories();
        setServiceAreas(response);

        Formato esperado:
        [
          { id: "1", name: "Eventos" },
          { id: "2", name: "Fotografia" }
        ]
      */

      setServiceAreas([]);
    } catch (error) {
      console.log("Erro ao carregar áreas de atuação:", error);
      setServiceAreas([]);
    }
  }

  function formatCnpj(value: string) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 14);

    return numbersOnly
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
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

  function handleChangeCnpj(value: string) {
    setCnpj(formatCnpj(value));
  }

  function handleChangePhone(value: string) {
    setPhone(formatPhone(value));
  }

  function toggleArea(area: string) {
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

  async function handleSaveCompanyData() {
    const companyData = getCurrentCompanyData();

    if (!companyData.companyName) {
      Alert.alert("Campo obrigatório", "Informe o nome da empresa.");
      return;
    }

    if (!companyData.cnpj) {
      Alert.alert("Campo obrigatório", "Informe o CNPJ da empresa.");
      return;
    }

    if (!companyData.email) {
      Alert.alert("Campo obrigatório", "Informe o e-mail comercial.");
      return;
    }

    try {
      setIsSaving(true);

      /*
        Futuramente entra aqui a API para salvar os dados no banco.

        Exemplo:
        await companyService.updateMyCompanyData({
          companyName: companyData.companyName,
          cnpj: companyData.cnpj.replace(/\D/g, ""),
          email: companyData.email,
          phone: companyData.phone.replace(/\D/g, ""),
          city: companyData.city,
          address: companyData.address,
          description: companyData.description,
          serviceAreas: companyData.selectedAreas,
          logoUrl: companyData.logoUrl,
        });

        A API atualiza os dados da empresa logada pelo token.
        O campo isVerified normalmente deve ser controlado pelo sistema/admin,
        não pela própria empresa.
      */

      console.log("Dados da empresa salvos:", companyData);

      Alert.alert("Dados atualizados", "As alterações foram salvas.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
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

  function handleChangeLogo() {
    /*
      Futuramente entra aqui upload/seleção da logo.

      Exemplo:
      usar expo-image-picker para escolher a imagem
      e enviar para a API ou storage.
    */

    Alert.alert(
      "Alterar logo",
      "A seleção da logo será integrada depois com upload de imagem."
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
            Dados da empresa
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoSection}>
            <View style={styles.logoArea}>
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

              <Pressable
                style={styles.editLogoButton}
                onPress={handleChangeLogo}
              >
                <Text style={styles.editLogoIcon}>✎</Text>
              </Pressable>
            </View>

            <Text style={[styles.logoText, { color: theme.textSecondary }]}>
              Alterar logo da empresa
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
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Digite o nome da empresa"
              placeholderTextColor={theme.textSecondary}
              value={companyName}
              onChangeText={setCompanyName}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              CNPJ
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
              placeholder="00.000.000/0000-00"
              placeholderTextColor={theme.textSecondary}
              value={cnpj}
              onChangeText={handleChangeCnpj}
              keyboardType="numeric"
              maxLength={18}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              E-mail comercial
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
              placeholder="empresa@email.com"
              placeholderTextColor={theme.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
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
              Cidade / Estado
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
              placeholder="Ex: Sorocaba - SP"
              placeholderTextColor={theme.textSecondary}
              value={city}
              onChangeText={setCity}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Endereço
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
              placeholder="Rua, número, bairro"
              placeholderTextColor={theme.textSecondary}
              value={address}
              onChangeText={setAddress}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Descrição da empresa
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
              placeholder="Conte um pouco sobre a empresa"
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
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
              disabled={isSaving}
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                isSaving && { opacity: 0.7 },
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
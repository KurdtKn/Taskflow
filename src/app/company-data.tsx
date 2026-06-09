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
import { styles } from "@/app/styles/companyData";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

const serviceAreas = [
  "Eventos",
  "Contratação rápida",
  "Serviços gerais",
  "Fotografia",
  "Manutenção",
  "Limpeza",
];

export default function CompanyDataScreen() {
  const [companyName, setCompanyName] = useState("TaskFlow Eventos");
  const [cnpj, setCnpj] = useState("12.345.678/0001-90");
  const [email, setEmail] = useState("empresa@taskflow.com");
  const [phone, setPhone] = useState("(15) 99999-9999");
  const [city, setCity] = useState("Sorocaba - SP");
  const [address, setAddress] = useState("Rua Exemplo, 123 - Centro");
  const [description, setDescription] = useState(
    "Empresa focada na organização de eventos, contratação de profissionais temporários e serviços sob demanda."
  );
  const [isVerified, setIsVerified] = useState(true);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "Eventos",
    "Contratação rápida",
    "Serviços gerais",
  ]);

  const { isDark, theme } = useTheme();

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

  function handleSaveCompanyData() {
    console.log({
      companyName,
      cnpj,
      email,
      phone,
      city,
      address,
      description,
      isVerified,
      selectedAreas,
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
            Dados da empresa
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.logoSection}>
            <View style={styles.logoArea}>
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              <Pressable style={styles.editLogoButton}>
                <Text style={styles.editLogoIcon}>✎</Text>
              </Pressable>
            </View>

            <Text style={[styles.logoText, { color: theme.textSecondary }]}>
              Alterar logo da empresa
            </Text>
          </View>

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
                  Indica que os dados principais foram conferidos.
                </Text>
              </View>

              <Switch
                value={isVerified}
                onValueChange={setIsVerified}
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

              <View style={styles.areasArea}>
                {serviceAreas.map((area) => {
                  const isSelected = selectedAreas.includes(area);

                  return (
                    <Pressable
                      key={area}
                      style={[
                        styles.areaChip,
                        {
                          backgroundColor: theme.card,
                          borderColor: theme.border,
                        },
                        isSelected && styles.areaChipActive,
                      ]}
                      onPress={() => toggleArea(area)}
                    >
                      <Text
                        style={[
                          styles.areaText,
                          { color: theme.textSecondary },
                          isSelected && styles.areaTextActive,
                        ]}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
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
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
              ]}
              onPress={handleSaveCompanyData}
            >
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
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

          <Text style={styles.headerTitle}>Dados da empresa</Text>

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

            <Text style={styles.logoText}>Alterar logo da empresa</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nome da empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da empresa"
              placeholderTextColor="#9CA3AF"
              value={companyName}
              onChangeText={setCompanyName}
            />

            <Text style={styles.label}>CNPJ</Text>
            <TextInput
              style={styles.input}
              placeholder="00.000.000/0000-00"
              placeholderTextColor="#9CA3AF"
              value={cnpj}
              onChangeText={setCnpj}
              keyboardType="numeric"
            />

            <Text style={styles.label}>E-mail comercial</Text>
            <TextInput
              style={styles.input}
              placeholder="empresa@email.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <Text style={styles.label}>Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Cidade / Estado</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Sorocaba - SP"
              placeholderTextColor="#9CA3AF"
              value={city}
              onChangeText={setCity}
            />

            <Text style={styles.label}>Endereço</Text>
            <TextInput
              style={styles.input}
              placeholder="Rua, número, bairro"
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.label}>Descrição da empresa</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Conte um pouco sobre a empresa"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />

            <View style={styles.verifiedCard}>
              <View>
                <Text style={styles.verifiedTitle}>Empresa verificada</Text>
                <Text style={styles.verifiedSubtitle}>
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
              <Text style={styles.sectionTitle}>Áreas de atuação</Text>

              <Text style={styles.sectionSubtitle}>
                Selecione as categorias em que sua empresa costuma contratar.
              </Text>

              <View style={styles.areasArea}>
                {serviceAreas.map((area) => {
                  const isSelected = selectedAreas.includes(area);

                  return (
                    <Pressable
                      key={area}
                      style={[styles.areaChip, isSelected && styles.areaChipActive]}
                      onPress={() => toggleArea(area)}
                    >
                      <Text
                        style={[
                          styles.areaText,
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

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Por que manter atualizado?</Text>

              <Text style={styles.infoText}>
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
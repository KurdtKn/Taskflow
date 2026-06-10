import { apiPost } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
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
import { styles } from "@/app/styles/createJob";
import { useTheme } from "@/app/context/ThemeContext";

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

  const { isDark, theme } = useTheme();

  function formatDate(value: string) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 4);

    if (numbersOnly.length <= 2) {
      return numbersOnly;
    }

    return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
  }

  function formatHour(value: string) {
    const numbersOnly = value.replace(/\D/g, "").slice(0, 4);

    if (numbersOnly.length <= 2) {
      return numbersOnly;
    }

    return `${numbersOnly.slice(0, 2)}:${numbersOnly.slice(2)}`;
  }

  function handleChangeDate(value: string) {
    setDate(formatDate(value));
  }

  function handleChangeHour(value: string) {
    setHour(formatHour(value));
  }

  const isDateValid = /^\d{2}\/\d{2}$/.test(date);
  const isHourValid = /^\d{2}:\d{2}$/.test(hour);

  const isFormValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    location.trim().length > 0 &&
    isDateValid &&
    isHourValid &&
    price.trim().length > 0;

  function getCategoryId(category: string) {
    const categoryMap: Record<string, number> = {
      Eventos: 1,
      Fotografia: 2,
      Manutenção: 5,
      Limpeza: 6,
      "Suporte técnico": 5,
      "Serviços gerais": 1,
    };

    return categoryMap[category] ?? 1;
  }

  function getServiceDate() {
    const [day, month] = date.split("/");
    const currentYear = new Date().getFullYear();

    return `${currentYear}-${month}-${day}T00:00:00`;
  }

  function getEstimatedValue() {
    const numbersOnly = price.replace(/\D/g, "");

    if (!numbersOnly) {
      return null;
    }

    return Number(numbersOnly);
  }

  function getCityAndState() {
    const [cityValue, stateValue] = location.split("-");

    return {
      city: cityValue?.trim() || null,
      state: stateValue?.trim() || null,
    };
  }

  async function handlePublishJob() {
    if (!isFormValid) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos obrigatórios.",
      );
      return;
    }

    try {
      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      if (loggedUser.tipoUsuario !== "empresa") {
        Alert.alert(
          "Acesso negado",
          "Apenas empresas podem publicar chamados.",
        );
        return;
      }

      if (!loggedUser.perfilId) {
        Alert.alert(
          "Perfil da empresa não encontrado",
          "Faça logout e entre novamente com a conta da empresa.",
        );
        return;
      }

      const { city, state } = getCityAndState();

      const response = await apiPost("/api/Chamados", {
        empresaId: Number(loggedUser.perfilId),
        categoriaId: getCategoryId(selectedCategory),
        titulo: title.trim(),
        descricao: description.trim(),
        localServico: location.trim(),
        cidade: city,
        estado: state,
        dataServico: getServiceDate(),
        horaServico: hour,
        valorEstimado: getEstimatedValue(),
      });

      console.log("Chamado publicado:", response);

      Alert.alert(
        "Chamado publicado",
        "Seu chamado foi publicado com sucesso.",
      );

      router.replace("/company-dashboard");
    } catch (error) {
      console.log("Erro ao publicar chamado:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível publicar o chamado agora.";

      Alert.alert("Erro ao publicar", errorMessage);
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
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
            Criar chamado
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
        >
          <View
            style={[
              styles.introCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.introTitle, { color: theme.text }]}>
              Publique uma nova demanda
            </Text>

            <Text style={[styles.introText, { color: theme.textSecondary }]}>
              Informe os detalhes do serviço para que freelancers próximos
              possam se candidatar ao chamado.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>
              Título do chamado
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
              placeholder="Ex: Garçom para evento"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={(value) => setTitle(value.slice(0, 100))}
              maxLength={100}
            />

            <Text style={[styles.label, { color: theme.text }]}>Categoria</Text>

            <View style={styles.categoriesArea}>
              {categories.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <Pressable
                    key={category}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                      },
                      isSelected && styles.categoryChipActive,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: theme.textSecondary },
                        isSelected && styles.categoryTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: theme.text }]}>
              Descrição do serviço
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
              placeholder="Descreva o que precisa ser feito, requisitos e observações importantes."
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={(value) => setDescription(value.slice(0, 500))}
              maxLength={500}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Local do serviço
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
              placeholder="Ex: Centro, Sorocaba - SP"
              placeholderTextColor={theme.textSecondary}
              value={location}
              onChangeText={(value) => setLocation(value.slice(0, 60))}
              maxLength={60}
            />

            <View style={styles.doubleInputArea}>
              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>Data</Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                      color: theme.text,
                    },
                  ]}
                  placeholder="Ex: 15/06"
                  placeholderTextColor={theme.textSecondary}
                  value={date}
                  onChangeText={handleChangeDate}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Horário
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
                  placeholder="Ex: 18:00"
                  placeholderTextColor={theme.textSecondary}
                  value={hour}
                  onChangeText={handleChangeHour}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
            </View>

            <View style={styles.doubleInputArea}>
              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Valor estimado
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
                  placeholder="Ex: R$200,00"
                  placeholderTextColor={theme.textSecondary}
                  value={price}
                  onChangeText={(value) =>
                    setPrice(value.replace(/\D/g, "").slice(0, 8))
                  }
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>

              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Profissionais
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
                  placeholder="Ex: 1"
                  placeholderTextColor={theme.textSecondary}
                  value={professionals}
                  onChangeText={(value) =>
                    setProfessionals(value.replace(/\D/g, "").slice(0, 2))
                  }
                  keyboardType="numeric"
                  maxLength={2}
                />
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
                Como funciona?
              </Text>

              <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                Após publicar o chamado, freelancers da região poderão
                visualizar a demanda e enviar uma solicitação. Você poderá
                analisar os candidatos antes de aceitar um profissional.
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

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

const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;
const LOCATION_MAX_LENGTH = 60;
const MAX_PRICE = 9999999;
const MAX_PROFESSIONALS = 99;

export default function CreateJobScreen() {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Eventos");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");
  const [price, setPrice] = useState("");
  const [professionals, setProfessionals] = useState("1");
  const [isPublishing, setIsPublishing] = useState(false);

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
  }

  function padTwo(value: number) {
    return String(value).padStart(2, "0");
  }

  function formatDate(value: string, currentValue: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 4);

    if (numbersOnly.length === 0) {
      return "";
    }

    if (numbersOnly.length <= 2) {
      const day = Number(numbersOnly);

      if (numbersOnly.length === 2 && (day < 1 || day > 31)) {
        return currentValue;
      }

      return numbersOnly;
    }

    const dayText = numbersOnly.slice(0, 2);
    const monthText = numbersOnly.slice(2);

    const day = Number(dayText);
    const month = Number(monthText);

    if (day < 1 || day > 31) {
      return currentValue;
    }

    if (monthText.length === 2) {
      if (month < 1 || month > 12) {
        return currentValue;
      }

      const currentYear = new Date().getFullYear();
      const maxDaysInMonth = new Date(currentYear, month, 0).getDate();

      if (day > maxDaysInMonth) {
        return currentValue;
      }
    }

    return `${dayText}/${monthText}`;
  }

  function normalizeDate(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 4);

    if (numbersOnly.length < 3) {
      return value;
    }

    const dayText = numbersOnly.slice(0, 2);
    const monthText = numbersOnly.slice(2);

    const day = Number(dayText);
    const month = Number(monthText);

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return value;
    }

    const currentYear = new Date().getFullYear();
    const maxDaysInMonth = new Date(currentYear, month, 0).getDate();

    if (day > maxDaysInMonth) {
      return value;
    }

    return `${padTwo(day)}/${padTwo(month)}`;
  }

  function formatHour(value: string, currentValue: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 4);

    if (numbersOnly.length === 0) {
      return "";
    }

    const hourText = numbersOnly.slice(0, 2);
    const minuteText = numbersOnly.slice(2, 4);

    if (hourText.length === 2) {
      const hourNumber = Number(hourText);

      if (hourNumber < 0 || hourNumber > 23) {
        return currentValue;
      }
    }

    if (minuteText.length === 2) {
      const minuteNumber = Number(minuteText);

      if (minuteNumber < 0 || minuteNumber > 59) {
        return currentValue;
      }
    }

    if (numbersOnly.length <= 2) {
      return numbersOnly;
    }

    return `${hourText}:${minuteText}`;
  }

  function normalizeHour(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 4);

    if (numbersOnly.length === 0) {
      return value;
    }

    if (numbersOnly.length <= 2) {
      const hourNumber = Number(numbersOnly);

      if (hourNumber < 0 || hourNumber > 23) {
        return value;
      }

      return `${padTwo(hourNumber)}:00`;
    }

    const hourText = numbersOnly.slice(0, 2);
    const minuteText = numbersOnly.slice(2);

    const hourNumber = Number(hourText);
    const minuteNumber = Number(minuteText);

    if (hourNumber < 0 || hourNumber > 23) {
      return value;
    }

    if (minuteNumber < 0 || minuteNumber > 59) {
      return value;
    }

    return `${padTwo(hourNumber)}:${padTwo(minuteNumber)}`;
  }

  function handleChangeDate(value: string) {
    setDate((currentValue) => formatDate(value, currentValue));
  }

  function handleChangeHour(value: string) {
    setHour((currentValue) => formatHour(value, currentValue));
  }

  function handleChangePrice(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 7);

    if (!numbersOnly) {
      setPrice("");
      return;
    }

    const valueNumber = Number(numbersOnly);

    if (valueNumber > MAX_PRICE) {
      setPrice(String(MAX_PRICE));
      return;
    }

    setPrice(String(valueNumber));
  }

  function handleChangeProfessionals(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 2);

    if (!numbersOnly) {
      setProfessionals("");
      return;
    }

    const quantity = Number(numbersOnly);

    if (quantity <= 0) {
      setProfessionals("");
      return;
    }

    if (quantity > MAX_PROFESSIONALS) {
      setProfessionals(String(MAX_PROFESSIONALS));
      return;
    }

    setProfessionals(String(quantity));
  }

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

  function getParsedServiceDateTime() {
    const normalizedDate = normalizeDate(date);
    const normalizedHour = normalizeHour(hour);

    if (!/^\d{2}\/\d{2}$/.test(normalizedDate)) {
      return null;
    }

    if (!/^\d{2}:\d{2}$/.test(normalizedHour)) {
      return null;
    }

    const [dayText, monthText] = normalizedDate.split("/");
    const [hourText, minuteText] = normalizedHour.split(":");

    const day = Number(dayText);
    const month = Number(monthText);
    const hourNumber = Number(hourText);
    const minute = Number(minuteText);
    const currentYear = new Date().getFullYear();

    const serviceDateTime = new Date(
      currentYear,
      month - 1,
      day,
      hourNumber,
      minute,
      0,
      0
    );

    const isRealDate =
      serviceDateTime.getFullYear() === currentYear &&
      serviceDateTime.getMonth() === month - 1 &&
      serviceDateTime.getDate() === day &&
      serviceDateTime.getHours() === hourNumber &&
      serviceDateTime.getMinutes() === minute;

    if (!isRealDate) {
      return null;
    }

    return serviceDateTime;
  }

  function isServiceDateTimeInFuture() {
    const serviceDateTime = getParsedServiceDateTime();

    if (!serviceDateTime) {
      return false;
    }

    return serviceDateTime.getTime() > new Date().getTime();
  }

  function getServiceDate() {
    const serviceDateTime = getParsedServiceDateTime();

    if (!serviceDateTime) {
      return "";
    }

    const year = serviceDateTime.getFullYear();
    const month = String(serviceDateTime.getMonth() + 1).padStart(2, "0");
    const day = String(serviceDateTime.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T00:00:00`;
  }

  function getEstimatedValue() {
    const numbersOnly = onlyNumbers(price);

    if (!numbersOnly) {
      return null;
    }

    return Number(numbersOnly);
  }

  function getProfessionalsQuantity() {
    const numbersOnly = onlyNumbers(professionals);

    if (!numbersOnly) {
      return 0;
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

  function getValidationError() {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();
    const estimatedValue = getEstimatedValue();
    const professionalsQuantity = getProfessionalsQuantity();

    if (!trimmedTitle) {
      return "Informe o título do chamado.";
    }

    if (trimmedTitle.length < 5) {
      return "O título precisa ter pelo menos 5 caracteres.";
    }

    if (!trimmedDescription) {
      return "Informe a descrição do serviço.";
    }

    if (trimmedDescription.length < 20) {
      return "A descrição precisa ter pelo menos 20 caracteres.";
    }

    if (!trimmedLocation) {
      return "Informe o local do serviço.";
    }

    if (trimmedLocation.length < 3) {
      return "O local precisa ter pelo menos 3 caracteres.";
    }

    if (!/^\d{2}\/\d{1,2}$/.test(date)) {
      return "Informe uma data no formato DD/MM.";
    }

    if (!/^\d{1,2}(:\d{1,2})?$/.test(hour)) {
      return "Informe um horário no formato HH:MM.";
    }

    if (!getParsedServiceDateTime()) {
      return "Informe uma data e um horário válidos.";
    }

    if (!isServiceDateTimeInFuture()) {
      return "A data e o horário do chamado precisam ser futuros.";
    }

    if (estimatedValue === null) {
      return "Informe o valor estimado do serviço.";
    }

    if (estimatedValue <= 0) {
      return "O valor estimado precisa ser maior que zero.";
    }

    if (estimatedValue > MAX_PRICE) {
      return "O valor estimado pode ser no máximo R$ 9.999.999.";
    }

    if (professionalsQuantity <= 0) {
      return "Informe pelo menos 1 profissional.";
    }

    if (professionalsQuantity > MAX_PROFESSIONALS) {
      return "O limite máximo é de 99 profissionais.";
    }

    return "";
  }

  const isFormValid = getValidationError() === "";

  async function handlePublishJob() {
    const validationError = getValidationError();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const normalizedDate = normalizeDate(date);
    const normalizedHour = normalizeHour(hour);

    setDate(normalizedDate);
    setHour(normalizedHour);

    try {
      setIsPublishing(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      if (loggedUser.tipoUsuario !== "empresa") {
        Alert.alert(
          "Acesso negado",
          "Apenas empresas podem publicar chamados."
        );
        return;
      }

      if (!loggedUser.perfilId) {
        Alert.alert(
          "Perfil da empresa não encontrado",
          "Faça logout e entre novamente com a conta da empresa."
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
        horaServico: normalizedHour,
        valorEstimado: getEstimatedValue(),
      });

      console.log("Chamado publicado:", response);

      Alert.alert(
        "Chamado publicado",
        "Seu chamado foi publicado com sucesso."
      );

      router.replace("/company-dashboard");
    } catch (error) {
      console.log("Erro ao publicar chamado:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível publicar o chamado agora.";

      Alert.alert("Erro ao publicar", errorMessage);
    } finally {
      setIsPublishing(false);
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
            Criar chamado
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="always"
          style={{ backgroundColor: theme.background }}
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
              style={[styles.input, cleanInputStyle]}
              placeholder="Ex: Garçom para evento"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={(value) =>
                setTitle(value.slice(0, TITLE_MAX_LENGTH))
              }
              maxLength={TITLE_MAX_LENGTH}
              editable={!isPublishing}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Categoria
            </Text>

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
                    disabled={isPublishing}
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

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={[styles.label, { color: theme.text }]}>
                Descrição do serviço
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
              style={[styles.input, styles.textArea, cleanInputStyle]}
              placeholder="Descreva o que precisa ser feito, requisitos e observações importantes."
              placeholderTextColor={theme.textSecondary}
              value={description}
              onChangeText={(value) =>
                setDescription(value.slice(0, DESCRIPTION_MAX_LENGTH))
              }
              maxLength={DESCRIPTION_MAX_LENGTH}
              multiline
              textAlignVertical="top"
              editable={!isPublishing}
            />

            <Text style={[styles.label, { color: theme.text }]}>
              Local do serviço
            </Text>

            <TextInput
              style={[styles.input, cleanInputStyle]}
              placeholder="Ex: Centro, Sorocaba - SP"
              placeholderTextColor={theme.textSecondary}
              value={location}
              onChangeText={(value) =>
                setLocation(value.slice(0, LOCATION_MAX_LENGTH))
              }
              maxLength={LOCATION_MAX_LENGTH}
              editable={!isPublishing}
            />

            <View style={styles.doubleInputArea}>
              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Data
                </Text>

                <TextInput
                  style={[styles.input, cleanInputStyle]}
                  placeholder="Ex: 15/06"
                  placeholderTextColor={theme.textSecondary}
                  value={date}
                  onChangeText={handleChangeDate}
                  onBlur={() =>
                    setDate((currentValue) => normalizeDate(currentValue))
                  }
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!isPublishing}
                />
              </View>

              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Horário
                </Text>

                <TextInput
                  style={[styles.input, cleanInputStyle]}
                  placeholder="Ex: 18:00"
                  placeholderTextColor={theme.textSecondary}
                  value={hour}
                  onChangeText={handleChangeHour}
                  onBlur={() =>
                    setHour((currentValue) => normalizeHour(currentValue))
                  }
                  keyboardType="numeric"
                  maxLength={5}
                  editable={!isPublishing}
                />
              </View>
            </View>

            <View style={styles.doubleInputArea}>
              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Valor estimado
                </Text>

                <TextInput
                  style={[styles.input, cleanInputStyle]}
                  placeholder="Ex: R$200,00"
                  placeholderTextColor={theme.textSecondary}
                  value={price}
                  onChangeText={handleChangePrice}
                  keyboardType="numeric"
                  maxLength={7}
                  editable={!isPublishing}
                />
              </View>

              <View style={styles.doubleInputBox}>
                <Text style={[styles.label, { color: theme.text }]}>
                  Profissionais
                </Text>

                <TextInput
                  style={[styles.input, cleanInputStyle]}
                  placeholder="Ex: 1"
                  placeholderTextColor={theme.textSecondary}
                  value={professionals}
                  onChangeText={handleChangeProfessionals}
                  keyboardType="numeric"
                  maxLength={2}
                  editable={!isPublishing}
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
              disabled={isPublishing}
              style={({ pressed }) => [
                styles.publishButton,
                (!isFormValid || isPublishing) && styles.publishButtonDisabled,
                pressed &&
                  !isPublishing &&
                  isFormValid &&
                  styles.publishButtonPressed,
              ]}
              onPress={handlePublishJob}
            >
              <Text style={styles.publishButtonText}>
                {isPublishing ? "Publicando..." : "Publicar chamado"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
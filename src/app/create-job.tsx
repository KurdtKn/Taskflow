import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";

import { apiPost } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";

type CriarChamadoResponse = {
  mensagem?: string;
  chamado?: {
    id?: number;
    empresaId?: number;
    categoriaId?: number;
    titulo?: string;
    descricao?: string;
    localServico?: string | null;
    cidade?: string | null;
    estado?: string | null;
    dataServico?: string | null;
    horaServico?: string | null;
    valorEstimado?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    quantidadeProfissionais?: number;
    status?: string;
  };
};

const DEFAULT_CATEGORIA_ID = 1;

function normalizeUserType(value?: string | null) {
  return value?.toLowerCase().trim();
}

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function clamp(value: number, min: number, max: number) {
  if (Number.isNaN(value)) {
    return min;
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}

function getTodayWithoutTime() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
}

function formatDateToInput(date: Date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}`;
}

function getLastDayOfMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function formatDateInput(value: string) {
  const numbers = onlyNumbers(value).slice(0, 4);

  if (numbers.length <= 2) {
    return numbers;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
}

function normalizeDateOnBlur(value: string) {
  const numbers = onlyNumbers(value).slice(0, 4);

  if (!numbers) {
    return "";
  }

  const today = getTodayWithoutTime();
  const currentYear = today.getFullYear();

  let day = Number(numbers.slice(0, 2));
  let month = Number(numbers.slice(2, 4));

  if (numbers.length <= 2) {
    month = today.getMonth() + 1;
  }

  if (Number.isNaN(day) || day <= 0) {
    day = today.getDate();
  }

  if (Number.isNaN(month) || month <= 0) {
    month = today.getMonth() + 1;
  }

  month = clamp(month, 1, 12);

  const lastDayOfMonth = getLastDayOfMonth(currentYear, month);

  day = clamp(day, 1, lastDayOfMonth);

  const selectedDate = new Date(currentYear, month - 1, day);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return formatDateToInput(today);
  }

  return `${pad2(day)}/${pad2(month)}`;
}

function convertDateToApi(value: string) {
  const normalizedDate = normalizeDateOnBlur(value);

  if (!normalizedDate) {
    return null;
  }

  const [dayText, monthText] = normalizedDate.split("/");
  const year = new Date().getFullYear();

  return `${year}-${monthText}-${dayText}`;
}

function formatHourInput(value: string) {
  const numbers = onlyNumbers(value).slice(0, 4);

  if (numbers.length <= 2) {
    return numbers;
  }

  return `${numbers.slice(0, 2)}:${numbers.slice(2)}`;
}

function normalizeHourOnBlur(value: string) {
  const numbers = onlyNumbers(value).slice(0, 4);

  if (!numbers) {
    return "";
  }

  let hour = Number(numbers.slice(0, 2));
  let minute = Number(numbers.slice(2, 4));

  if (numbers.length <= 2) {
    minute = 0;
  }

  hour = clamp(hour, 0, 23);
  minute = clamp(minute, 0, 59);

  return `${pad2(hour)}:${pad2(minute)}`;
}

function parseCurrencyToNumber(value: string) {
  if (!value.trim()) {
    return null;
  }

  const normalized = value
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();

  const parsed = Number(normalized);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export default function CreateJobScreen() {
  const { isDark, theme } = useTheme();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localServico, setLocalServico] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [dataServico, setDataServico] = useState("");
  const [horaServico, setHoraServico] = useState("");
  const [valorEstimado, setValorEstimado] = useState("");
  const [quantidadeProfissionais, setQuantidadeProfissionais] = useState("1");

  const [isCreating, setIsCreating] = useState(false);

  const quantidadeNumber = Number(quantidadeProfissionais);

  const hasMultipleProfessionals =
    !Number.isNaN(quantidadeNumber) && quantidadeNumber > 1;

  const inputStyle = [
    localStyles.input,
    {
      backgroundColor: theme.inputBackground,
      borderColor: theme.border,
      color: theme.text,
      ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
    },
  ];

  function resolveEmpresaId(loggedUserData: any) {
    const empresaId = Number(
      loggedUserData.perfilId ??
        loggedUserData.empresaId ??
        loggedUserData.idEmpresa ??
        loggedUserData.empresa_id
    );

    if (Number.isNaN(empresaId) || empresaId <= 0) {
      return null;
    }

    return empresaId;
  }

  function handleDateBlur() {
    setDataServico((currentValue) => normalizeDateOnBlur(currentValue));
  }

  function handleHourBlur() {
    setHoraServico((currentValue) => normalizeHourOnBlur(currentValue));
  }

  function validateForm() {
    if (!titulo.trim()) {
      Alert.alert("Título obrigatório", "Informe o título do chamado.");
      return false;
    }

    if (!descricao.trim()) {
      Alert.alert("Descrição obrigatória", "Informe a descrição do chamado.");
      return false;
    }

    if (!cidade.trim()) {
      Alert.alert(
        "Cidade obrigatória",
        "Informe a cidade para a TomTom gerar o ponto no mapa."
      );
      return false;
    }

    if (!estado.trim()) {
      Alert.alert(
        "Estado obrigatório",
        "Informe o estado para a TomTom gerar o ponto no mapa."
      );
      return false;
    }

    const quantidade = Number(quantidadeProfissionais);

    if (Number.isNaN(quantidade) || quantidade <= 0) {
      Alert.alert(
        "Quantidade inválida",
        "Informe pelo menos 1 profissional."
      );
      return false;
    }

    if (quantidade > 99) {
      Alert.alert(
        "Quantidade inválida",
        "O limite máximo é de 99 profissionais."
      );
      return false;
    }

    if (dataServico.trim()) {
      const normalizedDate = normalizeDateOnBlur(dataServico);

      if (!normalizedDate) {
        Alert.alert("Data inválida", "Informe uma data válida no formato DD/MM.");
        return false;
      }

      if (normalizedDate !== dataServico) {
        setDataServico(normalizedDate);
      }
    }

    if (horaServico.trim()) {
      const normalizedHour = normalizeHourOnBlur(horaServico);

      if (!normalizedHour) {
        Alert.alert(
          "Hora inválida",
          "Informe uma hora válida entre 00:00 e 23:59."
        );
        return false;
      }

      if (normalizedHour !== horaServico) {
        setHoraServico(normalizedHour);
      }
    }

    return true;
  }

  async function handleCreateJob() {
    if (isCreating) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsCreating(true);

      const loggedUser = await getLoggedUser();

      if (!loggedUser) {
        Alert.alert("Sessão expirada", "Faça login novamente.");
        router.replace("/login");
        return;
      }

      const loggedUserData = loggedUser as any;

      const tipoUsuario = normalizeUserType(
        loggedUserData.tipoUsuario ||
          loggedUserData.tipo_usuario ||
          loggedUserData.tipo
      );

      if (tipoUsuario !== "empresa") {
        Alert.alert(
          "Acesso negado",
          "Apenas empresas podem criar chamados."
        );
        return;
      }

      const empresaId = resolveEmpresaId(loggedUserData);

      if (!empresaId) {
        Alert.alert(
          "Empresa não encontrada",
          "Não foi possível identificar o perfil da empresa. Faça login novamente."
        );

        console.log("Usuário logado sem empresaId/perfilId:", loggedUserData);
        return;
      }

      const normalizedDate = dataServico.trim()
        ? normalizeDateOnBlur(dataServico)
        : "";

      const normalizedHour = horaServico.trim()
        ? normalizeHourOnBlur(horaServico)
        : "";

      const payload = {
        EmpresaId: empresaId,
        CategoriaId: DEFAULT_CATEGORIA_ID,
        Titulo: titulo.trim(),
        Descricao: descricao.trim(),
        LocalServico: localServico.trim() || null,
        Cidade: cidade.trim() || null,
        Estado: estado.trim().toUpperCase() || null,
        DataServico: normalizedDate ? convertDateToApi(normalizedDate) : null,
        HoraServico: normalizedHour || null,
        ValorEstimado: parseCurrencyToNumber(valorEstimado),
        QuantidadeProfissionais: Number(quantidadeProfissionais),
      };

      console.log("Criando chamado:", payload);

      const response = await apiPost<CriarChamadoResponse>(
        "/api/Chamados",
        payload
      );

      console.log("Chamado criado:", response);

      Alert.alert(
        "Chamado criado",
        "Seu chamado foi publicado com sucesso."
      );

      router.replace("/company-dashboard");
    } catch (error) {
      console.log("Erro ao criar chamado:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o chamado agora.";

      Alert.alert("Erro ao criar chamado", errorMessage);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        localStyles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={localStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[
            localStyles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [
              localStyles.backButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => router.back()}
          >
            <ArrowBack width={28} height={28} color={theme.text} />
          </Pressable>

          <Text style={[localStyles.headerTitle, { color: theme.text }]}>
            Criar chamado
          </Text>

          <View style={localStyles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.scrollContent}
        >
          <Text style={[localStyles.pageTitle, { color: theme.text }]}>
            Publique uma nova oportunidade
          </Text>

          <Text
            style={[
              localStyles.pageSubtitle,
              { color: theme.textSecondary },
            ]}
          >
            Preencha as informações do serviço. A API vai usar o endereço para
            gerar latitude e longitude com a TomTom.
          </Text>

          <View
            style={[
              localStyles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[localStyles.label, { color: theme.text }]}>
              Título do chamado
            </Text>

            <TextInput
              style={inputStyle}
              placeholder="Ex: Garçom para evento"
              placeholderTextColor={theme.textSecondary}
              value={titulo}
              onChangeText={setTitulo}
              maxLength={80}
            />

            <Text style={[localStyles.label, { color: theme.text }]}>
              Descrição
            </Text>

            <TextInput
              style={[
                inputStyle,
                {
                  minHeight: 110,
                  textAlignVertical: "top",
                  paddingTop: 14,
                },
              ]}
              placeholder="Descreva o serviço, responsabilidades e detalhes importantes..."
              placeholderTextColor={theme.textSecondary}
              value={descricao}
              onChangeText={setDescricao}
              multiline
              maxLength={600}
            />

            <Text style={[localStyles.label, { color: theme.text }]}>
              Local do serviço
            </Text>

            <TextInput
              style={inputStyle}
              placeholder="Ex: Centro, Shopping, Rua..."
              placeholderTextColor={theme.textSecondary}
              value={localServico}
              onChangeText={setLocalServico}
              maxLength={120}
            />

            <View style={localStyles.row}>
              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>
                  Cidade
                </Text>

                <TextInput
                  style={inputStyle}
                  placeholder="Sorocaba"
                  placeholderTextColor={theme.textSecondary}
                  value={cidade}
                  onChangeText={setCidade}
                  maxLength={80}
                />
              </View>

              <View style={localStyles.stateItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>
                  UF
                </Text>

                <TextInput
                  style={inputStyle}
                  placeholder="SP"
                  placeholderTextColor={theme.textSecondary}
                  value={estado}
                  onChangeText={(value) =>
                    setEstado(value.toUpperCase().slice(0, 2))
                  }
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <View style={localStyles.row}>
              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>
                  Data
                </Text>

                <TextInput
                  style={inputStyle}
                  placeholder="DD/MM"
                  placeholderTextColor={theme.textSecondary}
                  value={dataServico}
                  onChangeText={(value) =>
                    setDataServico(formatDateInput(value))
                  }
                  onBlur={handleDateBlur}
                  keyboardType="numeric"
                  maxLength={5}
                />

                <Text
                  style={[
                    localStyles.helperText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Se a data for inválida ou passada, ela será corrigida
                  automaticamente.
                </Text>
              </View>

              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>
                  Hora
                </Text>

                <TextInput
                  style={inputStyle}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.textSecondary}
                  value={horaServico}
                  onChangeText={(value) =>
                    setHoraServico(formatHourInput(value))
                  }
                  onBlur={handleHourBlur}
                  keyboardType="numeric"
                  maxLength={5}
                />

                <Text
                  style={[
                    localStyles.helperText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Horário permitido entre 00:00 e 23:59.
                </Text>
              </View>
            </View>

            <View style={localStyles.row}>
              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>
                  Valor
                </Text>

                <TextInput
                  style={inputStyle}
                  placeholder="Ex: 200,00"
                  placeholderTextColor={theme.textSecondary}
                  value={valorEstimado}
                  onChangeText={setValorEstimado}
                  keyboardType="decimal-pad"
                  maxLength={14}
                />
              </View>

              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>
                  Profissionais
                </Text>

                <TextInput
                  style={inputStyle}
                  placeholder="1"
                  placeholderTextColor={theme.textSecondary}
                  value={quantidadeProfissionais}
                  onChangeText={(value) => {
                    const numbers = onlyNumbers(value).slice(0, 2);
                    setQuantidadeProfissionais(numbers);
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                />
              </View>
            </View>

            {hasMultipleProfessionals && (
              <View
                style={[
                  localStyles.noticeBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(59,130,246,0.14)"
                      : "rgba(11,87,208,0.08)",
                    borderColor: isDark
                      ? "rgba(96,165,250,0.28)"
                      : "rgba(11,87,208,0.18)",
                  },
                ]}
              >
                <Text style={[localStyles.noticeTitle, { color: theme.text }]}>
                  Chamado com múltiplos profissionais
                </Text>

                <Text
                  style={[
                    localStyles.noticeText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Como este chamado precisa de mais de 1 profissional, ele
                  continuará disponível até que todas as vagas sejam preenchidas.
                  A empresa poderá aceitar freelancers conforme a quantidade
                  informada.
                </Text>
              </View>
            )}
          </View>

          <Pressable
            disabled={isCreating}
            style={({ pressed }) => [
              localStyles.button,
              isCreating && { opacity: 0.7 },
              pressed && !isCreating && { opacity: 0.85 },
            ]}
            onPress={handleCreateJob}
          >
            <Text style={localStyles.buttonText}>
              {isCreating ? "Publicando..." : "Publicar chamado"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  header: {
    height: 74,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
  },

  headerPlaceholder: {
    width: 44,
    height: 44,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 8,
  },

  pageSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
    marginBottom: 18,
  },

  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: "900",
    marginTop: 8,
  },

  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: "700",
  },

  helperText: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  rowItem: {
    flex: 1,
  },

  stateItem: {
    width: 86,
  },

  noticeBox: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },

  noticeTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 5,
  },

  noticeText: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },

  button: {
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
});
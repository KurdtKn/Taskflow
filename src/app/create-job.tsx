import { useState } from "react";
import {
  Alert,
  Image,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

import ArrowBack from "../../assets/icons/arrow_back.svg";

import { apiGet, apiPost } from "@/services/api";
import { getLoggedUser } from "@/services/storage";
import { addTaskFlowNotification } from "@/services/local-notifications";
import { useTheme } from "@/app/context/ThemeContext";
import { colors } from "@/styles/colors";

type CriarChamadoResponse = {
  id?: number | string;
  chamadoId?: number | string;
  chamado_id?: number | string;
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
    imagens?: string[] | string | null;
    imageUrls?: string[] | string | null;
    anexosImagem?: string[] | string | null;
  };
};

type EnderecoSugestao = {
  nome?: string;
  endereco: string;
  cidade?: string;
  estado?: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_CATEGORIA_ID = 1;

const MIN_VALOR_ESTIMADO = 1;
const MAX_VALOR_ESTIMADO = 1000000;

const DESCRIPTION_MIN_LENGTH = 20;
const DESCRIPTION_MAX_LENGTH = 500;

const MAX_IMAGE_ATTACHMENTS = 5;

const JOB_IMAGE_STORAGE_KEY = "@taskflow:job-images-by-key";

type LocalJobImageRecord = {
  imageUrls: string[];
  savedAt: string;
  jobId?: string;
  title?: string;
  localServico?: string;
  cidade?: string;
  estado?: string;
};

function normalizeStorageKeyPart(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function makeJobFingerprintKey(values: {
  title?: unknown;
  localServico?: unknown;
  cidade?: unknown;
  estado?: unknown;
}) {
  return [
    normalizeStorageKeyPart(values.title),
    normalizeStorageKeyPart(values.localServico),
    normalizeStorageKeyPart(values.cidade),
    normalizeStorageKeyPart(values.estado),
  ].join("|");
}

function uniqueImageUrls(urls: string[]) {
  return Array.from(
    new Set(urls.map((url) => normalizeImageUrl(url)).filter(Boolean))
  );
}

async function saveLocalJobImages(values: {
  jobId?: unknown;
  title: string;
  localServico: string;
  cidade: string;
  estado: string;
  imageUrls: string[];
}) {
  const uniqueUrls = uniqueImageUrls(values.imageUrls);

  if (uniqueUrls.length === 0) {
    return;
  }

  try {
    const rawStorage = await AsyncStorage.getItem(JOB_IMAGE_STORAGE_KEY);
    const currentStorage: Record<string, LocalJobImageRecord> = rawStorage
      ? JSON.parse(rawStorage)
      : {};

    const record: LocalJobImageRecord = {
      imageUrls: uniqueUrls,
      savedAt: new Date().toISOString(),
      jobId: values.jobId ? String(values.jobId) : undefined,
      title: values.title,
      localServico: values.localServico,
      cidade: values.cidade,
      estado: values.estado,
    };

    const keys = new Set<string>();
    const jobId = String(values.jobId ?? "").trim();

    if (jobId) {
      keys.add(`id:${jobId}`);
    }

    const fingerprintKey = makeJobFingerprintKey(values);

    if (fingerprintKey.replace(/\|/g, "")) {
      keys.add(`fingerprint:${fingerprintKey}`);
    }

    keys.forEach((key) => {
      currentStorage[key] = record;
    });

    await AsyncStorage.setItem(
      JOB_IMAGE_STORAGE_KEY,
      JSON.stringify(currentStorage)
    );
  } catch (error) {
    console.log("Erro ao salvar imagens locais do chamado:", error);
  }
}

function getCreatedJobId(response: CriarChamadoResponse) {
  const possibleId =
    response?.chamado?.id ?? response?.id ?? response?.chamadoId ?? response?.chamado_id;

  if (possibleId === null || possibleId === undefined || possibleId === "") {
    return "";
  }

  return String(possibleId);
}


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

function formatCurrencyInput(value: string) {
  const numbers = onlyNumbers(value).slice(0, 9);

  if (!numbers) {
    return "";
  }

  let cents = Number(numbers);
  const maxCents = MAX_VALOR_ESTIMADO * 100;

  if (cents > maxCents) {
    cents = maxCents;
  }

  const amount = cents / 100;

  return amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function parseCurrencyToNumber(value: string) {
  const numbers = onlyNumbers(value);

  if (!numbers) {
    return null;
  }

  const parsed = Number(numbers) / 100;

  if (
    Number.isNaN(parsed) ||
    parsed < MIN_VALOR_ESTIMADO ||
    parsed > MAX_VALOR_ESTIMADO
  ) {
    return null;
  }

  return Number(parsed.toFixed(2));
}

function normalizeTextValue(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeImageUrl(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isValidImageUrl(value: string) {
  const normalizedUrl = normalizeImageUrl(value);

  if (!normalizedUrl) {
    return false;
  }

  return /^https?:\/\//i.test(normalizedUrl);
}

function getDateFromInput(value: string) {
  const normalizedDate = normalizeDateOnBlur(value);

  if (!normalizedDate) {
    return null;
  }

  const [dayText, monthText] = normalizedDate.split("/");
  const year = new Date().getFullYear();

  const day = Number(dayText);
  const month = Number(monthText);

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    day <= 0 ||
    month <= 0
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);

  return date;
}

function isSameDate(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

function isHourBeforeNowForSelectedDate(dateValue: string, hourValue: string) {
  const selectedDate = getDateFromInput(dateValue);
  const normalizedHour = normalizeHourOnBlur(hourValue);

  if (!selectedDate || !normalizedHour) {
    return false;
  }

  const [hourText, minuteText] = normalizedHour.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return false;
  }

  const now = new Date();
  const selectedDateTime = new Date(selectedDate);

  selectedDateTime.setHours(hour, minute, 0, 0);

  return isSameDate(selectedDateTime, now) && selectedDateTime < now;
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
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [sugestoesEndereco, setSugestoesEndereco] = useState<EnderecoSugestao[]>([]);
  const [latitudeSelecionada, setLatitudeSelecionada] = useState<number | null>(null);
  const [longitudeSelecionada, setLongitudeSelecionada] = useState<number | null>(null);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const quantidadeNumber = Number(quantidadeProfissionais);

  const hasMultipleProfessionals =
    !Number.isNaN(quantidadeNumber) && quantidadeNumber > 1;

  const hasSelectedAddress =
    latitudeSelecionada !== null && longitudeSelecionada !== null;

  const normalizedDescription = normalizeTextValue(descricao);
  const descriptionLength = descricao.length;

  const isDescriptionValid =
    normalizedDescription.length >= DESCRIPTION_MIN_LENGTH &&
    normalizedDescription.length <= DESCRIPTION_MAX_LENGTH;

  const normalizedDateForValidation = dataServico.trim()
    ? normalizeDateOnBlur(dataServico)
    : "";

  const normalizedHourForValidation = horaServico.trim()
    ? normalizeHourOnBlur(horaServico)
    : "";

  const isSelectedHourInPast =
    Boolean(normalizedDateForValidation) &&
    Boolean(normalizedHourForValidation) &&
    isHourBeforeNowForSelectedDate(
      normalizedDateForValidation,
      normalizedHourForValidation
    );

  const quantidadeValidationNumber = Number(quantidadeProfissionais);

  const isFormValid =
    Boolean(titulo.trim()) &&
    isDescriptionValid &&
    Boolean(cidade.trim()) &&
    estado.trim().length === 2 &&
    Boolean(localServico.trim()) &&
    Boolean(normalizedDateForValidation) &&
    Boolean(normalizedHourForValidation) &&
    !isSelectedHourInPast &&
    !Number.isNaN(quantidadeValidationNumber) &&
    quantidadeValidationNumber > 0 &&
    quantidadeValidationNumber <= 99 &&
    parseCurrencyToNumber(valorEstimado) !== null;

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

  function handleDescriptionChange(value: string) {
    setDescricao(value.slice(0, DESCRIPTION_MAX_LENGTH));
  }

  async function handlePickImage() {
    if (imageUrls.length >= MAX_IMAGE_ATTACHMENTS) {
      Alert.alert(
        "Limite de imagens",
        `Você pode adicionar no máximo ${MAX_IMAGE_ATTACHMENTS} imagens por chamado.`
      );
      return;
    }

    try {
      if (Platform.OS !== "web") {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Permissão necessária",
            "Permita o acesso à galeria para selecionar imagens do chamado."
          );
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedUri = normalizeImageUrl(result.assets[0]?.uri ?? "");

      if (!selectedUri) {
        Alert.alert("Imagem inválida", "Não foi possível selecionar essa imagem.");
        return;
      }

      if (imageUrls.includes(selectedUri)) {
        Alert.alert("Imagem repetida", "Essa imagem já foi adicionada.");
        return;
      }

      setImageUrls((currentImages) => [...currentImages, selectedUri]);
    } catch (error) {
      console.log("Erro ao selecionar imagem do chamado:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem agora.");
    }
  }

  function removeImageUrl(imageUrl: string) {
    setImageUrls((currentImages) =>
      currentImages.filter((currentImage) => currentImage !== imageUrl)
    );
  }

  function clearSelectedCoordinates() {
    setLatitudeSelecionada(null);
    setLongitudeSelecionada(null);
  }

  async function buscarSugestoesEndereco(texto: string) {
    setLocalServico(texto);
    clearSelectedCoordinates();

    if (texto.trim().length < 3) {
      setSugestoesEndereco([]);
      return;
    }

    try {
      setIsSearchingAddress(true);

      const query = `/api/Chamados/sugestoes-endereco?texto=${encodeURIComponent(
        texto
      )}&cidade=${encodeURIComponent(cidade)}&estado=${encodeURIComponent(
        estado
      )}`;

      const response = await apiGet<EnderecoSugestao[]>(query);

      setSugestoesEndereco(Array.isArray(response) ? response : []);
    } catch (error) {
      console.log("Erro ao buscar sugestões de endereço:", error);
      setSugestoesEndereco([]);
    } finally {
      setIsSearchingAddress(false);
    }
  }

  function normalizeUf(value?: string | null) {
    if (!value) {
      return "";
    }

    const estadoTexto = value.toUpperCase().trim();

    if (estadoTexto === "SÃO PAULO" || estadoTexto === "SAO PAULO") {
      return "SP";
    }

    if (estadoTexto === "RIO DE JANEIRO") {
      return "RJ";
    }

    if (estadoTexto === "MINAS GERAIS") {
      return "MG";
    }

    return estadoTexto.slice(0, 2);
  }

  function selectEndereco(sugestao: EnderecoSugestao) {
    setLocalServico(sugestao.endereco);
    setLatitudeSelecionada(sugestao.latitude);
    setLongitudeSelecionada(sugestao.longitude);
    setSugestoesEndereco([]);

    if (sugestao.cidade) {
      setCidade(sugestao.cidade);
    }

    if (sugestao.estado) {
      setEstado(normalizeUf(sugestao.estado));
    }
  }

  function validateForm() {
    if (!titulo.trim()) {
      Alert.alert("Título obrigatório", "Informe o título do chamado.");
      return false;
    }

    const descricaoNormalizada = normalizeTextValue(descricao);

    if (!descricaoNormalizada) {
      Alert.alert("Descrição obrigatória", "Informe a descrição do chamado.");
      return false;
    }

    if (descricaoNormalizada.length < DESCRIPTION_MIN_LENGTH) {
      Alert.alert(
        "Descrição muito curta",
        `A descrição precisa ter pelo menos ${DESCRIPTION_MIN_LENGTH} caracteres.`
      );
      return false;
    }

    if (descricaoNormalizada.length > DESCRIPTION_MAX_LENGTH) {
      Alert.alert(
        "Descrição muito longa",
        `A descrição pode ter no máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`
      );
      return false;
    }

    if (!cidade.trim()) {
      Alert.alert("Cidade obrigatória", "Informe a cidade do chamado.");
      return false;
    }

    if (!estado.trim()) {
      Alert.alert("Estado obrigatório", "Informe a UF do chamado.");
      return false;
    }

    if (!localServico.trim()) {
      Alert.alert(
        "Local obrigatório",
        "Digite o endereço ou nome do local do serviço. Se aparecer uma sugestão, selecione para deixar o pin mais preciso."
      );
      return false;
    }

    if (!dataServico.trim()) {
      Alert.alert("Data obrigatória", "Informe a data do serviço.");
      return false;
    }

    if (!horaServico.trim()) {
      Alert.alert("Hora obrigatória", "Informe o horário do serviço.");
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

    const normalizedDate = normalizeDateOnBlur(dataServico);

    if (!normalizedDate) {
      Alert.alert(
        "Data inválida",
        "Informe uma data válida no formato DD/MM."
      );
      return false;
    }

    if (normalizedDate !== dataServico) {
      setDataServico(normalizedDate);
    }

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

    if (isHourBeforeNowForSelectedDate(normalizedDate, normalizedHour)) {
      Alert.alert(
        "Horário inválido",
        "Para chamados de hoje, o horário não pode ser antes do horário atual."
      );
      return false;
    }

    if (!valorEstimado.trim()) {
      Alert.alert(
        "Valor obrigatório",
        "Informe um valor entre R$ 1,00 e R$ 1.000.000,00."
      );
      return false;
    }

    const valorConvertido = parseCurrencyToNumber(valorEstimado);

    if (valorConvertido === null) {
      Alert.alert(
        "Valor inválido",
        "Informe um valor entre R$ 1,00 e R$ 1.000.000,00."
      );
      return false;
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

      const valorConvertido = parseCurrencyToNumber(valorEstimado);

      if (valorConvertido === null) {
        Alert.alert(
          "Valor inválido",
          "Informe um valor entre R$ 1,00 e R$ 1.000.000,00."
        );
        return;
      }

      const payload = {
        EmpresaId: empresaId,
        CategoriaId: DEFAULT_CATEGORIA_ID,
        Titulo: titulo.trim(),
        Descricao: normalizeTextValue(descricao),
        LocalServico: localServico.trim(),
        Cidade: cidade.trim(),
        Estado: estado.trim().toUpperCase(),
        DataServico: normalizedDate ? convertDateToApi(normalizedDate) : null,
        HoraServico: normalizedHour || null,
        ValorEstimado: valorConvertido,
        QuantidadeProfissionais: Number(quantidadeProfissionais),
        Latitude: latitudeSelecionada ?? null,
        Longitude: longitudeSelecionada ?? null,

        // Campos prontos para a API futura de anexos/imagens.
        // Quando a API aceitar esses campos, basta salvar e devolver "imagens" ou "imageUrls" no GET /api/Chamados.
        Imagens: imageUrls,
        ImageUrls: imageUrls,
        AnexosImagem: imageUrls,
      };

      console.log("Criando chamado:", payload);

      const response = await apiPost<CriarChamadoResponse>(
        "/api/Chamados",
        payload
      );

      console.log("Chamado criado:", response);

      const createdJobId = getCreatedJobId(response);
      const companyDisplayName = String(
        loggedUserData.nome ??
          loggedUserData.name ??
          loggedUserData.razaoSocial ??
          loggedUserData.razao_social ??
          "Empresa"
      ).trim();

      await saveLocalJobImages({
        jobId: createdJobId,
        title: titulo.trim(),
        localServico: localServico.trim(),
        cidade: cidade.trim(),
        estado: estado.trim().toUpperCase(),
        imageUrls,
      });

      await addTaskFlowNotification({
        audience: "freelancer",
        type: "new_job",
        title: "Novo chamado disponível",
        description: `${companyDisplayName} publicou: ${titulo.trim()}.`,
        jobId: createdJobId,
        chamadoId: createdJobId,
        jobTitle: titulo.trim(),
        companyId: String(empresaId),
        companyName: companyDisplayName,
        params: {
          id: createdJobId,
          jobId: createdJobId,
          chamadoId: createdJobId,
          title: titulo.trim(),
          location: localServico.trim(),
          city: cidade.trim(),
          state: estado.trim().toUpperCase(),
        },
        eventKey: `new-job:${createdJobId || titulo.trim()}`,
      });

      Alert.alert(
        "Chamado criado",
        imageUrls.length > 0
          ? "Seu chamado foi publicado com sucesso e as imagens foram salvas."
          : "Seu chamado foi publicado com sucesso."
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

          <Text style={[localStyles.headerTitle, { color: theme.text }]}>Criar chamado</Text>

          <View style={localStyles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={localStyles.scrollContent}
        >
          <Text style={[localStyles.pageTitle, { color: theme.text }]}>Publique uma nova oportunidade</Text>

          <Text
            style={[
              localStyles.pageSubtitle,
              { color: theme.textSecondary },
            ]}
          >
            Digite o endereço e selecione uma sugestão para deixar o pin mais preciso.
            Se não selecionar, a API tentará localizar automaticamente.
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
            <Text style={[localStyles.label, { color: theme.text }]}>Título do chamado</Text>

            <TextInput
              style={inputStyle}
              placeholder="Ex: Garçom para evento"
              placeholderTextColor={theme.textSecondary}
              value={titulo}
              onChangeText={setTitulo}
              maxLength={80}
            />

            <Text style={[localStyles.label, { color: theme.text }]}>Descrição</Text>

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
              onChangeText={handleDescriptionChange}
              multiline
              maxLength={DESCRIPTION_MAX_LENGTH}
            />

            <View style={localStyles.descriptionInfoRow}>
              <Text
                style={[
                  localStyles.descriptionHelper,
                  {
                    color: isDescriptionValid ? theme.textSecondary : "#DC2626",
                  },
                ]}
              >
                Mínimo de {DESCRIPTION_MIN_LENGTH} caracteres.
              </Text>

              <Text
                style={[
                  localStyles.descriptionCounter,
                  {
                    color:
                      descriptionLength >= DESCRIPTION_MAX_LENGTH
                        ? "#DC2626"
                        : theme.textSecondary,
                  },
                ]}
              >
                {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
              </Text>
            </View>

            <Text style={[localStyles.label, { color: theme.text }]}>
              Imagens do chamado
            </Text>

            <Text
              style={[
                localStyles.helperText,
                { color: theme.textSecondary },
              ]}
            >
              Campo opcional. Toque no botão + para selecionar imagens da galeria.
            </Text>

            <View style={localStyles.imagePickerRow}>
              <Text
                style={[
                  localStyles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                Até {MAX_IMAGE_ATTACHMENTS} imagens.
              </Text>

              <View style={localStyles.imagePickerActions}>
                <Text
                  style={[
                    localStyles.imageCounter,
                    {
                      color:
                        imageUrls.length >= MAX_IMAGE_ATTACHMENTS
                          ? "#DC2626"
                          : theme.textSecondary,
                    },
                  ]}
                >
                  {imageUrls.length}/{MAX_IMAGE_ATTACHMENTS}
                </Text>

                <Pressable
                  disabled={imageUrls.length >= MAX_IMAGE_ATTACHMENTS}
                  style={({ pressed }) => [
                    localStyles.addImageButton,
                    imageUrls.length >= MAX_IMAGE_ATTACHMENTS &&
                      localStyles.addImageButtonDisabled,
                    pressed && imageUrls.length < MAX_IMAGE_ATTACHMENTS && {
                      opacity: 0.82,
                    },
                  ]}
                  onPress={handlePickImage}
                >
                  <Text style={localStyles.addImageButtonText}>+</Text>
                </Pressable>
              </View>
            </View>

            {imageUrls.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={localStyles.imagesPreviewContent}
              >
                {imageUrls.map((imageUrl, index) => (
                  <View key={imageUrl} style={localStyles.imagePreviewCard}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={localStyles.imagePreview}
                      resizeMode="cover"
                    />

                    <View style={localStyles.imagePreviewBadge}>
                      <Text style={localStyles.imagePreviewBadgeText}>
                        {index + 1}
                      </Text>
                    </View>

                    <Pressable
                      style={localStyles.removeImageButton}
                      onPress={() => removeImageUrl(imageUrl)}
                    >
                      <Text style={localStyles.removeImageButtonText}>×</Text>
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}

            <View style={localStyles.row}>
              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>Cidade</Text>

                <TextInput
                  style={inputStyle}
                  placeholder="Sorocaba"
                  placeholderTextColor={theme.textSecondary}
                  value={cidade}
                  onChangeText={(value) => {
                    setCidade(value);
                    clearSelectedCoordinates();
                    setSugestoesEndereco([]);
                  }}
                  maxLength={80}
                />
              </View>

              <View style={localStyles.stateItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>UF</Text>

                <TextInput
                  style={inputStyle}
                  placeholder="SP"
                  placeholderTextColor={theme.textSecondary}
                  value={estado}
                  onChangeText={(value) => {
                    setEstado(value.toUpperCase().slice(0, 2));
                    clearSelectedCoordinates();
                    setSugestoesEndereco([]);
                  }}
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            <Text style={[localStyles.label, { color: theme.text }]}>Local do serviço</Text>

            <View
              style={[
                localStyles.addressSearchBox,
                {
                  backgroundColor: theme.inputBackground,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  localStyles.searchIcon,
                  { color: theme.textSecondary },
                ]}
              >
                🔍
              </Text>

              <TextInput
                style={[
                  localStyles.addressInput,
                  {
                    color: theme.text,
                    ...(Platform.OS === "web"
                      ? ({ outlineStyle: "none" } as any)
                      : {}),
                  },
                ]}
                placeholder="Digite o endereço ou nome do local"
                placeholderTextColor={theme.textSecondary}
                value={localServico}
                onChangeText={buscarSugestoesEndereco}
                maxLength={120}
              />
            </View>

            {isSearchingAddress && (
              <Text
                style={[
                  localStyles.helperText,
                  { color: theme.textSecondary },
                ]}
              >
                Buscando endereços...
              </Text>
            )}

            {sugestoesEndereco.length > 0 && (
              <View
                style={[
                  localStyles.addressSuggestionsBox,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                {sugestoesEndereco.map((sugestao, index) => {
                  const nome = sugestao.nome || sugestao.endereco.split(" - ")[0];
                  const enderecoCompleto = sugestao.endereco;

                  return (
                    <Pressable
                      key={`${sugestao.endereco}-${index}`}
                      style={({ pressed }) => [
                        localStyles.addressSuggestionItem,
                        pressed && {
                          backgroundColor: isDark
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(0,0,0,0.06)",
                        },
                      ]}
                      onPress={() => selectEndereco(sugestao)}
                    >
                      <View style={localStyles.addressIconCircle}>
                        <Text style={localStyles.addressPinIcon}>📍</Text>
                      </View>

                      <View style={localStyles.addressTextArea}>
                        <Text
                          style={[
                            localStyles.addressSuggestionTitle,
                            { color: theme.text },
                          ]}
                          numberOfLines={1}
                        >
                          {nome}
                        </Text>

                        <Text
                          style={[
                            localStyles.addressSuggestionSubtitle,
                            { color: theme.textSecondary },
                          ]}
                          numberOfLines={1}
                        >
                          {enderecoCompleto}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {hasSelectedAddress ? (
              <Text style={[localStyles.helperText, { color: colors.primary }]}>Endereço selecionado. O pin será criado neste local.</Text>
            ) : localServico.trim().length >= 3 ? (
              <Text style={[localStyles.helperText, { color: theme.textSecondary }]}>Nenhuma sugestão selecionada. A API tentará localizar automaticamente ao publicar.</Text>
            ) : null}

            <View style={localStyles.row}>
              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>Data</Text>

                <TextInput
                  style={inputStyle}
                  placeholder="DD/MM"
                  placeholderTextColor={theme.textSecondary}
                  value={dataServico}
                  onChangeText={(value) => setDataServico(formatDateInput(value))}
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
                  Se a data for inválida ou passada, ela será corrigida.
                </Text>
              </View>

              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>Hora</Text>

                <TextInput
                  style={inputStyle}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.textSecondary}
                  value={horaServico}
                  onChangeText={(value) => setHoraServico(formatHourInput(value))}
                  onBlur={handleHourBlur}
                  keyboardType="numeric"
                  maxLength={5}
                />

                <Text
                  style={[
                    localStyles.helperText,
                    {
                      color: isSelectedHourInPast
                        ? "#DC2626"
                        : theme.textSecondary,
                    },
                  ]}
                >
                  {isSelectedHourInPast
                    ? "Para hoje, o horário não pode ser antes do horário atual."
                    : "Horário permitido entre 00:00 e 23:59."}
                </Text>
              </View>
            </View>

            <View style={localStyles.row}>
              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>Valor</Text>

                <TextInput
                  style={inputStyle}
                  placeholder="Mín: R$ 1,00 | Máx: R$ 1.000.000,00"
                  placeholderTextColor={theme.textSecondary}
                  value={valorEstimado}
                  onChangeText={(value) => {
                    setValorEstimado(formatCurrencyInput(value));
                  }}
                  keyboardType="numeric"
                  maxLength={16}
                />
              </View>

              <View style={localStyles.rowItem}>
                <Text style={[localStyles.label, { color: theme.text }]}>Profissionais</Text>

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
                <Text style={[localStyles.noticeTitle, { color: theme.text }]}>Chamado com múltiplos profissionais</Text>

                <Text
                  style={[
                    localStyles.noticeText,
                    { color: theme.textSecondary },
                  ]}
                >
                  Como este chamado precisa de mais de 1 profissional, ele continuará disponível até que todas as vagas sejam preenchidas. A empresa poderá aceitar freelancers conforme a quantidade informada.
                </Text>
              </View>
            )}
          </View>

          <Pressable
            disabled={isCreating || !isFormValid}
            style={({ pressed }) => [
              localStyles.button,
              (isCreating || !isFormValid) && localStyles.buttonDisabled,
              pressed && !isCreating && isFormValid && { opacity: 0.85 },
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

  addressSearchBox: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  searchIcon: {
    fontSize: 17,
  },

  addressInput: {
    flex: 1,
    minHeight: 50,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 0,
  },

  addressSuggestionsBox: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },

  addressSuggestionItem: {
    minHeight: 62,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.22)",
  },

  addressIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(148,163,184,0.18)",
  },

  addressPinIcon: {
    fontSize: 16,
  },

  addressTextArea: {
    flex: 1,
  },

  addressSuggestionTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 3,
  },

  addressSuggestionSubtitle: {
    fontSize: 12,
    fontWeight: "700",
  },

  descriptionInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    gap: 10,
  },

  descriptionHelper: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },

  descriptionCounter: {
    fontSize: 12,
    fontWeight: "900",
  },

  imagePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  imagePickerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  addImageButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  addImageButtonDisabled: {
    backgroundColor: "rgba(100,116,139,0.45)",
  },

  addImageButtonText: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900",
  },

  imageInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 2,
  },

  imageCounter: {
    fontSize: 12,
    fontWeight: "900",
  },

  imagesPreviewContent: {
    gap: 12,
    paddingTop: 4,
    paddingBottom: 2,
  },

  imagePreviewCard: {
    width: 118,
    height: 92,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(148,163,184,0.18)",
    position: "relative",
  },

  imagePreview: {
    width: "100%",
    height: "100%",
  },

  imagePreviewBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 7,
    backgroundColor: "rgba(2,6,23,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },

  imagePreviewBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "900",
  },

  removeImageButton: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(220,38,38,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },

  removeImageButtonText: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: "900",
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

  buttonDisabled: {
    backgroundColor: "rgba(100,116,139,0.45)",
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
});

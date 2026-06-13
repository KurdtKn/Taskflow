import { useCallback, useMemo, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";

import { styles } from "../styles/home";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiGet } from "@/services/api";
import { getLoggedUser } from "@/services/storage";

import BellIcon from "../../../assets/icons/notifications.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import FilterIcon from "../../../assets/icons/filter.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import CalendarIcon from "../../../assets/icons/calendar.svg";

type CandidaturaApi = {
  id?: number;
  freelancerId?: number;
  status?: string | null;
  situacao?: string | null;
  statusCandidatura?: string | null;
};

type ChamadoApi = {
  id: number;
  empresaId: number;
  categoriaId: number;
  titulo: string;
  descricao: string;
  categoria: string;
  empresa: string;
  localServico?: string | null;
  cidade?: string | null;
  estado?: string | null;
  dataServico?: string | null;
  horaServico?: string | null;
  valorEstimado?: number | null;
  status: string;

  quantidadeProfissionais?: number | string | null;
  quantidade_profissionais?: number | string | null;
  totalProfissionais?: number | string | null;
  totalVagas?: number | string | null;
  vagasTotais?: number | string | null;
  professionals?: number | string | null;

  totalAceitos?: number | string | null;
  total_aceitos?: number | string | null;
  quantidadeAceitos?: number | string | null;
  profissionaisAceitos?: number | string | null;
  vagasPreenchidas?: number | string | null;

  vagasDisponiveis?: number | string | null;
  vagas_disponiveis?: number | string | null;

  candidaturas?: CandidaturaApi[];
};

type ChamadosResponse =
  | ChamadoApi[]
  | {
      data?: ChamadoApi[];
      dados?: ChamadoApi[];
      chamados?: ChamadoApi[];
    };

type ServiceItem = {
  id: string;
  title: string;
  description: string;
  company: string;
  category: string;
  price: string;
  distance: string;
  location: string;
  time: string;
  imageUrl?: string;
  totalProfessionals: number;
  acceptedProfessionals: number;
  availableSpots: number;
  vacanciesText: string;
  status: string;
};

const SEARCH_MAX_LENGTH = 60;

function normalizeSearchText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getChamadosFromResponse(response: ChamadosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return response.data ?? response.dados ?? response.chamados ?? [];
}

function parseNumberValue(value: unknown, fallback = 0) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return parsedValue;
}

function isAcceptedStatus(status?: string | null) {
  const normalizedStatus = status?.toLowerCase().trim();

  return (
    normalizedStatus === "aceito" ||
    normalizedStatus === "aceita" ||
    normalizedStatus === "aprovado" ||
    normalizedStatus === "aprovada" ||
    normalizedStatus === "accepted" ||
    normalizedStatus === "contratado" ||
    normalizedStatus === "contratada"
  );
}

function isUnavailableStatus(status?: string | null) {
  const normalizedStatus = status?.toLowerCase().trim();

  return (
    normalizedStatus === "finalizado" ||
    normalizedStatus === "finished" ||
    normalizedStatus === "concluido" ||
    normalizedStatus === "concluído" ||
    normalizedStatus === "cancelado" ||
    normalizedStatus === "cancelada" ||
    normalizedStatus === "canceled" ||
    normalizedStatus === "cancelled"
  );
}

function getTotalProfessionals(chamado: ChamadoApi) {
  const rawTotal =
    chamado.quantidadeProfissionais ??
    chamado.quantidade_profissionais ??
    chamado.totalProfissionais ??
    chamado.totalVagas ??
    chamado.vagasTotais ??
    chamado.professionals ??
    1;

  const total = parseNumberValue(rawTotal, 1);

  if (total <= 0) {
    return 1;
  }

  return total;
}

function getAcceptedProfessionals(chamado: ChamadoApi) {
  const rawAccepted =
    chamado.totalAceitos ??
    chamado.total_aceitos ??
    chamado.quantidadeAceitos ??
    chamado.profissionaisAceitos ??
    chamado.vagasPreenchidas;

  if (rawAccepted !== undefined && rawAccepted !== null) {
    const accepted = parseNumberValue(rawAccepted, 0);

    if (accepted <= 0) {
      return 0;
    }

    return accepted;
  }

  if (Array.isArray(chamado.candidaturas)) {
    return chamado.candidaturas.filter((candidatura) => {
      return (
        isAcceptedStatus(candidatura.status) ||
        isAcceptedStatus(candidatura.situacao) ||
        isAcceptedStatus(candidatura.statusCandidatura)
      );
    }).length;
  }

  return 0;
}

function getAvailableSpots(chamado: ChamadoApi) {
  const rawAvailableSpots =
    chamado.vagasDisponiveis ?? chamado.vagas_disponiveis;

  if (rawAvailableSpots !== undefined && rawAvailableSpots !== null) {
    const apiAvailableSpots = parseNumberValue(rawAvailableSpots, 1);

    if (apiAvailableSpots <= 0) {
      return 0;
    }

    return apiAvailableSpots;
  }

  const totalProfessionals = getTotalProfessionals(chamado);
  const acceptedProfessionals = getAcceptedProfessionals(chamado);

  const availableSpots = totalProfessionals - acceptedProfessionals;

  if (availableSpots <= 0) {
    return 0;
  }

  return availableSpots;
}

function getVacanciesText(availableSpots: number) {
  if (availableSpots <= 0) {
    return "Sem vagas disponíveis";
  }

  if (availableSpots === 1) {
    return "1 vaga disponível";
  }

  return `${availableSpots} vagas disponíveis`;
}

export default function HomeScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [search, setSearch] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("Usuário");

  const { isDark, theme } = useTheme();

  const homeIconColor = isDark ? colors.white : colors.black;

  const filtroCategoriaAtual = String(categoria || "Todos");
  const filtroCidadeAtual = String(cidade || "");
  const filtroValorMinAtual = String(valorMin || "");
  const filtroValorMaxAtual = String(valorMax || "");
  const buscaAtual = normalizeSearchText(search);

  const hasActiveFilters =
    (filtroCategoriaAtual !== "" && filtroCategoriaAtual !== "Todos") ||
    filtroCidadeAtual.trim() !== "" ||
    filtroValorMinAtual.trim() !== "" ||
    filtroValorMaxAtual.trim() !== "" ||
    buscaAtual !== "";

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [])
  );

  async function loadServices() {
    try {
      setIsLoading(true);

      const loggedUser = await getLoggedUser();

      if (loggedUser?.nome) {
        setUserName(loggedUser.nome.split(" ")[0]);
      }

      const response = await apiGet<ChamadosResponse>("/api/Chamados");
      const chamados = getChamadosFromResponse(response);

      console.log("Chamados recebidos na Home:", chamados);

      const mappedServices = chamados.map(mapChamadoToService);

      setServices(mappedServices);
    } catch (error) {
      console.log("Erro ao buscar chamados:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChangeSearch(value: string) {
    setSearch(value.slice(0, SEARCH_MAX_LENGTH));
  }

  function handleBlurSearch() {
    setSearch((currentValue) =>
      normalizeSearchText(currentValue).slice(0, SEARCH_MAX_LENGTH)
    );
  }

  function getGenericServiceImageUrl(id: string) {
    const images = [
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
    ];

    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
      return images[0];
    }

    return images[numericId % images.length];
  }

  function mapChamadoToService(chamado: ChamadoApi): ServiceItem {
    const id = String(chamado.id);
    const totalProfessionals = getTotalProfessionals(chamado);
    const acceptedProfessionals = getAcceptedProfessionals(chamado);
    const availableSpots = getAvailableSpots(chamado);

    console.log("Vagas do chamado:", {
      id: chamado.id,
      titulo: chamado.titulo,
      quantidadeProfissionais: chamado.quantidadeProfissionais,
      quantidade_profissionais: chamado.quantidade_profissionais,
      totalAceitos: chamado.totalAceitos,
      total_aceitos: chamado.total_aceitos,
      vagasDisponiveis: chamado.vagasDisponiveis,
      vagas_disponiveis: chamado.vagas_disponiveis,
      totalProfessionals,
      acceptedProfessionals,
      availableSpots,
    });

    return {
      id,
      title: chamado.titulo,
      description: chamado.descricao,
      company: chamado.empresa,
      category: chamado.categoria,
      price: formatPrice(chamado.valorEstimado),
      distance: formatDistance(chamado),
      location: formatLocation(chamado),
      time: formatDateTime(chamado.dataServico, chamado.horaServico),
      imageUrl: getGenericServiceImageUrl(id),
      totalProfessionals,
      acceptedProfessionals,
      availableSpots,
      vacanciesText: getVacanciesText(availableSpots),
      status: chamado.status,
    };
  }

  function formatPrice(value?: number | null) {
    if (!value || value <= 0) {
      return "A combinar";
    }

    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatLocation(chamado: ChamadoApi) {
    const city = chamado.cidade?.trim();
    const state = chamado.estado?.trim();
    const local = chamado.localServico?.trim();

    if (city && state) {
      return `${city} - ${state}`;
    }

    if (city) {
      return city;
    }

    if (local) {
      return local;
    }

    return "Local não informado";
  }

  function formatDistance(chamado: ChamadoApi) {
    const city = chamado.cidade?.trim();
    const state = chamado.estado?.trim();

    if (city && state) {
      return `${city} - ${state}`;
    }

    if (city) {
      return city;
    }

    return "Perto de você";
  }

  function formatDateTime(date?: string | null, hour?: string | null) {
    const formattedDate = formatDate(date);
    const formattedHour = formatHour(hour);

    if (formattedDate && formattedHour) {
      return `${formattedDate}, ${formattedHour}`;
    }

    if (formattedDate) {
      return formattedDate;
    }

    if (formattedHour) {
      return formattedHour;
    }

    return "Data a combinar";
  }

  function formatDate(date?: string | null) {
    if (!date) {
      return "";
    }

    const dateOnly = date.split("T")[0];
    const [year, month, day] = dateOnly.split("-");

    if (!year || !month || !day) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  function formatHour(hour?: string | null) {
    if (!hour) {
      return "";
    }

    return hour.slice(0, 5);
  }

  function handleOpenFilters() {
    router.push({
      pathname: "/job_filters",
      params: {
        categoria,
        cidade,
        valorMin,
        valorMax,
      },
    });
  }

  function handleClearFilters() {
    setSearch("");
    router.replace("/home");
  }

  function formatServicePriceToNumber(price: string) {
    if (price === "A combinar") {
      return 0;
    }

    return Number(price.replace(/\D/g, "")) / 100;
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const filtroCategoria = String(categoria || "Todos");
      const filtroCidade = String(cidade || "");
      const filtroValorMin = String(valorMin || "");
      const filtroValorMax = String(valorMax || "");
      const filtroBusca = normalizeSearchText(search).toLowerCase();

      const valorServico = formatServicePriceToNumber(service.price);

      const bateCategoria =
        filtroCategoria === "Todos" ||
        service.category.toLowerCase().includes(filtroCategoria.toLowerCase()) ||
        service.title.toLowerCase().includes(filtroCategoria.toLowerCase());

      const bateCidade =
        filtroCidade === "" ||
        service.location.toLowerCase().includes(filtroCidade.toLowerCase()) ||
        service.distance.toLowerCase().includes(filtroCidade.toLowerCase());

      const bateValorMin =
        filtroValorMin === "" || valorServico >= Number(filtroValorMin);

      const bateValorMax =
        filtroValorMax === "" || valorServico <= Number(filtroValorMax);

      const bateBusca =
        filtroBusca === "" ||
        service.title.toLowerCase().includes(filtroBusca) ||
        service.category.toLowerCase().includes(filtroBusca) ||
        service.company.toLowerCase().includes(filtroBusca) ||
        service.location.toLowerCase().includes(filtroBusca) ||
        service.distance.toLowerCase().includes(filtroBusca);

      const temVagaDisponivel = service.availableSpots > 0;
      const estaDisponivel = !isUnavailableStatus(service.status);

      return (
        temVagaDisponivel &&
        estaDisponivel &&
        bateCategoria &&
        bateCidade &&
        bateValorMin &&
        bateValorMax &&
        bateBusca
      );
    });
  }, [services, categoria, cidade, valorMin, valorMax, search]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ backgroundColor: theme.background }}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Olá, {userName}
            </Text>

            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Oportunidades perto de você
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => router.push("/notifications")}
          >
            <BellIcon
              width={24}
              height={24}
              color={homeIconColor}
              fill={homeIconColor}
            />
          </Pressable>
        </View>

        <View style={styles.searchArea}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.inputBackground,
                borderColor: "transparent",
                borderWidth: 0,
              },
            ]}
          >
            <SearchIcon
              width={20}
              height={20}
              color={homeIconColor}
              fill={homeIconColor}
            />

            <TextInput
              style={[
                styles.searchInput,
                {
                  color: theme.text,
                  backgroundColor: "transparent",
                  ...(Platform.OS === "web"
                    ? ({ outlineStyle: "none" } as any)
                    : {}),
                },
              ]}
              placeholder="Buscar serviços..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={handleChangeSearch}
              onBlur={handleBlurSearch}
              maxLength={SEARCH_MAX_LENGTH}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
            onPress={handleOpenFilters}
          >
            <FilterIcon
              width={24}
              height={24}
              color={homeIconColor}
              fill={homeIconColor}
            />
          </Pressable>
        </View>

        {hasActiveFilters && (
          <Pressable
            style={({ pressed }) => [
              styles.clearFiltersHome,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
              pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
            ]}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearFiltersHomeText}>Limpar filtros</Text>
          </Pressable>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Próximos de você
          </Text>

          <Pressable onPress={() => router.push("/map")}>
            <Text style={styles.seeMapText}>Ver no mapa &gt;</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <View style={{ paddingVertical: 32 }}>
            <Text
              style={{
                color: theme.textSecondary,
                textAlign: "center",
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              Carregando chamados...
            </Text>
          </View>
        ) : filteredServices.length === 0 ? (
          <View
            style={{
              paddingVertical: 36,
              paddingHorizontal: 18,
              borderRadius: 18,
              backgroundColor: theme.card,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: 16,
                fontWeight: "900",
                marginBottom: 6,
              }}
            >
              Nenhum chamado encontrado
            </Text>

            <Text
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                lineHeight: 19,
                textAlign: "center",
              }}
            >
              Quando empresas publicarem chamados disponíveis, eles aparecerão
              aqui.
            </Text>
          </View>
        ) : (
          <View style={styles.servicesList}>
            {filteredServices.map((service) => (
              <Pressable
                key={service.id}
                style={({ pressed }) => [
                  styles.serviceCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                  },
                  pressed && styles.serviceCardPressed,
                ]}
                onPress={() => {
                  router.push({
                    pathname: "/job-details",
                    params: {
                      id: service.id,
                      title: service.title,
                      description: service.description,
                      company: service.company,
                      category: service.category,
                      price: service.price,
                      distance: service.distance,
                      location: service.location,
                      time: service.time,
                      imageUrl: service.imageUrl ?? "",
                      totalProfessionals: String(service.totalProfessionals),
                      acceptedProfessionals: String(
                        service.acceptedProfessionals
                      ),
                      availableSpots: String(service.availableSpots),
                    },
                  });
                }}
              >
                <View style={styles.serviceContent}>
                  <Text style={[styles.serviceTitle, { color: theme.text }]}>
                    {service.title}
                  </Text>

                  <Text
                    style={{
                      color: theme.textSecondary,
                      fontSize: 12,
                      fontWeight: "800",
                      marginBottom: 6,
                    }}
                  >
                    {service.company} • {service.category}
                  </Text>

                  <Text style={styles.servicePrice}>{service.price}</Text>

                  <View style={styles.vacancyBadge}>
                    <View style={styles.vacancyDot} />

                    <Text style={styles.vacancyText}>
                      {service.vacanciesText}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <LocationIcon
                      width={15}
                      height={15}
                      color={homeIconColor}
                      fill={homeIconColor}
                    />

                    <Text
                      style={[
                        styles.infoText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {service.distance}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <CalendarIcon
                      width={16}
                      height={16}
                      color={homeIconColor}
                      fill={homeIconColor}
                    />

                    <Text
                      style={[
                        styles.infoText,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {service.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.serviceImageBox}>
                  <Image
                    source={{ uri: service.imageUrl }}
                    style={styles.serviceImage}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
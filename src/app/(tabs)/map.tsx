import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import FilterIcon from "../../../assets/icons/filter.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import TimeIcon from "../../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/map";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";
import { apiGet } from "@/services/api";

type PercentValue = `${number}%`;

type MapCoordinate = {
  latitude: number;
  longitude: number;
};

type MapRegion = MapCoordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

type MapService = {
  id: string;
  title: string;
  category: string;
  price: string;
  distance: string;
  location: string;
  time: string;
  description: string;
  latitude: number;
  longitude: number;
  position: {
    top: PercentValue;
    left: PercentValue;
  };
};

type ChamadoApi = {
  id?: number | string;
  Id?: number | string;
  titulo?: string;
  Titulo?: string;
  title?: string;
  descricao?: string;
  Descricao?: string;
  description?: string;
  categoriaNome?: string;
  CategoriaNome?: string;
  categoria?: string;
  Categoria?: string;
  category?: string;
  valorEstimado?: number | string | null;
  ValorEstimado?: number | string | null;
  valor_estimado?: number | string | null;
  price?: number | string | null;
  localServico?: string | null;
  LocalServico?: string | null;
  local_servico?: string | null;
  cidade?: string | null;
  Cidade?: string | null;
  estado?: string | null;
  Estado?: string | null;
  dataServico?: string | null;
  DataServico?: string | null;
  data_servico?: string | null;
  horaServico?: string | null;
  HoraServico?: string | null;
  hora_servico?: string | null;
  latitude?: number | string | null;
  Latitude?: number | string | null;
  longitude?: number | string | null;
  Longitude?: number | string | null;
  status?: string | null;
  Status?: string | null;
};

type ChamadosResponse =
  | ChamadoApi[]
  | {
      data?: ChamadoApi[];
      dados?: ChamadoApi[];
      chamados?: ChamadoApi[];
      items?: ChamadoApi[];
    };

const SEARCH_MAX_LENGTH = 60;

const DEFAULT_REGION: MapRegion = {
  latitude: -23.5015,
  longitude: -47.4526,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

function normalizeSearchText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeStatus(value?: string | null) {
  return String(value ?? "")
    .toLowerCase()
    .trim();
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return Number.isNaN(value) ? null : value;
  }

  if (typeof value !== "string") {
    return null;
  }

  const normalized = value
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const parsed = Number(normalized);

  return Number.isNaN(parsed) ? null : parsed;
}

function toText(value: unknown, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

  const text = String(value).trim();

  return text || fallback;
}

function formatCurrency(value: unknown) {
  const numberValue = toNumber(value);

  if (numberValue === null || numberValue <= 0) {
    return "Valor a combinar";
  }

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "";
  }

  const datePart = text.split("T")[0];

  if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}`;
  }

  if (/^\d{2}\/\d{2}/.test(text)) {
    return text.slice(0, 5);
  }

  return text;
}

function formatHour(value: unknown) {
  const text = toText(value);

  if (!text) {
    return "";
  }

  if (text.includes(":")) {
    return text.slice(0, 5);
  }

  return text;
}

function formatTimeText(dateValue: unknown, hourValue: unknown) {
  const date = formatDate(dateValue);
  const hour = formatHour(hourValue);

  if (date && hour) {
    return `${date}, ${hour}`;
  }

  if (date) {
    return date;
  }

  if (hour) {
    return hour;
  }

  return "Data a combinar";
}

function calculateDistanceKm(
  origin: MapCoordinate | null,
  destination: MapCoordinate,
) {
  if (!origin) {
    return null;
  }

  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;

  const latDistance = toRadians(destination.latitude - origin.latitude);
  const longDistance = toRadians(destination.longitude - origin.longitude);

  const a =
    Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
    Math.cos(toRadians(origin.latitude)) *
      Math.cos(toRadians(destination.latitude)) *
      Math.sin(longDistance / 2) *
      Math.sin(longDistance / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function getChamadosFromResponse(response: ChamadosResponse) {
  if (Array.isArray(response)) {
    return response;
  }

  return (
    response.data ?? response.dados ?? response.chamados ?? response.items ?? []
  );
}

function getFakeMapPositions(services: Omit<MapService, "position">[]) {
  if (services.length === 0) {
    return [];
  }

  const latitudes = services.map((service) => service.latitude);
  const longitudes = services.map((service) => service.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLong = Math.min(...longitudes);
  const maxLong = Math.max(...longitudes);

  const latRange = maxLat - minLat || 1;
  const longRange = maxLong - minLong || 1;

  return services.map((service) => {
    const latPercent = (service.latitude - minLat) / latRange;
    const longPercent = (service.longitude - minLong) / longRange;

    const top = Math.round(88 - latPercent * 76);
    const left = Math.round(12 + longPercent * 76);

    return {
      ...service,
      position: {
        top: `${top}%` as PercentValue,
        left: `${left}%` as PercentValue,
      },
    };
  });
}

function mapChamadoToService(
  chamado: ChamadoApi,
  userLocation: MapCoordinate | null,
): Omit<MapService, "position"> | null {
  const status = normalizeStatus(chamado.status ?? chamado.Status);

  if (status && status !== "aberto") {
    return null;
  }

  const latitude = toNumber(chamado.latitude ?? chamado.Latitude);
  const longitude = toNumber(chamado.longitude ?? chamado.Longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  const id = toText(chamado.id ?? chamado.Id);

  if (!id) {
    return null;
  }

  const title = toText(
    chamado.titulo ?? chamado.Titulo ?? chamado.title,
    "Chamado disponível",
  );
  const category = toText(
    chamado.categoriaNome ??
      chamado.CategoriaNome ??
      chamado.categoria ??
      chamado.Categoria ??
      chamado.category,
    "Serviço",
  );
  const description = toText(
    chamado.descricao ?? chamado.Descricao ?? chamado.description,
  );
  const localServico = toText(
    chamado.localServico ?? chamado.LocalServico ?? chamado.local_servico,
  );
  const cidade = toText(chamado.cidade ?? chamado.Cidade);
  const estado = toText(chamado.estado ?? chamado.Estado);
  const price = formatCurrency(
    chamado.valorEstimado ??
      chamado.ValorEstimado ??
      chamado.valor_estimado ??
      chamado.price,
  );
  const time = formatTimeText(
    chamado.dataServico ?? chamado.DataServico ?? chamado.data_servico,
    chamado.horaServico ?? chamado.HoraServico ?? chamado.hora_servico,
  );

  const locationParts = [localServico, cidade, estado].filter(Boolean);
  const location =
    locationParts.length > 0 ? locationParts.join(", ") : "Local não informado";

  const distanceKm = calculateDistanceKm(userLocation, { latitude, longitude });
  const distance =
    distanceKm === null
      ? cidade && estado
        ? `${cidade} - ${estado}`
        : "Toque no ícone de localização"
      : distanceKm < 1
        ? `${Math.round(distanceKm * 1000)} m de distância`
        : `${distanceKm.toFixed(1).replace(".", ",")} km de distância`;

  return {
    id,
    title,
    category,
    price,
    distance,
    location,
    time,
    description,
    latitude,
    longitude,
  };
}

function getServiceValue(price: string) {
  const value = Number(price.replace(/\D/g, "")) / 100;

  if (Number.isNaN(value)) {
    return 0;
  }

  return value;
}

export default function MapScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [services, setServices] = useState<MapService[]>([]);
  const [selectedService, setSelectedService] = useState<MapService | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [region, setRegion] = useState<MapRegion>(DEFAULT_REGION);
  const [userLocation, setUserLocation] = useState<MapCoordinate | null>(null);

  const { isDark, theme } = useTheme();

  const iconColor = isDark ? colors.white : colors.black;
  const iconBoxColor = colors.black;

  const loadMapServices = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await apiGet<ChamadosResponse>("/api/Chamados");
      const chamados = getChamadosFromResponse(response);

      const mappedServicesWithoutPosition = chamados
        .map((chamado) => mapChamadoToService(chamado, userLocation))
        .filter((service): service is Omit<MapService, "position"> =>
          Boolean(service),
        );

      const mappedServices = getFakeMapPositions(mappedServicesWithoutPosition);

      setServices(mappedServices);

      if (mappedServices.length > 0) {
        const firstService = mappedServices[0];

        setSelectedService(firstService);

        const nextRegion = {
          latitude: firstService.latitude,
          longitude: firstService.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        setRegion(nextRegion);
      } else {
        setSelectedService(null);
      }
    } catch (error) {
      console.log("Erro ao carregar chamados do mapa:", error);
      setServices([]);
      setSelectedService(null);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  useFocusEffect(
    useCallback(() => {
      loadMapServices();
    }, [loadMapServices]),
  );

  function handleChangeSearch(value: string) {
    setSearch(value.slice(0, SEARCH_MAX_LENGTH));
  }

  function handleBlurSearch() {
    setSearch((currentValue) =>
      normalizeSearchText(currentValue).slice(0, SEARCH_MAX_LENGTH),
    );
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

  async function handleUseCurrentLocation() {
    if (Platform.OS === "web") {
      Alert.alert(
        "Mapa no celular",
        "No navegador, o app mostra uma prévia dos pontos. Para mapa nativo real, precisamos separar um componente .native.tsx depois.",
      );
      return;
    }

    try {
      const Location = require("expo-location");

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Não foi possível acessar sua localização.",
        );
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({});

      const nextLocation = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      const nextRegion = {
        ...nextLocation,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

      setUserLocation(nextLocation);
      setRegion(nextRegion);
    } catch (error) {
      console.log("Erro ao buscar localização atual:", error);
      Alert.alert(
        "Erro de localização",
        "Não foi possível buscar sua localização atual. Confira se o expo-location está instalado.",
      );
    }
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const filtroCategoria = String(categoria || "Todos");
      const filtroCidade = String(cidade || "");
      const filtroValorMin = String(valorMin || "");
      const filtroValorMax = String(valorMax || "");
      const filtroBusca = normalizeSearchText(search).toLowerCase();

      const valorServico = getServiceValue(service.price);

      const bateCategoria =
        filtroCategoria === "Todos" ||
        service.category
          .toLowerCase()
          .includes(filtroCategoria.toLowerCase()) ||
        service.title.toLowerCase().includes(filtroCategoria.toLowerCase());

      const bateCidade =
        filtroCidade === "" ||
        service.location.toLowerCase().includes(filtroCidade.toLowerCase()) ||
        service.distance.toLowerCase().includes(filtroCidade.toLowerCase());

      const minValue = Number(filtroValorMin);
      const maxValue = Number(filtroValorMax);

      const bateValorMin =
        filtroValorMin === "" ||
        Number.isNaN(minValue) ||
        valorServico >= minValue;

      const bateValorMax =
        filtroValorMax === "" ||
        Number.isNaN(maxValue) ||
        valorServico <= maxValue;

      const bateBusca =
        filtroBusca === "" ||
        service.title.toLowerCase().includes(filtroBusca) ||
        service.category.toLowerCase().includes(filtroBusca) ||
        service.location.toLowerCase().includes(filtroBusca) ||
        service.distance.toLowerCase().includes(filtroBusca);

      return (
        bateCategoria && bateCidade && bateValorMin && bateValorMax && bateBusca
      );
    });
  }, [services, categoria, cidade, valorMin, valorMax, search]);

  useEffect(() => {
    if (filteredServices.length === 0) {
      setSelectedService(null);
      return;
    }

    const selectedStillVisible = filteredServices.some(
      (service) => service.id === selectedService?.id,
    );

    if (!selectedStillVisible) {
      setSelectedService(filteredServices[0]);
    }
  }, [filteredServices, selectedService?.id]);

  function handleOpenDetails() {
    if (!selectedService) {
      return;
    }

    router.push({
      pathname: "/job-details",
      params: {
        id: selectedService.id,
        jobId: selectedService.id,
        chamadoId: selectedService.id,
        title: selectedService.title,
        category: selectedService.category,
        price: selectedService.price,
        distance: selectedService.distance,
        location: selectedService.location,
        time: selectedService.time,
        description: selectedService.description,
        latitude: String(selectedService.latitude),
        longitude: String(selectedService.longitude),
      },
    });
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Mapa de chamados
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Serviços disponíveis perto de você
        </Text>
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
            width={22}
            height={22}
            color={iconColor}
            fill={iconColor}
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
            placeholder="Buscar no mapa..."
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
              backgroundColor: colors.white,
              borderColor: colors.white,
              borderWidth: 0,
            },
            pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
          ]}
          onPress={handleOpenFilters}
        >
          <FilterIcon
            width={28}
            height={28}
            color={iconBoxColor}
            fill={iconBoxColor}
          />
        </Pressable>
      </View>

      <View
        style={[
          styles.mapContainer,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.mapBackground,
            {
              backgroundColor: isDark ? "#0F172A" : "#EAF1FF",
            },
          ]}
        >
          <View style={[styles.road, styles.roadHorizontalOne]} />
          <View style={[styles.road, styles.roadHorizontalTwo]} />
          <View style={[styles.road, styles.roadVerticalOne]} />
          <View style={[styles.road, styles.roadVerticalTwo]} />

          {filteredServices.map((service) => {
            const isSelected = selectedService?.id === service.id;

            return (
              <Pressable
                key={service.id}
                style={[
                  styles.pin,
                  service.position,
                  isSelected && styles.pinSelected,
                ]}
                onPress={() => setSelectedService(service)}
              >
                <View style={styles.pinCircle}>
                  <Text style={styles.pinText}>●</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={[
            styles.currentLocationButton,
            {
              backgroundColor: colors.white,
              borderColor: colors.white,
              borderWidth: 0,
            },
          ]}
          onPress={handleUseCurrentLocation}
        >
          <LocationIcon
            width={24}
            height={24}
            color={colors.black}
            fill={colors.black}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <View
          style={[
            styles.serviceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Carregando chamados...
          </Text>

          <Text style={[styles.cardCategory, { color: theme.textSecondary }]}>
            Buscando serviços disponíveis para exibir no mapa.
          </Text>
        </View>
      ) : filteredServices.length === 0 || !selectedService ? (
        <View
          style={[
            styles.serviceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Nenhum chamado encontrado
          </Text>

          <Text style={[styles.cardCategory, { color: theme.textSecondary }]}>
            Quando houver chamados com latitude e longitude, eles aparecerão
            aqui no mapa.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.serviceCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={localStyles.cardTitleArea}>
              <Text
                style={[styles.cardTitle, { color: theme.text }]}
                numberOfLines={2}
              >
                {selectedService.title}
              </Text>

              <Text
                style={[styles.cardCategory, { color: theme.textSecondary }]}
              >
                {selectedService.category}
              </Text>
            </View>

            <Text style={styles.cardPrice}>{selectedService.price}</Text>
          </View>

          <View style={styles.infoRow}>
            <LocationIcon
              width={16}
              height={16}
              color={iconColor}
              fill={iconColor}
            />

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {selectedService.distance} - {selectedService.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <TimeIcon
              width={16}
              height={16}
              color={iconColor}
              fill={iconColor}
            />

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              {selectedService.time}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.detailsButton,
              pressed && styles.detailsButtonPressed,
            ]}
            onPress={handleOpenDetails}
          >
            <Text style={styles.detailsButtonText}>Ver detalhes</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  cardTitleArea: {
    flex: 1,
    paddingRight: 10,
  },
});

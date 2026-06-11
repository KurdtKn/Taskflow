import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Platform,
  Pressable,
  SafeAreaView,
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

type PercentValue = `${number}%`;

type MapService = {
  id: string;
  title: string;
  category: string;
  price: string;
  distance: string;
  location: string;
  time: string;
  position: {
    top: PercentValue;
    left: PercentValue;
  };
};

const SEARCH_MAX_LENGTH = 60;

function normalizeSearchText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export default function MapScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [services, setServices] = useState<MapService[]>([]);
  const [selectedService, setSelectedService] = useState<MapService | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  const iconColor = isDark ? colors.white : colors.black;
  const iconBoxColor = colors.black;

  useEffect(() => {
    loadMapServices();
  }, []);

  async function loadMapServices() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a busca dos chamados disponíveis no mapa.

        Exemplo:
        const response = await jobsService.getMapJobs({
          categoria,
          cidade,
          valorMin,
          valorMax,
          search,
        });

        setServices(response);
      */

      setServices([]);
    } catch (error) {
      console.log("Erro ao carregar chamados do mapa:", error);
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

  function getServiceValue(price: string) {
    const value = Number(price.replace(/\D/g, "")) / 100;

    if (Number.isNaN(value)) {
      return 0;
    }

    return value;
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
        service.location.toLowerCase().includes(filtroBusca) ||
        service.distance.toLowerCase().includes(filtroBusca);

      return (
        bateCategoria &&
        bateCidade &&
        bateValorMin &&
        bateValorMax &&
        bateBusca
      );
    });
  }, [services, categoria, cidade, valorMin, valorMax, search]);

  useEffect(() => {
    if (filteredServices.length > 0) {
      setSelectedService(filteredServices[0]);
      return;
    }

    setSelectedService(null);
  }, [filteredServices]);

  function handleOpenDetails() {
    if (!selectedService) {
      return;
    }

    router.push({
      pathname: "/job-details",
      params: {
        id: selectedService.id,
        title: selectedService.title,
        category: selectedService.category,
        price: selectedService.price,
        distance: selectedService.distance,
        location: selectedService.location,
        time: selectedService.time,
      },
    });
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
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
            Quando houver chamados disponíveis, eles aparecerão aqui no mapa.
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
            <View>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                {selectedService.title}
              </Text>

              <Text style={[styles.cardCategory, { color: theme.textSecondary }]}>
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
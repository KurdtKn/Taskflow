import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "../styles/home";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

import BellIcon from "../../../assets/icons/notifications.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import FilterIcon from "../../../assets/icons/filter.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import CalendarIcon from "../../../assets/icons/calendar.svg";

type ServiceItem = {
  id: string;
  title: string;
  category: string;
  price: string;
  distance: string;
  location: string;
  time: string;
  imageUrl?: string;
};

export default function HomeScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [search, setSearch] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isDark, theme } = useTheme();

  const hasActiveFilters =
    categoria || cidade || valorMin || valorMax || search;

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setIsLoading(true);

      /*
        Aqui futuramente entra a API.

        Exemplo:
        const response = await jobsService.getAvailableJobs();
        setServices(response);

        Por enquanto deixamos vazio para remover os dados forjados.
      */

      setServices([]);
    } catch (error) {
      console.log("Erro ao buscar chamados:", error);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
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
    router.push("/(tabs)/home");
  }

  function formatServicePriceToNumber(price: string) {
    return Number(price.replace(/\D/g, "")) / 100;
  }

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const filtroCategoria = String(categoria || "Todos");
      const filtroCidade = String(cidade || "");
      const filtroValorMin = String(valorMin || "");
      const filtroValorMax = String(valorMax || "");
      const filtroBusca = search.toLowerCase().trim();

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
        service.location.toLowerCase().includes(filtroBusca) ||
        service.distance.toLowerCase().includes(filtroBusca);

      return (
        bateCategoria && bateCidade && bateValorMin && bateValorMax && bateBusca
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
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Olá, Usuário
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
            <BellIcon width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.searchArea}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <SearchIcon width={22} height={22} />

            <TextInput
              style={[
                styles.searchInput,
                { color: theme.text },
              ]}
              placeholder="Buscar serviços..."
              placeholderTextColor={theme.textSecondary}
              value={search}
              onChangeText={setSearch}
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
            <FilterIcon width={28} height={28} />
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
              Quando a API retornar chamados disponíveis, eles aparecerão aqui.
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
                      title: service.title,
                      category: service.category,
                      price: service.price,
                      distance: service.distance,
                      location: service.location,
                      time: service.time,
                    },
                  });
                }}
              >
                <View style={styles.serviceContent}>
                  <Text style={[styles.serviceTitle, { color: theme.text }]}>
                    {service.title}
                  </Text>

                  <Text style={styles.servicePrice}>{service.price}</Text>

                  <View style={styles.infoRow}>
                    <LocationIcon
                      width={15}
                      height={15}
                      color={colors.location}
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
                    <CalendarIcon width={15} height={15} />

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

                {service.imageUrl && (
                  <View style={styles.serviceImageBox}>
                    <Image
                      source={{ uri: service.imageUrl }}
                      style={styles.serviceImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
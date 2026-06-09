import { API_URL } from "@/services/api";
import { useEffect, useState } from "react";
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

const serviceImage = require("../../../assets/images/garcom.jpg");
const serviceImage2 = require("../../../assets/images/Encanador.png");
const serviceImage3 = require("../../../assets/images/fotografo.png");

type Chamado = {
  id: number;
  titulo: string;
  descricao?: string;
  categoria?: string;
  valorEstimado?: number;
  cidade?: string;
  estado?: string;
  localServico?: string;
  dataServico?: string;
  horaServico?: string;
};

export default function HomeScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [search, setSearch] = useState("");
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [carregando, setCarregando] = useState(true);

  const { isDark, theme } = useTheme();

  useEffect(() => {
    async function buscarChamados() {
      try {
        const response = await fetch(`${API_URL}/Chamados`);

        if (!response.ok) {
          throw new Error("Erro ao buscar chamados da API");
        }

        const data = await response.json();

        console.log("Chamados vindos da API:", data);
        setChamados(data);
      } catch (error) {
        console.log("Erro ao buscar chamados:", error);
      } finally {
        setCarregando(false);
      }
    }

    buscarChamados();
  }, []);

  const hasActiveFilters =
    categoria || cidade || valorMin || valorMax || search;

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

  function formatarValor(valor?: number) {
    if (valor === null || valor === undefined) {
      return "Valor a combinar";
    }

    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarDataHora(data?: string, hora?: string) {
    if (!data && !hora) {
      return "Data a combinar";
    }

    if (data && hora) {
      return `${data} às ${hora}`;
    }

    if (data) {
      return data;
    }

    return hora;
  }

  function getServiceImage(chamado: Chamado) {
    const categoriaChamado = chamado.categoria?.toLowerCase() || "";
    const tituloChamado = chamado.titulo?.toLowerCase() || "";

    if (
      categoriaChamado.includes("manutenção") ||
      categoriaChamado.includes("hidráulica") ||
      tituloChamado.includes("reparo") ||
      tituloChamado.includes("hidráulico")
    ) {
      return serviceImage2;
    }

    if (
      categoriaChamado.includes("fotografia") ||
      tituloChamado.includes("fotógrafo") ||
      tituloChamado.includes("fotografo")
    ) {
      return serviceImage3;
    }

    return serviceImage;
  }

  const filteredServices = chamados.filter((service) => {
    const filtroCategoria = String(categoria || "Todos");
    const filtroCidade = String(cidade || "");
    const filtroValorMin = String(valorMin || "");
    const filtroValorMax = String(valorMax || "");
    const filtroBusca = search.toLowerCase().trim();

    const valorServico = service.valorEstimado || 0;

    const titulo = service.titulo?.toLowerCase() || "";
    const categoriaServico = service.categoria?.toLowerCase() || "";
    const cidadeServico = service.cidade?.toLowerCase() || "";
    const localServico = service.localServico?.toLowerCase() || "";

    const bateCategoria =
      filtroCategoria === "Todos" ||
      categoriaServico.includes(filtroCategoria.toLowerCase()) ||
      titulo.includes(filtroCategoria.toLowerCase());

    const bateCidade =
      filtroCidade === "" ||
      cidadeServico.includes(filtroCidade.toLowerCase()) ||
      localServico.includes(filtroCidade.toLowerCase());

    const bateValorMin =
      filtroValorMin === "" || valorServico >= Number(filtroValorMin);

    const bateValorMax =
      filtroValorMax === "" || valorServico <= Number(filtroValorMax);

    const bateBusca =
      filtroBusca === "" ||
      titulo.includes(filtroBusca) ||
      categoriaServico.includes(filtroBusca) ||
      cidadeServico.includes(filtroBusca) ||
      localServico.includes(filtroBusca);

    return (
      bateCategoria && bateCidade && bateValorMin && bateValorMax && bateBusca
    );
  });

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

        <View style={styles.servicesList}>
          {carregando && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Carregando chamados...
            </Text>
          )}

          {!carregando && filteredServices.length === 0 && (
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Nenhum chamado encontrado.
            </Text>
          )}

          {filteredServices.map((service) => (
            <Pressable
              key={String(service.id)}
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
                    title: service.titulo,
                    category: service.categoria || "Serviço",
                    price: formatarValor(service.valorEstimado),
                    distance: `${service.cidade || "Cidade não informada"} - ${
                      service.estado || "UF"
                    }`,
                    location: service.localServico || "Local não informado",
                    time: formatarDataHora(
                      service.dataServico,
                      service.horaServico
                    ),
                    description: service.descricao || "",
                  },
                });
              }}
            >
              <View style={styles.serviceContent}>
                <Text style={[styles.serviceTitle, { color: theme.text }]}>
                  {service.titulo}
                </Text>

                <Text style={styles.servicePrice}>
                  {formatarValor(service.valorEstimado)}
                </Text>

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
                    {service.cidade || "Cidade não informada"} -{" "}
                    {service.estado || "UF"}
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
                    {formatarDataHora(service.dataServico, service.horaServico)}
                  </Text>
                </View>
              </View>

              <View style={styles.serviceImageBox}>
                <Image
                  source={getServiceImage(service)}
                  style={styles.serviceImage}
                  resizeMode="cover"
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
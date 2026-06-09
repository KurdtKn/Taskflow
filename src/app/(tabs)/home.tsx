import { useState } from "react";
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

import BellIcon from "../../../assets/icons/notifications.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import FilterIcon from "../../../assets/icons/filter.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import CalendarIcon from "../../../assets/icons/calendar.svg";

const serviceImage = require("../../../assets/images/garcom.jpg");
const serviceImage2 = require("../../../assets/images/Encanador.png");
const serviceImage3 = require("../../../assets/images/fotografo.png");

const services = [
  {
    id: "1",
    title: "Garçom para Evento",
    category: "Eventos",
    price: "R$200,00",
    distance: "1,5 km - Centro",
    location: "Centro",
    time: "Hoje, 18:00",
    image: serviceImage,
  },
  {
    id: "2",
    title: "Reparo Hidráulico",
    category: "Manutenção",
    price: "R$150,00",
    distance: "3,2 km - Jardim Paulista",
    location: "Jardim Paulista",
    time: "Amanhã, 9:00",
    image: serviceImage2,
  },
  {
    id: "3",
    title: "Fotógrafo Profissional",
    category: "Fotografia",
    price: "R$300,00",
    distance: "2,0 km - Moema",
    location: "Moema",
    time: "Sábado, 14:00",
    image: serviceImage3,
  },
];

export default function HomeScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();
  const [search, setSearch] = useState("");
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

  const filteredServices = services.filter((service) => {
    const filtroCategoria = String(categoria || "Todos");
    const filtroCidade = String(cidade || "");
    const filtroValorMin = String(valorMin || "");
    const filtroValorMax = String(valorMax || "");
    const filtroBusca = search.toLowerCase().trim();

    const valorServico = Number(service.price.replace(/\D/g, "")) / 100;

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Usuário</Text>
            <Text style={styles.subtitle}>Oportunidades perto de você</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => router.push("/notifications")}
          >
            <BellIcon width={24} height={24} />
          </Pressable>
        </View>

        <View style={styles.searchArea}>
          <View style={styles.searchBox}>
            <SearchIcon width={22} height={22} />

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar serviços..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
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
      pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] },
    ]}
    onPress={handleClearFilters}
  >
    <Text style={styles.clearFiltersHomeText}>Limpar filtros</Text>
  </Pressable>
)}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos de você</Text>

          <Pressable onPress={() => router.push("/map")}>
            <Text style={styles.seeMapText}>Ver no mapa &gt;</Text>
          </Pressable>
        </View>

        <View style={styles.servicesList}>
          {filteredServices.map((service) => (
            <Pressable
              key={service.id}
              style={({ pressed }) => [
                styles.serviceCard,
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
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>

                <View style={styles.infoRow}>
                  <LocationIcon width={15} height={15} color={colors.location}/>
                  <Text style={styles.infoText}>{service.distance}</Text>
                </View>

                <View style={styles.infoRow}>
                  <CalendarIcon width={15} height={15} />
                  <Text style={styles.infoText}>{service.time}</Text>
                </View>
              </View>

              <View style={styles.serviceImageBox}>
                <Image
                  source={service.image}
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

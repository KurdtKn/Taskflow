import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, Text, TextInput, View } from "react-native";

import FilterIcon from "../../../assets/icons/filter.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import LocationIcon from "../../../assets/icons/Location-check.svg";
import TimeIcon from "../../../assets/icons/access_time.svg";
import { styles } from "@/app/styles/map";
import { colors } from "@/styles/colors";

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

const mapServices: MapService[] = [
  {
    id: "1",
    title: "Garçom para Evento",
    category: "Evento",
    price: "R$200,00",
    distance: "1,5 km",
    location: "Centro",
    time: "Hoje, 18:00",
    position: {
      top: "28%",
      left: "58%",
    },
  },
  {
    id: "2",
    title: "Reparo Hidráulico",
    category: "Manutenção",
    price: "R$150,00",
    distance: "3,2 km",
    location: "Jardim Paulista",
    time: "Amanhã, 9:00",
    position: {
      top: "48%",
      left: "32%",
    },
  },
  {
    id: "3",
    title: "Fotógrafo Profissional",
    category: "Fotografia",
    price: "R$300,00",
    distance: "2,0 km",
    location: "Moema",
    time: "Sábado, 14:00",
    position: {
      top: "62%",
      left: "70%",
    },
  },
];

export default function MapScreen() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [selectedService, setSelectedService] = useState<MapService>(
    mapServices[0]
  );

  const [search, setSearch] = useState("");

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

  const filteredServices = mapServices.filter((service) => {
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
      bateCategoria &&
      bateCidade &&
      bateValorMin &&
      bateValorMax &&
      bateBusca
    );
  });

  useEffect(() => {
    if (filteredServices.length > 0) {
      setSelectedService(filteredServices[0]);
    }
  }, [categoria, cidade, valorMin, valorMax, search]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>Mapa de chamados</Text>
        <Text style={styles.subtitle}>Serviços disponíveis perto de você</Text>
      </View>

      <View style={styles.searchArea}>
        <View style={styles.searchBox}>
          <SearchIcon width={22} height={22} />

          <TextInput
            style={styles.searchInput}
            placeholder="Buscar no mapa..."
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

      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          <View style={[styles.road, styles.roadHorizontalOne]} />
          <View style={[styles.road, styles.roadHorizontalTwo]} />
          <View style={[styles.road, styles.roadVerticalOne]} />
          <View style={[styles.road, styles.roadVerticalTwo]} />

          <Text style={[styles.mapLabel, styles.mapLabelOne]}>Centro</Text>
          <Text style={[styles.mapLabel, styles.mapLabelTwo]}>Jardim</Text>
          <Text style={[styles.mapLabel, styles.mapLabelThree]}>Moema</Text>

          {filteredServices.map((service) => {
            const isSelected = selectedService.id === service.id;

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

        <Pressable style={styles.currentLocationButton}>
          <LocationIcon width={24} height={24} color={colors.blue[300]}/>
        </Pressable>
      </View>

      {filteredServices.length === 0 ? (
        <View style={styles.serviceCard}>
          <Text style={styles.cardTitle}>Nenhum chamado encontrado</Text>
          <Text style={styles.cardCategory}>
            Tente alterar a busca ou os filtros aplicados.
          </Text>
        </View>
      ) : (
        <View style={styles.serviceCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>{selectedService.title}</Text>
              <Text style={styles.cardCategory}>{selectedService.category}</Text>
            </View>

            <Text style={styles.cardPrice}>{selectedService.price}</Text>
          </View>

          <View style={styles.infoRow}>
            <LocationIcon width={16} height={16} color={colors.location}/>

            <Text style={styles.infoText}>
              {selectedService.distance} - {selectedService.location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <TimeIcon width={16} height={16} />

            <Text style={styles.infoText}>{selectedService.time}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕒</Text>
            <Text style={styles.infoText}>{selectedService.time}</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.detailsButton,
              pressed && styles.detailsButtonPressed,
            ]}
            onPress={() => {
              router.push({
                pathname: "/job-details",
                params: {
                  title: selectedService.title,
                  category: selectedService.category,
                  price: selectedService.price,
                  distance: selectedService.distance,
                  location: selectedService.location,
                  time: selectedService.time,
                },
              });
            }}
          >
            <Text style={styles.detailsButtonText}>Ver detalhes</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
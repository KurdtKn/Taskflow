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
import { router } from "expo-router";

import { styles } from "../styles/home";

import BellIcon from "../../../assets/icons/notifications.svg";
import SearchIcon from "../../../assets/icons/search.svg";
import FilterIcon from "../../../assets/icons/settings.svg";
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
  function handleOpenFilters() {
    console.log("Abrir filtros");

    // Quando criarmos a tela job-filters.tsx, troca por:
    // router.push("/job-filters");
  }

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
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.filterButton,
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
            onPress={handleOpenFilters}
          >
            <FilterIcon width={22} height={22} />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos de você</Text>

          <Pressable onPress={() => router.push("/map")}>
            <Text style={styles.seeMapText}>Ver no mapa &gt;</Text>
          </Pressable>
        </View>

        <View style={styles.servicesList}>
          {services.map((service) => (
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
                  <LocationIcon width={15} height={15} />
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
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

const services = [
  {
    id: "1",
    title: "Garçom para Evento",
    price: "R$200,00",
    distance: "1,5 km - Centro",
    time: "Hoje, 18:00",
    icon: "🍽️",
  },
  {
    id: "2",
    title: "Reparo Hidráulico",
    price: "R$150,00",
    distance: "3,2 km - Jardim Paulista",
    time: "Amanhã, 9:00",
    icon: "🔧",
  },
  {
    id: "3",
    title: "Fotógrafo Profissional",
    price: "R$300,00",
    distance: "2,0 km - Moema",
    time: "Sábado, 14:00",
    icon: "📸",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, Usuário👋</Text>
            <Text style={styles.subtitle}>Oportunidades perto de você</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && { opacity: 0.75, transform: [{ scale: 0.96 }] },
            ]}
            onPress={() => router.push("/notifications")}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>

        <View style={styles.searchArea}>
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>

            <TextInput
              style={styles.searchInput}
              placeholder="Buscar serviços..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <Pressable style={styles.filterButton}>
            <Text style={styles.filterIcon}>☷</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos de você</Text>

          <Pressable onPress={() => router.push("/map")}>
            <Text style={styles.seeMapText}>Ver No Mapa &gt;</Text>
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
                    category: "Serviço",
                    price: service.price,
                    distance: service.distance,
                    location: "Região próxima",
                    time: service.time,
                  },
                });
              }}
            >
              <View style={styles.serviceContent}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>📍</Text>
                  <Text style={styles.infoText}>{service.distance}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoIcon}>🕒</Text>
                  <Text style={styles.infoText}>{service.time}</Text>
                </View>
              </View>

              <View style={styles.serviceImageBox}>
                <Text style={styles.serviceEmoji}>{service.icon}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
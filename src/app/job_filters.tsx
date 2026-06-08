import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import { styles } from "@/app/styles/jobFilters";

const categories = [
  "Todos",
  "Garçom",
  "Fotógrafo",
  "DJ",
  "Limpeza",
  "Manutenção",
  "Babá",
  "Eventos",
];

export default function JobFilters() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [city, setCity] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  function applyFilters() {
  router.push({
    pathname: "/(tabs)/home",
    params: {
      categoria: selectedCategory,
      cidade: city,
      valorMin: minValue,
      valorMax: maxValue,
    },
  });
}

  function clearFilters() {
  setSelectedCategory("Todos");
  setCity("");
  setMinValue("");
  setMaxValue("");

  router.push("/(tabs)/home");
}

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View>
          <Text style={styles.title}>Filtros</Text>
          <Text style={styles.subtitle}>Encontre chamados do seu jeito</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Categoria do serviço</Text>

          <View style={styles.chipArea}>
            {categories.map((item) => {
              const isSelected = selectedCategory === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setSelectedCategory(item)}
                  style={({ pressed }) => [
                    styles.chip,
                    isSelected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Localização</Text>

          <Text style={styles.label}>Cidade ou local</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Sorocaba"
            placeholderTextColor="#9CA3AF"
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Faixa de valor</Text>

          <View style={styles.doubleInputArea}>
            <View style={styles.doubleInputBox}>
              <Text style={styles.label}>Mínimo</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 50"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={minValue}
                onChangeText={(text) =>
                  setMinValue(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>

            <View style={styles.doubleInputBox}>
              <Text style={styles.label}>Máximo</Text>
              <TextInput
                style={styles.input}
                placeholder="R$ 300"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={maxValue}
                onChangeText={(text) =>
                  setMaxValue(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.pressed,
          ]}
          onPress={clearFilters}
        >
          <Text style={styles.clearButtonText}>Limpar</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.applyButton,
            pressed && styles.pressed,
          ]}
          onPress={applyFilters}
        >
          <Text style={styles.applyButtonText}>Aplicar filtros</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
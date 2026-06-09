import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { styles } from "@/app/styles/jobFilters";
import { useTheme } from "@/app/context/ThemeContext";

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
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const [selectedCategory, setSelectedCategory] = useState(
    String(categoria || "Todos")
  );

  const [city, setCity] = useState(String(cidade || ""));

  const [minValue, setMinValue] = useState(String(valorMin || ""));

  const [maxValue, setMaxValue] = useState(String(valorMax || ""));

  const { isDark, theme } = useTheme();

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
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.text }]}>‹</Text>
        </Pressable>

        <View>
          <Text style={[styles.title, { color: theme.text }]}>
            Filtros
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Encontre chamados do seu jeito
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Categoria do serviço
          </Text>

          <View style={styles.chipArea}>
            {categories.map((item) => {
              const isSelected = selectedCategory === item;

              return (
                <Pressable
                  key={item}
                  onPress={() => setSelectedCategory(item)}
                  style={({ pressed }) => [
                    styles.chip,
                    {
                      backgroundColor: theme.inputBackground,
                      borderColor: theme.border,
                    },
                    isSelected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: theme.textSecondary },
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

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Localização
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>
            Cidade ou local
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
                color: theme.text,
              },
            ]}
            placeholder="Ex: Sorocaba"
            placeholderTextColor={theme.textSecondary}
            value={city}
            onChangeText={setCity}
          />
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Faixa de valor
          </Text>

          <View style={styles.doubleInputArea}>
            <View style={styles.doubleInputBox}>
              <Text style={[styles.label, { color: theme.text }]}>
                Mínimo
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="R$ 50"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={minValue}
                onChangeText={(text) =>
                  setMinValue(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>

            <View style={styles.doubleInputBox}>
              <Text style={[styles.label, { color: theme.text }]}>
                Máximo
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="R$ 300"
                placeholderTextColor={theme.textSecondary}
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

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderColor: theme.border,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.clearButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.pressed,
          ]}
          onPress={clearFilters}
        >
          <Text style={[styles.clearButtonText, { color: theme.text }]}>
            Limpar
          </Text>
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
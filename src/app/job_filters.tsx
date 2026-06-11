import { useState } from "react";
import {
  Alert,
  Platform,
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

const CATEGORY_MAX_LENGTH = 40;
const CITY_MAX_LENGTH = 60;
const MAX_PRICE = 9999999;

function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

export default function JobFilters() {
  const { categoria, cidade, valorMin, valorMax } = useLocalSearchParams();

  const categoriaInicial =
    String(categoria || "") === "Todos" ? "" : String(categoria || "");

  const [category, setCategory] = useState(
    categoriaInicial.slice(0, CATEGORY_MAX_LENGTH)
  );
  const [city, setCity] = useState(String(cidade || "").slice(0, CITY_MAX_LENGTH));
  const [minValue, setMinValue] = useState(String(valorMin || ""));
  const [maxValue, setMaxValue] = useState(String(valorMax || ""));

  const { isDark, theme } = useTheme();

  const cleanInputStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    color: theme.text,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  function handleChangeCategory(value: string) {
    setCategory(value.slice(0, CATEGORY_MAX_LENGTH));
  }

  function handleChangeCity(value: string) {
    setCity(value.slice(0, CITY_MAX_LENGTH));
  }

  function handleChangeMinValue(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 7);

    if (!numbersOnly) {
      setMinValue("");
      return;
    }

    const valueNumber = Number(numbersOnly);

    if (valueNumber > MAX_PRICE) {
      setMinValue(String(MAX_PRICE));
      return;
    }

    setMinValue(String(valueNumber));
  }

  function handleChangeMaxValue(value: string) {
    const numbersOnly = onlyNumbers(value).slice(0, 7);

    if (!numbersOnly) {
      setMaxValue("");
      return;
    }

    const valueNumber = Number(numbersOnly);

    if (valueNumber > MAX_PRICE) {
      setMaxValue(String(MAX_PRICE));
      return;
    }

    setMaxValue(String(valueNumber));
  }

  function getValidationError() {
    const min = minValue ? Number(minValue) : null;
    const max = maxValue ? Number(maxValue) : null;

    if (category.trim().length > CATEGORY_MAX_LENGTH) {
      return `A categoria pode ter no máximo ${CATEGORY_MAX_LENGTH} caracteres.`;
    }

    if (city.trim().length > CITY_MAX_LENGTH) {
      return `A cidade pode ter no máximo ${CITY_MAX_LENGTH} caracteres.`;
    }

    if (min !== null && min > MAX_PRICE) {
      return "O valor mínimo pode ser no máximo R$ 9.999.999.";
    }

    if (max !== null && max > MAX_PRICE) {
      return "O valor máximo pode ser no máximo R$ 9.999.999.";
    }

    if (min !== null && max !== null && min > max) {
      return "O valor mínimo não pode ser maior que o valor máximo.";
    }

    return "";
  }

  function applyFilters() {
    const validationError = getValidationError();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    router.push({
      pathname: "/(tabs)/home",
      params: {
        categoria: category.trim() || "Todos",
        cidade: city.trim(),
        valorMin: minValue,
        valorMax: maxValue,
      },
    });
  }

  function clearFilters() {
    setCategory("");
    setCity("");
    setMinValue("");
    setMaxValue("");
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
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
        style={{ backgroundColor: theme.background }}
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

          <Text style={[styles.label, { color: theme.text }]}>
            Digite a categoria ou serviço
          </Text>

          <TextInput
            style={[
              styles.input,
              cleanInputStyle,
            ]}
            placeholder="Ex: Garçom, Fotógrafo, Limpeza"
            placeholderTextColor={theme.textSecondary}
            value={category}
            onChangeText={handleChangeCategory}
            maxLength={CATEGORY_MAX_LENGTH}
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
            Localização
          </Text>

          <Text style={[styles.label, { color: theme.text }]}>
            Cidade ou local
          </Text>

          <TextInput
            style={[
              styles.input,
              cleanInputStyle,
            ]}
            placeholder="Ex: Sorocaba"
            placeholderTextColor={theme.textSecondary}
            value={city}
            onChangeText={handleChangeCity}
            maxLength={CITY_MAX_LENGTH}
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
                  cleanInputStyle,
                ]}
                placeholder="R$ 50"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={minValue}
                onChangeText={handleChangeMinValue}
                maxLength={7}
              />
            </View>

            <View style={styles.doubleInputBox}>
              <Text style={[styles.label, { color: theme.text }]}>
                Máximo
              </Text>

              <TextInput
                style={[
                  styles.input,
                  cleanInputStyle,
                ]}
                placeholder="R$ 300"
                placeholderTextColor={theme.textSecondary}
                keyboardType="numeric"
                value={maxValue}
                onChangeText={handleChangeMaxValue}
                maxLength={7}
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
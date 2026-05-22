import { useState } from "react";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg"
import { styles } from "@/app/styles/accountType";

type AccountType = "freelancer" | "empresa";

export default function AccountTypeScreen() {
  const [selectedType, setSelectedType] = useState<AccountType>("freelancer");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowBack width={28} height={28} color="#52525B"/>
      </Pressable>

      <Text style={styles.title}>
        Como você quer{"\n"}usar o TaskFlow?
      </Text>

      <Text style={styles.subtitle}>
        Você pode escolher agora ou alterar depois nas configurações.
      </Text>

      <View style={styles.cardsArea}>
        <Pressable
          style={[
            styles.card,
            selectedType === "freelancer" && styles.cardActive,
          ]}
          onPress={() => setSelectedType("freelancer")}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.cardIcon}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.cardTitle,
              selectedType === "freelancer" && styles.cardTitleActive,
            ]}
          >
            Sou Freelancer
          </Text>

          <Text
            style={[
              styles.cardText,
              selectedType === "freelancer" && styles.cardTextActive,
            ]}
          >
            Quero encontrar serviços para ganhar dinheiro.
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.card,
            selectedType === "empresa" && styles.cardActive,
          ]}
          onPress={() => setSelectedType("empresa")}
        >
          <Image
            source={require("../../assets/images/adaptive-icon.png")}
            style={styles.cardIcon}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.cardTitle,
              selectedType === "empresa" && styles.cardTitleActive,
            ]}
          >
            Sou Empresa
          </Text>

          <Text
            style={[
              styles.cardText,
              selectedType === "empresa" && styles.cardTextActive,
            ]}
          >
            Quero contratar profissionais para serviços pontuais.
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          console.log("Tipo selecionado:", selectedType);
        }}
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    </SafeAreaView>
  );
}
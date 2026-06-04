import { useState } from "react";
import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import { styles } from "./styles/accountType";

type AccountType = "freelancer" | "empresa";

const gradientColors = ["#1f53cc", "#0f5bd6", "#2468f0"] as const;

export default function AccountTypeScreen() {
  const [selectedType, setSelectedType] = useState<AccountType>("freelancer");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowBack width={28} height={28} />
      </Pressable>

      <Text style={styles.title}>
        Como você quer{"\n"}usar o TaskFlow?
      </Text>

      <Text style={styles.subtitle}>
        Você pode escolher agora ou alterar depois nas configurações.
      </Text>

      <View style={styles.cardsArea}>
        <Pressable
          style={styles.cardWrapper}
          onPress={() => setSelectedType("freelancer")}
        >
          {selectedType === "freelancer" ? (
            <LinearGradient colors={gradientColors} style={styles.card}>
              <Image
                source={require("../../assets/icons/freelance.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />

              <Text style={styles.cardTitleActive}>Sou Freelancer</Text>

              <Text style={styles.cardTextActive}>
                Quero encontrar serviços para ganhar dinheiro.
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.card}>
              <Image
                source={require("../../assets/icons/freelance.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />

              <Text style={styles.cardTitle}>Sou Freelancer</Text>

              <Text style={styles.cardText}>
                Quero encontrar serviços para ganhar dinheiro.
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={styles.cardWrapper}
          onPress={() => setSelectedType("empresa")}
        >
          {selectedType === "empresa" ? (
            <LinearGradient colors={gradientColors} style={styles.card}>
              <Image
                source={require("../../assets/icons/companhia.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />

              <Text style={styles.cardTitleActive}>Sou Empresa</Text>

              <Text style={styles.cardTextActive}>
                Quero contratar profissionais para serviços pontuais.
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.card}>
              <Image
                source={require("../../assets/icons/companhia.png")}
                style={styles.cardIcon}
                resizeMode="contain"
              />

              <Text style={styles.cardTitle}>Sou Empresa</Text>

              <Text style={styles.cardText}>
                Quero contratar profissionais para serviços pontuais.
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
          onPress={() =>
            router.push({
              pathname: "/create-account",
              params: {
                accountType: selectedType,
              },
            })
          }
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </Pressable>
    </SafeAreaView>
  );
}
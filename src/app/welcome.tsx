import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { styles } from "@/app/styles/welcome";
import { useTheme } from "@/app/context/ThemeContext";

export default function WelcomeScreen() {
  const { isDark, theme } = useTheme();

  function handleStart() {
    router.push("/account-type");
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.content}>
        <View style={styles.textArea}>
          <Text style={[styles.title, { color: theme.text }]}>
            Conectando{"\n"}quem precisa{"\n"}com quem faz!
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Encontre serviços rápidos e confiáveis perto de você.
          </Text>
        </View>

        <Image
          source={require("../../assets/images/Homem-no-celular-incompleto.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleStart}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </Pressable>
    </SafeAreaView>
  );
}
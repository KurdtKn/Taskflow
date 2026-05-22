import { Image, Pressable, SafeAreaView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import { styles } from "@/app/styles/welcome";

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.textArea}>
          <Text style={styles.title}>
            Conectando{"\n"}quem precisa{"\n"}com quem faz!
          </Text>

          <Text style={styles.subtitle}>
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
        onPress={() => router.push("/account-type")}
      >
        <Text style={styles.buttonText}>Começar</Text>
      </Pressable>

      <Pressable style={styles.loginArea}>
        <Text style={styles.loginText}>
          Já tem uma conta? <Text style={styles.loginLink}>Entrar</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}
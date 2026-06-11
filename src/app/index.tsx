import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { styles } from "./styles/splash";
import { useTheme } from "@/app/context/ThemeContext";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLoggedUser } from "@/services/storage";

const LOADING_TIME = 1800;
const PROGRESS_WIDTH = 190;

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;
  const { isDark } = useTheme();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADING_TIME,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(async () => {
      const rememberMe = await AsyncStorage.getItem("@taskflow:remember_me");
      const user = await getLoggedUser();

      if (rememberMe === "true" && user?.tipoUsuario === "empresa") {
        router.replace("/company-dashboard");
        return;
      }

      if (rememberMe === "true" && user?.tipoUsuario === "freelancer") {
        router.replace("/home");
        return;
      }

      router.replace("/welcome");
    });
  }, []);

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_WIDTH],
  });

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#020617", "#092870", "#0F172A"]
          : ["#163E9F", "#0B57D0", "#1E63E9"]
      }
      style={styles.container}
    >
      <StatusBar style="light" />

      <Image
        source={require("../../assets/images/icon-sem-fundo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>TaskFlow</Text>

      <Text style={styles.subtitle}>
        Serviços sob demanda{"\n"}na sua região.
      </Text>

      <Animated.View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: animatedWidth,
            },
          ]}
        />
      </Animated.View>
    </LinearGradient>
  );
}
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { styles } from "./styles/splash";

const LOADING_TIME = 1800;
const PROGRESS_WIDTH = 190;

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADING_TIME,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      router.replace("/welcome");
    });
  }, []);

  const animatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_WIDTH],
  });

  return (
    <LinearGradient
      colors={["#163E9F", "#0B57D0", "#1E63E9"]}
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
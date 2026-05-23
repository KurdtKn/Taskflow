import { useState } from "react";
import {
  Image,  
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import Visibility from "../../assets/icons/visibility.svg";
import VisibilityOff from "../../assets/icons/visibility_off.svg";

import { styles } from "./styles/login";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    console.log({
      email,
      password,
    });

    router.replace("/home");
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>Entrar</Text>

          <Text style={styles.subtitle}>
            Acesse sua conta para continuar usando o TaskFlow.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>E-mail</Text>

          <TextInput
            style={styles.input}
            placeholder="exemplo@email.com"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>

          <View style={styles.passwordArea}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Digite sua senha"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />

            <Pressable
              style={styles.passwordIconButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Visibility width={22} height={22} />
              ) : (
                <VisibilityOff width={22} height={22} />
              )}
            </Pressable>
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </Pressable>
        </View>

        <View style={styles.dividerArea}>
          <Text style={styles.dividerText}>ou continue com</Text>
        </View>

        <View style={styles.socialArea}>
        <Pressable style={styles.socialButton}>
            <Image
            source={require("../../assets/icons/google.png")}
            style={styles.socialIcon}
            resizeMode="contain"
            />
        </Pressable>

        <Pressable style={styles.socialButton}>
            <Image
            source={require("../../assets/icons/logotipo-do-mac-os.png")}
            style={styles.socialIcon}
            resizeMode="contain"
            />
        </Pressable>
        </View>

        <Pressable
          style={styles.createAccountArea}
          onPress={() => router.push("/create-account")}
        >
          <Text style={styles.createAccountText}>
            Não tem uma conta?{" "}
            <Text style={styles.createAccountLink}>Criar conta</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
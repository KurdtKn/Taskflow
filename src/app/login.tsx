import { useState } from "react";
import {
  Alert,
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
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import Visibility from "../../assets/icons/visibility.svg";
import VisibilityOff from "../../assets/icons/visibility_off.svg";

import { styles } from "./styles/login";
import { useTheme } from "@/app/context/ThemeContext";
import { login as loginService } from "@/services/authService";

type AccountType = "freelancer" | "empresa";

export default function LoginScreen() {
  const params = useLocalSearchParams<{
    accountType?: AccountType;
  }>();

  const accountType: AccountType = params.accountType ?? "freelancer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { isDark, theme } = useTheme();

  function showFormError(message: string) {
    setFormError(message);
    Alert.alert("Atenção", message);
  }

  function handleGoToRegister() {
    if (isLoading) {
      return;
    }

    router.push({
      pathname: "/create-account",
      params: {
        accountType,
      },
    });
  }

  async function handleLogin() {
    setFormError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      showFormError("Informe seu e-mail.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      showFormError("Informe um e-mail válido.");
      return;
    }

    if (!password) {
      showFormError("Informe sua senha.");
      return;
    }

    try {
      setIsLoading(true);

      const user = await loginService({
        email: trimmedEmail,
        senha: password,
      });

      console.log("Usuário logado:", user);

      const tipoUsuario = user.tipoUsuario?.toLowerCase().trim();

      if (tipoUsuario === "empresa") {
        router.replace("/company-dashboard");
        return;
      }

      if (tipoUsuario === "freelancer") {
        router.replace("/home");
        return;
      }

      showFormError(`Tipo de usuário inválido: ${user.tipoUsuario}`);
    } catch (error) {
      console.log("Erro ao fazer login:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível entrar agora. Verifique seus dados e tente novamente.";

      setFormError(errorMessage);
      Alert.alert("Erro no login", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isLoading}
        >
          <ArrowBack width={28} height={28} />
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Entrar
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Acesse sua conta para continuar usando o TaskFlow.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.text }]}>
            E-mail
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
            placeholder="exemplo@email.com"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setFormError("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />

          <Text style={[styles.label, { color: theme.text }]}>
            Senha
          </Text>

          <View
            style={[
              styles.passwordArea,
              {
                backgroundColor: theme.inputBackground,
                borderColor: theme.border,
              },
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                { color: theme.text },
              ]}
              placeholder="Digite sua senha"
              placeholderTextColor={theme.textSecondary}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setFormError("");
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <Pressable
              style={styles.passwordIconButton}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <Visibility width={22} height={22} />
              ) : (
                <VisibilityOff width={22} height={22} />
              )}
            </Pressable>
          </View>

          <Pressable style={styles.forgotPassword} disabled={isLoading}>
            <Text style={styles.forgotPasswordText}>
              Esqueci minha senha
            </Text>
          </Pressable>

          {formError !== "" && (
            <Text
              style={{
                color: "#DC2626",
                fontSize: 13,
                fontWeight: "700",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {formError}
            </Text>
          )}

          <Pressable
            disabled={isLoading}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              isLoading && { opacity: 0.7 },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.dividerArea}>
          <Text style={[styles.dividerText, { color: theme.textSecondary }]}>
            ou continue com
          </Text>
        </View>

        <View style={styles.socialArea}>
          <Pressable
            disabled={isLoading}
            style={[
              styles.socialButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Image
              source={require("../../assets/icons/google.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            disabled={isLoading}
            style={[
              styles.socialButton,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Image
              source={require("../../assets/icons/logotipo-do-mac-os.png")}
              style={styles.socialIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>

        <View style={styles.createAccountArea}>
          <Text style={[styles.createAccountText, { color: theme.textSecondary }]}>
            Ainda não tem uma conta?{" "}
            <Text
              style={styles.createAccountLink}
              onPress={handleGoToRegister}
            >
              Registrar-se
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
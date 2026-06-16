import { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import Visibility from "../../assets/icons/visibility.svg";
import VisibilityOff from "../../assets/icons/visibility_off.svg";

import { styles } from "./styles/login";
import { useTheme } from "@/app/context/ThemeContext";
import { login as loginService, logout } from "@/services/authService";
import { colors } from "@/styles/colors";

type AccountType = "freelancer" | "empresa";

const REMEMBER_ME_KEY = "@taskflow:remember_me";

function getRememberEmailKey(type: AccountType) {
  return `@taskflow:remember_email:${type}`;
}

export default function LoginScreen() {
  const params = useLocalSearchParams<{
    accountType?: AccountType;
    tipo?: AccountType;
    userType?: AccountType;
  }>();

  const accountType: AccountType =
    params.accountType ?? params.tipo ?? params.userType ?? "freelancer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { isDark, theme } = useTheme();

  const eyeIconColor = isDark ? colors.white : colors.black;

  useEffect(() => {
    async function loadRememberPreference() {
      try {
        const savedEmail = await AsyncStorage.getItem(
          getRememberEmailKey(accountType)
        );

        setEmail(savedEmail ?? "");
        setRememberMe(true);
      } catch (error) {
        console.log("Erro ao carregar preferência de login:", error);
      }
    }

    loadRememberPreference();
  }, [accountType]);

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

  function getAccountTypeLabel(type: AccountType) {
    return type === "empresa" ? "empresa" : "freelancer";
  }

  async function saveRememberPreference(trimmedEmail: string) {
    await AsyncStorage.setItem(
      REMEMBER_ME_KEY,
      "true"
    );

    const emailKey = getRememberEmailKey(accountType);

    await AsyncStorage.setItem(emailKey, trimmedEmail);
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

      const tipoUsuario = user.tipoUsuario?.toLowerCase().trim() as AccountType;

      if (tipoUsuario !== "empresa" && tipoUsuario !== "freelancer") {
        showFormError(`Tipo de usuário inválido: ${user.tipoUsuario}`);
        return;
      }

      if (tipoUsuario !== accountType) {
        await logout();

        const contaAtual = getAccountTypeLabel(tipoUsuario);
        const areaEscolhida = getAccountTypeLabel(accountType);

        showFormError(
          `Este e-mail pertence a uma conta de ${contaAtual}. Entre pela área de ${contaAtual}, não pela área de ${areaEscolhida}.`
        );

        return;
      }

      await saveRememberPreference(trimmedEmail);

      if (tipoUsuario === "empresa") {
        router.replace("/company-dashboard");
        return;
      }

      if (tipoUsuario === "freelancer") {
        router.replace("/home");
        return;
      }
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
          <ArrowBack
            width={28}
            height={28}
            color={theme.text}
            fill={theme.text}
          />
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Entrar
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Acesse sua conta de {getAccountTypeLabel(accountType)} para
            continuar usando o TaskFlow.
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
                borderColor: "transparent",
                borderWidth: 0,
                color: theme.text,
                ...(Platform.OS === "web"
                  ? ({ outlineStyle: "none" } as any)
                  : {}),
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
                borderColor: "transparent",
                borderWidth: 0,
                paddingLeft: 0,
                paddingRight: 0,
                overflow: "hidden",
              },
            ]}
          >
            <TextInput
              style={[
                styles.passwordInput,
                {
                  color: theme.text,
                  backgroundColor: "transparent",
                  paddingLeft: 16,
                  paddingRight: 8,
                  flex: 1,
                  ...(Platform.OS === "web"
                    ? ({ outlineStyle: "none" } as any)
                    : {}),
                },
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
              style={[
                styles.passwordIconButton,
                {
                  backgroundColor: "transparent",
                  borderWidth: 0,
                  width: 52,
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
              onPress={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <Visibility
                  width={22}
                  height={22}
                  color={eyeIconColor}
                  fill={eyeIconColor}
                />
              ) : (
                <VisibilityOff
                  width={22}
                  height={22}
                  color={eyeIconColor}
                  fill={eyeIconColor}
                />
              )}
            </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
              marginBottom: 18,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
              onPress={() => setRememberMe(true)}
              disabled={isLoading}
              hitSlop={8}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: rememberMe
                    ? theme.primary
                    : theme.inputBackground,
                  borderWidth: 1,
                  borderColor: rememberMe ? theme.primary : theme.border,
                }}
              >
                {rememberMe && (
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 14,
                      fontWeight: "900",
                      lineHeight: 16,
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>

              <Text
                style={{
                  color: theme.textSecondary,
                  fontSize: 13,
                  fontWeight: "700",
                }}
              >
                Manter conectado
              </Text>
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
                backgroundColor: colors.white,
                borderColor: colors.white,
                borderWidth: 0,
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
                backgroundColor: colors.white,
                borderColor: colors.white,
                borderWidth: 0,
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
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
import { styles } from "./styles/createAccount";
import { useTheme } from "@/app/context/ThemeContext";
import { register } from "@/services/authService";

type AccountType = "freelancer" | "empresa";

export default function CreateAccountScreen() {
  const params = useLocalSearchParams<{
    accountType?: AccountType;
  }>();

  const accountType: AccountType = params.accountType ?? "freelancer";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const { isDark, theme } = useTheme();

  function isValidEmail(value: string) {
    return /\S+@\S+\.\S+/.test(value);
  }

  function showFormError(message: string) {
    setFormError(message);
    Alert.alert("Atenção", message);
  }

  function handleToggleTerms() {
    setAcceptedTerms((currentValue) => !currentValue);
    setFormError("");
  }

  function handleOpenTermsAndPrivacy() {
    if (isLoading) {
      return;
    }

    router.push("/terms-and-privacy");
  }

  function handleGoToLogin() {
    if (isLoading) {
      return;
    }

    router.push({
      pathname: "/login",
      params: {
        accountType,
      },
    });
  }

  async function handleCreateAccount() {
    setFormError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      showFormError("Informe seu nome completo.");
      return;
    }

    if (trimmedName.length < 3) {
      showFormError("Informe um nome com pelo menos 3 caracteres.");
      return;
    }

    if (!trimmedEmail) {
      showFormError("Informe seu e-mail.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      showFormError("Informe um e-mail válido.");
      return;
    }

    if (!password) {
      showFormError("Informe sua senha.");
      return;
    }

    if (password.length < 6) {
      showFormError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (!confirmPassword) {
      showFormError("Confirme sua senha.");
      return;
    }

    if (password !== confirmPassword) {
      showFormError("As senhas não conferem.");
      return;
    }

    if (!acceptedTerms) {
      showFormError(
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade."
      );
      return;
    }

    try {
      setIsLoading(true);

      const user = await register({
        nome: trimmedName,
        email: trimmedEmail,
        senha: password,
        tipoUsuario: accountType,
      });

      const tipoUsuario = user.tipoUsuario?.toLowerCase().trim();

      if (tipoUsuario === "empresa") {
        router.replace("/company-dashboard");
        return;
      }

      router.replace("/home");
    } catch (error) {
      console.log("Erro ao criar conta:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível criar sua conta agora. Tente novamente.";

      setFormError(errorMessage);
      Alert.alert("Erro ao criar conta", errorMessage);
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
            Criar conta
          </Text>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Preencha seus dados para começar
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: theme.text }]}>
            Nome completo
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
            placeholder="Digite seu nome completo"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={(value) => {
              setName(value);
              setFormError("");
            }}
            editable={!isLoading}
          />

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

          <Text style={[styles.label, { color: theme.text }]}>
            Confirmar senha
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
              placeholder="Confirme sua senha"
              placeholderTextColor={theme.textSecondary}
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                setFormError("");
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />

            <Pressable
              style={styles.passwordIconButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <Visibility width={22} height={22} />
              ) : (
                <VisibilityOff width={22} height={22} />
              )}
            </Pressable>
          </View>

          <View style={styles.termsArea}>
            <Pressable
              onPress={handleToggleTerms}
              disabled={isLoading}
              hitSlop={8}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && <Text style={styles.checkText}>✓</Text>}
              </View>
            </Pressable>

            <View style={{ flex: 1 }}>
              <Text style={[styles.termsText, { color: theme.textSecondary }]}>
                Aceito os{" "}
                <Text
                  style={styles.termsLink}
                  onPress={handleOpenTermsAndPrivacy}
                >
                  Termos de Uso
                </Text>
                {"\n"}e{" "}
                <Text
                  style={styles.termsLink}
                  onPress={handleOpenTermsAndPrivacy}
                >
                  Política de Privacidade
                </Text>
              </Text>
            </View>
          </View>

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
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Criando..." : "Criar Conta"}
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

        <View style={styles.loginArea}>
          <Text style={[styles.loginText, { color: theme.textSecondary }]}>
            Já tem uma conta?{" "}
            <Text style={styles.loginLink} onPress={handleGoToLogin}>
              Entrar
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
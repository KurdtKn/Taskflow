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
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import Visibility from "../../assets/icons/visibility.svg";
import VisibilityOff from "../../assets/icons/visibility_off.svg";
import { styles } from "./styles/createAccount";

export default function CreateAccountScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const params = useLocalSearchParams<{
    accountType?: "freelancer" | "empresa";
  }>();

const accountType = params.accountType ?? "freelancer";

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleCreateAccount() {
    console.log({
      name,
      email,
      password,
      confirmPassword,
      acceptedTerms,
      accountType,
    });

  if (accountType === "empresa") {
    router.replace("/company-dashboard");
    return;
  }

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
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados para começar</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome completo"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

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

          <Text style={styles.label}>Confirmar senha</Text>
          <View style={styles.passwordArea}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirme sua senha"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />

            <Pressable
                style={styles.passwordIconButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
                {showConfirmPassword ? (
                    <Visibility width={22} height={22} />
                ) : (
                    <VisibilityOff width={22} height={22} />
                )}
            </Pressable>
          </View>

          <Pressable
            style={styles.termsArea}
            onPress={() => setAcceptedTerms(!acceptedTerms)}
          >
            <View
              style={[
                styles.checkbox,
                acceptedTerms && styles.checkboxChecked,
              ]}
            >
              {acceptedTerms && <Text style={styles.checkText}>✓</Text>}
            </View>

            <Text style={styles.termsText}>
              Aceito os{" "}
              <Text style={styles.termsLink}>Termos de Uso</Text>
              {"\n"}e{" "}
              <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>Criar Conta</Text>
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

        <Pressable style={styles.loginArea} onPress={() => router.push("/login")}>
          <Text style={styles.loginText}>
            Já tem uma conta? <Text style={styles.loginLink}>Entrar</Text>
          </Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
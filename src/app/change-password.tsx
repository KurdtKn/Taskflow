import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import VisibilityIcon from "../../assets/icons/visibility.svg";
import VisibilityOffIcon from "../../assets/icons/visibility_off.svg";

import { colors } from "@/styles/colors";
import { styles } from "@/app/styles/changePassword";
import { useTheme } from "@/app/context/ThemeContext";

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const { isDark, theme } = useTheme();

  const eyeIconColor = isDark ? colors.white : colors.black;

  async function handleChangePassword() {
    const current = currentPassword.trim();
    const newPass = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !newPass || !confirm) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos para continuar."
      );
      return;
    }

    if (newPass.length < 6) {
      Alert.alert(
        "Senha fraca",
        "A nova senha precisa ter pelo menos 6 caracteres."
      );
      return;
    }

    if (newPass !== confirm) {
      Alert.alert(
        "Senhas diferentes",
        "A confirmação precisa ser igual à nova senha."
      );
      return;
    }

    try {
      setIsSaving(true);

      /*
        Aqui futuramente entra a API para alterar a senha.

        Exemplo:
        await authService.changePassword({
          currentPassword: current,
          newPassword: newPass,
        });

        A API vai identificar o usuário pelo token salvo após o login.
      */

      console.log("Alterar senha:", {
        currentPassword: current,
        newPassword: newPass,
      });

      Alert.alert(
        "Senha alterada",
        "Sua senha foi atualizada com sucesso.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.log("Erro ao alterar senha:", error);

      Alert.alert(
        "Erro ao alterar senha",
        "Não foi possível atualizar sua senha agora. Verifique a senha atual e tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function renderEyeIcon(isVisible: boolean) {
    if (isVisible) {
      return (
        <VisibilityOffIcon
          width={22}
          height={22}
          color={eyeIconColor}
          fill={eyeIconColor}
          stroke={eyeIconColor}
        />
      );
    }

    return (
      <VisibilityIcon
        width={22}
        height={22}
        color={eyeIconColor}
        fill={eyeIconColor}
        stroke={eyeIconColor}
      />
    );
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
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <ArrowBack width={28} height={28} />
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Alterar senha
          </Text>

          <View style={styles.headerPlaceholder} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View>
              <Text style={[styles.heroLabel, { color: theme.primary }]}>
                Segurança
              </Text>

              <Text style={[styles.heroTitle, { color: theme.text }]}>
                Atualize sua senha
              </Text>

              <Text style={[styles.heroText, { color: theme.textSecondary }]}>
                Use uma senha segura para proteger sua conta no TaskFlow.
              </Text>
            </View>

            <View style={styles.heroIconBox}>
              <LockIcon width={34} height={34} />
            </View>
          </View>

          <View style={styles.formArea}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Senha atual
              </Text>

              <View
                style={[
                  styles.passwordBox,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  editable={!isSaving}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowCurrentPassword(!showCurrentPassword)
                  }
                  disabled={isSaving}
                >
                  {renderEyeIcon(showCurrentPassword)}
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Nova senha
              </Text>

              <View
                style={[
                  styles.passwordBox,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Digite a nova senha"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  editable={!isSaving}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  disabled={isSaving}
                >
                  {renderEyeIcon(showNewPassword)}
                </Pressable>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Confirmar nova senha
              </Text>

              <View
                style={[
                  styles.passwordBox,
                  {
                    backgroundColor: theme.inputBackground,
                    borderColor: theme.border,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  editable={!isSaving}
                />

                <Pressable
                  style={styles.eyeButton}
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  disabled={isSaving}
                >
                  {renderEyeIcon(showConfirmPassword)}
                </Pressable>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.infoBox,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.text }]}>
              Dica de segurança
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Use uma senha com letras, números e símbolos. Evite usar datas de
              nascimento ou informações fáceis de descobrir.
            </Text>
          </View>

          <Pressable
            disabled={isSaving}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.buttonPressed,
              isSaving && { opacity: 0.7 },
            ]}
            onPress={handleChangePassword}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Salvando..." : "Salvar nova senha"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
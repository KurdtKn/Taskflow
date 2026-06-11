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

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 64;

function removeSpaces(value: string) {
  return value.replace(/\s/g, "");
}

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

  const cleanPasswordBoxStyle = {
    backgroundColor: theme.inputBackground,
    borderColor: "transparent",
    borderWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    overflow: "hidden" as const,
  };

  const cleanInputStyle = {
    color: theme.text,
    backgroundColor: "transparent",
    paddingLeft: 16,
    paddingRight: 8,
    flex: 1,
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  };

  const cleanEyeButtonStyle = {
    backgroundColor: "transparent",
    borderWidth: 0,
    width: 52,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  };

  function handleChangeCurrentPassword(value: string) {
    setCurrentPassword(removeSpaces(value).slice(0, PASSWORD_MAX_LENGTH));
  }

  function handleChangeNewPassword(value: string) {
    setNewPassword(removeSpaces(value).slice(0, PASSWORD_MAX_LENGTH));
  }

  function handleChangeConfirmPassword(value: string) {
    setConfirmPassword(removeSpaces(value).slice(0, PASSWORD_MAX_LENGTH));
  }

  function getValidationError() {
    const current = currentPassword.trim();
    const newPass = newPassword.trim();
    const confirm = confirmPassword.trim();

    if (!current || !newPass || !confirm) {
      return "Preencha todos os campos para continuar.";
    }

    if (current.length < PASSWORD_MIN_LENGTH) {
      return `A senha atual precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
    }

    if (current.length > PASSWORD_MAX_LENGTH) {
      return `A senha atual pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`;
    }

    if (newPass.length < PASSWORD_MIN_LENGTH) {
      return `A nova senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
    }

    if (newPass.length > PASSWORD_MAX_LENGTH) {
      return `A nova senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`;
    }

    if (confirm.length > PASSWORD_MAX_LENGTH) {
      return `A confirmação de senha pode ter no máximo ${PASSWORD_MAX_LENGTH} caracteres.`;
    }

    if (/\s/.test(current) || /\s/.test(newPass) || /\s/.test(confirm)) {
      return "As senhas não podem conter espaços.";
    }

    if (newPass === current) {
      return "A nova senha precisa ser diferente da senha atual.";
    }

    if (newPass !== confirm) {
      return "A confirmação precisa ser igual à nova senha.";
    }

    return "";
  }

  async function handleChangePassword() {
    const validationError = getValidationError();

    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }

    const current = currentPassword.trim();
    const newPass = newPassword.trim();

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
        />
      );
    }

    return (
      <VisibilityIcon
        width={22}
        height={22}
        color={eyeIconColor}
        fill={eyeIconColor}
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
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.border,
            },
          ]}
        >
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isSaving}
          >
            <ArrowBack
              width={28}
              height={28}
              color={theme.text}
              fill={theme.text}
            />
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
          style={{ backgroundColor: theme.background }}
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

            <View
              style={[
                styles.heroIconBox,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.white,
                  borderWidth: 0,
                },
              ]}
            >
              <LockIcon
                width={34}
                height={34}
                color={colors.black}
                fill={colors.black}
              />
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
                  cleanPasswordBoxStyle,
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    cleanInputStyle,
                  ]}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={handleChangeCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  maxLength={PASSWORD_MAX_LENGTH}
                  editable={!isSaving}
                />

                <Pressable
                  style={[
                    styles.eyeButton,
                    cleanEyeButtonStyle,
                  ]}
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
                  cleanPasswordBoxStyle,
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    cleanInputStyle,
                  ]}
                  placeholder="Digite a nova senha"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={handleChangeNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  maxLength={PASSWORD_MAX_LENGTH}
                  editable={!isSaving}
                />

                <Pressable
                  style={[
                    styles.eyeButton,
                    cleanEyeButtonStyle,
                  ]}
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
                  cleanPasswordBoxStyle,
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    cleanInputStyle,
                  ]}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor={theme.textSecondary}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={handleChangeConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                  maxLength={PASSWORD_MAX_LENGTH}
                  editable={!isSaving}
                />

                <Pressable
                  style={[
                    styles.eyeButton,
                    cleanEyeButtonStyle,
                  ]}
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
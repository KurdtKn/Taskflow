import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import CheckIcon from "../../assets/icons/check.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import SettingsIcon from "../../assets/icons/settings.svg";

import { colors } from "@/styles/colors";
import { styles } from "@/app/styles/privacySecurity";
import { useTheme } from "@/app/context/ThemeContext";

type PrivacySecuritySettings = {
  profileVisible: boolean;
  showLocation: boolean;
  allowNotifications: boolean;
  securityAlerts: boolean;
};

export default function PrivacySecurityScreen() {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { isDark, theme } = useTheme();

  const iconColor = colors.black;
  const iconBoxBackground = isDark ? colors.white : colors.lightGray;
  const iconBoxBorder = isDark ? colors.white : colors.border;

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  async function loadPrivacySettings() {
    try {
      setIsLoading(true);

      /*
        Aqui futuramente entra a API para buscar as preferências
        do usuário logado.

        Exemplo:
        const response = await userService.getPrivacySecuritySettings();

        setProfileVisible(response.profileVisible);
        setShowLocation(response.showLocation);
        setAllowNotifications(response.allowNotifications);
        setSecurityAlerts(response.securityAlerts);

        A API identifica o usuário pelo token salvo no login.
      */
    } catch (error) {
      console.log("Erro ao carregar privacidade:", error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar suas preferências de privacidade agora."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function getCurrentSettings(): PrivacySecuritySettings {
    return {
      profileVisible,
      showLocation,
      allowNotifications,
      securityAlerts,
    };
  }

  async function handleSaveSettings() {
    try {
      setIsSaving(true);

      const settings = getCurrentSettings();

      /*
        Aqui futuramente entra a API para salvar no banco.

        Exemplo:
        await userService.updatePrivacySecuritySettings(settings);
      */

      console.log("Privacidade salva:", settings);

      Alert.alert(
        "Configurações salvas",
        "Suas preferências de privacidade e segurança foram atualizadas."
      );
    } catch (error) {
      console.log("Erro ao salvar privacidade:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar suas preferências agora."
      );
    } finally {
      setIsSaving(false);
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

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack
            width={28}
            height={28}
            color={theme.text}
            fill={theme.text}
          />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Privacidade
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
            <Text style={[styles.heroLabel, { color: colors.primary }]}>
              Segurança
            </Text>

            <Text style={[styles.heroTitle, { color: theme.text }]}>
              Controle seus dados
            </Text>

            <Text style={[styles.heroText, { color: theme.textSecondary }]}>
              Gerencie visibilidade, localização e alertas importantes da sua
              conta.
            </Text>
          </View>

          <View
            style={[
              styles.heroIconBox,
              {
                backgroundColor: iconBoxBackground,
                borderColor: iconBoxBorder,
                borderWidth: 1,
              },
            ]}
          >
            <SettingsIcon
              width={34}
              height={34}
              color={iconColor}
              fill={iconColor}
            />
          </View>
        </View>

        {isLoading && (
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
              Carregando preferências...
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Buscando suas configurações de privacidade e segurança.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Privacidade da conta
          </Text>

          <View
            style={[
              styles.switchCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.optionIconBox,
                {
                  backgroundColor: iconBoxBackground,
                  borderColor: iconBoxBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <CheckIcon
                width={22}
                height={22}
                color={iconColor}
                fill={iconColor}
              />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Perfil visível
              </Text>

              <Text
                style={[
                  styles.optionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Permite que outros usuários encontrem seu perfil na plataforma.
              </Text>
            </View>

            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={profileVisible ? colors.primary : "#F9FAFB"}
            />
          </View>

          <View
            style={[
              styles.switchCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.optionIconBox,
                {
                  backgroundColor: iconBoxBackground,
                  borderColor: iconBoxBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <LocationIcon
                width={22}
                height={22}
                color={iconColor}
                fill={iconColor}
              />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Compartilhar localização
              </Text>

              <Text
                style={[
                  styles.optionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Ajuda a exibir chamados próximos e melhorar recomendações.
              </Text>
            </View>

            <Switch
              value={showLocation}
              onValueChange={setShowLocation}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={showLocation ? colors.primary : "#F9FAFB"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Alertas de segurança
          </Text>

          <View
            style={[
              styles.switchCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.optionIconBox,
                {
                  backgroundColor: iconBoxBackground,
                  borderColor: iconBoxBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <NotificationIcon
                width={22}
                height={22}
                color={iconColor}
                fill={iconColor}
                stroke={iconColor}
              />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Notificações importantes
              </Text>

              <Text
                style={[
                  styles.optionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Receba avisos sobre solicitações, mensagens e atualizações.
              </Text>
            </View>

            <Switch
              value={allowNotifications}
              onValueChange={setAllowNotifications}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={allowNotifications ? colors.primary : "#F9FAFB"}
            />
          </View>

          <View
            style={[
              styles.switchCard,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.optionIconBox,
                {
                  backgroundColor: iconBoxBackground,
                  borderColor: iconBoxBorder,
                  borderWidth: 1,
                },
              ]}
            >
              <SettingsIcon
                width={34}
                height={34}
                color={iconColor}
                fill={iconColor}
              />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={[styles.optionTitle, { color: theme.text }]}>
                Alertas da conta
              </Text>

              <Text
                style={[
                  styles.optionSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Avise quando houver alteração de senha, login ou dados
                sensíveis.
              </Text>
            </View>

            <Switch
              value={securityAlerts}
              onValueChange={setSecurityAlerts}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={securityAlerts ? colors.primary : "#F9FAFB"}
            />
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
            Controle de privacidade
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Essas preferências serão vinculadas à sua conta e poderão ser
            atualizadas sempre que necessário.
          </Text>
        </View>

        <View
          style={[
            styles.securityCard,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.securityTitle, { color: theme.text }]}>
            Recursos de segurança
          </Text>

          <View style={styles.securityItem}>
            <Text style={styles.securityDot}>•</Text>

            <Text style={[styles.securityText, { color: theme.textSecondary }]}>
              Chat liberado apenas após confirmação do fluxo.
            </Text>
          </View>

          <View style={styles.securityItem}>
            <Text style={styles.securityDot}>•</Text>

            <Text style={[styles.securityText, { color: theme.textSecondary }]}>
              Avaliações entre empresa e freelancer após o serviço.
            </Text>
          </View>

          <View style={styles.securityItem}>
            <Text style={styles.securityDot}>•</Text>

            <Text style={[styles.securityText, { color: theme.textSecondary }]}>
              Perfil com informações organizadas para aumentar a confiança.
            </Text>
          </View>
        </View>

        <Pressable
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.buttonPressed,
            isSaving && { opacity: 0.7 },
          ]}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Salvando..." : "Salvar configurações"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  View,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { logout } from "@/services/authService";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/companySettings";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type SettingOption = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
  action: () => void;
};

type CompanySettings = {
  pushNotifications: boolean;
  emailNotifications: boolean;
  candidateAlerts: boolean;
  paymentAlerts: boolean;
  showCompanyProfile: boolean;
};

export default function CompanySettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [candidateAlerts, setCandidateAlerts] = useState(false);
  const [paymentAlerts, setPaymentAlerts] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isDark, toggleTheme, theme } = useTheme();

  useEffect(() => {
    loadCompanySettings();
  }, []);

  async function loadCompanySettings() {
    try {
      setIsLoading(true);

      /*
        Futuramente entra aqui a API para buscar as configurações
        da empresa logada.

        Exemplo:
        const response = await companySettingsService.getMySettings();

        setPushNotifications(response.pushNotifications);
        setEmailNotifications(response.emailNotifications);
        setCandidateAlerts(response.candidateAlerts);
        setPaymentAlerts(response.paymentAlerts);
        setShowCompanyProfile(response.showCompanyProfile);

        A API deve identificar a empresa pelo token salvo depois do login.
      */
    } catch (error) {
      console.log("Erro ao carregar configurações da empresa:", error);

      Alert.alert(
        "Erro",
        "Não foi possível carregar as configurações da empresa agora."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const settingOptions: SettingOption[] = [
    {
      id: "1",
      title: "Alterar senha",
      subtitle: "Atualize sua senha de acesso",
      Icon: LockIcon,
      action: () => router.push("/change-password"),
    },
    {
      id: "2",
      title: "Privacidade e segurança",
      subtitle: "Gerencie permissões e segurança da conta",
      Icon: SettingsIcon,
      action: () => router.push("/privacy-security"),
    },
    {
      id: "3",
      title: "Termos e políticas",
      subtitle: "Veja regras de uso, privacidade e condições da plataforma",
      Icon: AssignmentIcon,
      action: () => router.push("/terms"),
    },
  ];

  function getCurrentSettings(): CompanySettings {
    return {
      pushNotifications,
      emailNotifications,
      candidateAlerts,
      paymentAlerts,
      showCompanyProfile,
    };
  }

  async function handleSaveSettings() {
    const settings = getCurrentSettings();

    try {
      setIsSaving(true);

      /*
        Futuramente entra aqui a API para salvar as configurações.

        Exemplo:
        await companySettingsService.updateMySettings(settings);

        A API deve atualizar as preferências da empresa logada
        usando o token salvo depois do login.
      */

      console.log("Configurações da empresa salvas:", settings);

      Alert.alert(
        "Configurações salvas",
        "As preferências da empresa foram atualizadas.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.log("Erro ao salvar configurações da empresa:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar as configurações agora. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmLogout() {
  try {
    await logout();
    router.replace("/welcome");
  } catch (error) {
    console.log("Erro ao sair:", error);
    router.replace("/welcome");
  }
}

function handleLogout() {
  if (Platform.OS === "web") {
    const confirmed = window.confirm(
      "Tem certeza que deseja sair da sua conta?"
    );

    if (confirmed) {
      confirmLogout();
    }

    return;
  }

  Alert.alert(
    "Desconectar-se",
    "Tem certeza que deseja sair da sua conta?",
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: confirmLogout,
      },
    ]
  );
}

  function handleDeleteAccount() {
    Alert.alert(
      "Excluir conta da empresa",
      "Tem certeza que deseja excluir a conta da empresa? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: confirmDeleteAccount,
        },
      ]
    );
  }

  async function confirmDeleteAccount() {
    try {
      setIsDeleting(true);

      /*
        Futuramente entra aqui a API para excluir a conta.

        Exemplo:
        await companyService.deleteMyCompanyAccount();
        await authService.logout();

        A API deve remover/desativar a conta da empresa logada
        usando o token salvo depois do login.
      */

      Alert.alert(
        "Conta excluída",
        "A conta da empresa foi removida com sucesso.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/welcome"),
          },
        ]
      );
    } catch (error) {
      console.log("Erro ao excluir conta da empresa:", error);

      Alert.alert(
        "Erro",
        "Não foi possível excluir a conta agora. Tente novamente."
      );
    } finally {
      setIsDeleting(false);
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
          Configurações
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
              Conta empresarial
            </Text>

            <Text style={[styles.heroTitle, { color: theme.text }]}>
              Preferências da empresa
            </Text>

            <Text style={[styles.heroText, { color: theme.textSecondary }]}>
              Configure notificações, privacidade, segurança e opções da conta.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <SettingsIcon width={34} height={34} />
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
              Carregando configurações...
            </Text>

            <Text style={[styles.infoText, { color: theme.textSecondary }]}>
              Buscando as preferências da empresa.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Aparência
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
            <View style={styles.switchTextArea}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Modo noturno
              </Text>

              <Text
                style={[
                  styles.switchSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Ativar tema escuro no aplicativo.
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.border,
                true: "rgba(9,40,112,0.45)",
              }}
              thumbColor={isDark ? colors.primary : "#F4F4F5"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notificações
          </Text>

          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Escolha quais avisos sua empresa deseja receber.
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
            <View style={styles.switchTextArea}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Notificações push
              </Text>

              <Text
                style={[
                  styles.switchSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Receber alertas no celular sobre atividades importantes.
              </Text>
            </View>

            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={pushNotifications ? colors.primary : "#F4F4F5"}
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
            <View style={styles.switchTextArea}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Notificações por e-mail
              </Text>

              <Text
                style={[
                  styles.switchSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Receber resumo de chamados, pagamentos e candidaturas por e-mail.
              </Text>
            </View>

            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={emailNotifications ? colors.primary : "#F4F4F5"}
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
            <View style={styles.switchTextArea}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Alertas de candidatos
              </Text>

              <Text
                style={[
                  styles.switchSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Avisar quando um freelancer se candidatar a um chamado.
              </Text>
            </View>

            <Switch
              value={candidateAlerts}
              onValueChange={setCandidateAlerts}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={candidateAlerts ? colors.primary : "#F4F4F5"}
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
            <View style={styles.switchTextArea}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Alertas de pagamento
              </Text>

              <Text
                style={[
                  styles.switchSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Avisar quando uma taxa ou transação for confirmada.
              </Text>
            </View>

            <Switch
              value={paymentAlerts}
              onValueChange={setPaymentAlerts}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={paymentAlerts ? colors.primary : "#F4F4F5"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Privacidade
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
            <View style={styles.switchTextArea}>
              <Text style={[styles.switchTitle, { color: theme.text }]}>
                Perfil visível
              </Text>

              <Text
                style={[
                  styles.switchSubtitle,
                  { color: theme.textSecondary },
                ]}
              >
                Permitir que freelancers visualizem informações básicas da
                empresa.
              </Text>
            </View>

            <Switch
              value={showCompanyProfile}
              onValueChange={setShowCompanyProfile}
              trackColor={{
                false: colors.border,
                true: "rgba(0,176,80,0.35)",
              }}
              thumbColor={showCompanyProfile ? colors.success : "#F4F4F5"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Segurança e conta
          </Text>

          <View style={styles.optionsArea}>
            {settingOptions.map((option) => {
              const Icon = option.Icon;

              return (
                <Pressable
                  key={option.id}
                  style={({ pressed }) => [
                    styles.optionCard,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.border,
                    },
                    pressed && styles.optionCardPressed,
                  ]}
                  onPress={option.action}
                >
                  <View style={styles.optionIconBox}>
                    <Icon width={24} height={24} />
                  </View>

                  <View style={styles.optionTextArea}>
                    <Text style={[styles.optionTitle, { color: theme.text }]}>
                      {option.title}
                    </Text>

                    <Text
                      style={[
                        styles.optionSubtitle,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {option.subtitle}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.optionArrow,
                      { color: theme.textSecondary },
                    ]}
                  >
                    ›
                  </Text>
                </Pressable>
              );
            })}
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
            LGPD e segurança
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            As preferências de privacidade ajudam a empresa a controlar
            notificações, visibilidade do perfil e segurança da conta.
          </Text>
        </View>

        <Pressable
          disabled={isSaving}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            isSaving && { opacity: 0.7 },
          ]}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Salvando..." : "Salvar configurações"}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Desconectar-se</Text>
        </Pressable>

        <Pressable
          disabled={isDeleting}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
            isDeleting && { opacity: 0.7 },
          ]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>
            {isDeleting ? "Excluindo..." : "Excluir conta da empresa"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
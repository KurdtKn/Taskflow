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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import LockIcon from "../../assets/icons/lock-icon.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import AssignmentIcon from "../../assets/icons/assignment.svg";

import { styles } from "@/app/styles/freelancerSettings";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

type SettingOption = {
  id: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<any>;
  action: () => void;
};

type FreelancerSettings = {
  availableForJobs: boolean;
  pushNotifications: boolean;
  newJobAlerts: boolean;
  messageAlerts: boolean;
  reviewAlerts: boolean;
  profileVisible: boolean;
};

export default function FreelancerSettingsScreen() {
  const [availableForJobs, setAvailableForJobs] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newJobAlerts, setNewJobAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isDark, toggleTheme, theme } = useTheme();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setIsLoading(true);

      /*
        Aqui futuramente entra a API para buscar configurações do usuário logado.

        Exemplo:
        const response = await userService.getFreelancerSettings();

        setAvailableForJobs(response.availableForJobs);
        setPushNotifications(response.pushNotifications);
        setNewJobAlerts(response.newJobAlerts);
        setMessageAlerts(response.messageAlerts);
        setReviewAlerts(response.reviewAlerts);
        setProfileVisible(response.profileVisible);

        Por enquanto mantemos os valores padrão da tela.
      */
    } catch (error) {
      console.log("Erro ao carregar configurações:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar suas configurações agora."
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
      subtitle: "Veja os termos de uso e política de privacidade",
      Icon: AssignmentIcon,
      action: () => router.push("/terms"),
    },
  ];

  function getCurrentSettings(): FreelancerSettings {
    return {
      availableForJobs,
      pushNotifications,
      newJobAlerts,
      messageAlerts,
      reviewAlerts,
      profileVisible,
    };
  }

  async function handleSaveSettings() {
    try {
      setIsSaving(true);

      const settings = getCurrentSettings();

      /*
        Aqui futuramente entra a API para salvar configurações.

        Exemplo:
        await userService.updateFreelancerSettings(settings);
      */

      console.log("Configurações salvas:", settings);

      Alert.alert(
        "Configurações salvas",
        "Suas preferências foram atualizadas com sucesso."
      );
    } catch (error) {
      console.log("Erro ao salvar configurações:", error);

      Alert.alert(
        "Erro",
        "Não foi possível salvar suas configurações agora."
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert("Desconectar-se", "Deseja realmente sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            /*
              Aqui futuramente vamos limpar a sessão/token.

              Exemplo:
              await authService.logout();
            */

            router.replace("/welcome");
          } catch (error) {
            console.log("Erro ao desconectar:", error);

            Alert.alert(
              "Erro",
              "Não foi possível sair da conta agora."
            );
          }
        },
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Excluir conta",
      "Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);

              /*
                Aqui futuramente entra a API para excluir conta.

                Exemplo:
                await userService.deleteMyAccount();
                await authService.logout();
              */

              Alert.alert(
                "Conta excluída",
                "Sua conta foi removida com sucesso.",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/welcome"),
                  },
                ]
              );
            } catch (error) {
              console.log("Erro ao excluir conta:", error);

              Alert.alert(
                "Erro",
                "Não foi possível excluir sua conta agora."
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
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

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
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
          <View style={styles.heroTextArea}>
            <Text style={[styles.heroLabel, { color: colors.primary }]}>
              Conta freelancer
            </Text>

            <Text style={[styles.heroTitle, { color: theme.text }]}>
              Preferências do perfil
            </Text>

            <Text style={[styles.heroText, { color: theme.textSecondary }]}>
              Gerencie notificações, disponibilidade, privacidade e segurança.
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
              Buscando suas preferências de conta.
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Disponibilidade
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
                Disponível para chamados
              </Text>

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
                Permitir que empresas encontrem seu perfil para serviços.
              </Text>
            </View>

            <Switch
              value={availableForJobs}
              onValueChange={setAvailableForJobs}
              trackColor={{
                false: colors.border,
                true: "rgba(0,176,80,0.35)",
              }}
              thumbColor={availableForJobs ? colors.success : "#F4F4F5"}
            />
          </View>
        </View>

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

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
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
            Escolha quais avisos deseja receber no TaskFlow.
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

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
                Receber alertas importantes no celular.
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
                Novos chamados
              </Text>

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
                Avisar quando uma empresa publicar um chamado próximo.
              </Text>
            </View>

            <Switch
              value={newJobAlerts}
              onValueChange={setNewJobAlerts}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={newJobAlerts ? colors.primary : "#F4F4F5"}
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
                Mensagens do chat
              </Text>

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
                Receber aviso quando uma empresa enviar mensagem.
              </Text>
            </View>

            <Switch
              value={messageAlerts}
              onValueChange={setMessageAlerts}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={messageAlerts ? colors.primary : "#F4F4F5"}
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
                Avaliações
              </Text>

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
                Avisar quando uma nova avaliação for recebida.
              </Text>
            </View>

            <Switch
              value={reviewAlerts}
              onValueChange={setReviewAlerts}
              trackColor={{
                false: colors.border,
                true: "rgba(11,87,208,0.35)",
              }}
              thumbColor={reviewAlerts ? colors.primary : "#F4F4F5"}
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

              <Text style={[styles.switchSubtitle, { color: theme.textSecondary }]}>
                Permitir que empresas vejam seu perfil, portfólio e avaliações.
              </Text>
            </View>

            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{
                false: colors.border,
                true: "rgba(0,176,80,0.35)",
              }}
              thumbColor={profileVisible ? colors.success : "#F4F4F5"}
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

                  <Text style={[styles.optionArrow, { color: theme.textSecondary }]}>
                    ›
                  </Text>
                </Pressable>
              );
            })}
          </View>
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
            {isDeleting ? "Excluindo..." : "Excluir conta"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
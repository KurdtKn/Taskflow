import type { ComponentType } from "react";
import { useState } from "react";
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

export default function FreelancerSettingsScreen() {
  const [availableForJobs, setAvailableForJobs] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newJobAlerts, setNewJobAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  const { isDark, toggleTheme, theme } = useTheme();

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

  function handleSaveSettings() {
    console.log({
      availableForJobs,
      pushNotifications,
      newJobAlerts,
      messageAlerts,
      reviewAlerts,
      profileVisible,
    });

    Alert.alert(
      "Configurações salvas",
      "Suas preferências foram atualizadas no protótipo.",
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
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
        onPress: () => router.replace("/welcome"),
      },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Excluir conta",
      "Essa ação é apenas visual no protótipo. Na versão final, a exclusão seguiria regras de segurança e LGPD.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Entendi",
          style: "destructive",
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
            <Text style={[styles.heroLabel, { color: theme.primary }]}>
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
            Controle de dados
          </Text>

          <Text style={[styles.infoText, { color: theme.textSecondary }]}>
            Na versão final, essa área permitirá controlar dados pessoais,
            permissões, privacidade e exclusão da conta conforme a LGPD.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Salvar configurações</Text>
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
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteText}>Excluir conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
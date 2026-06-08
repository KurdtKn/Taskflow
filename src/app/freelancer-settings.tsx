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
import { styles } from "@/app/styles/freelancerSettings";
import { colors } from "@/styles/colors";

type SettingOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
};

export default function FreelancerSettingsScreen() {
  const [availableForJobs, setAvailableForJobs] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newJobAlerts, setNewJobAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);
  const [reviewAlerts, setReviewAlerts] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);

  const settingOptions: SettingOption[] = [
    {
      id: "1",
      title: "Alterar senha",
      subtitle: "Atualize sua senha de acesso",
      icon: "🔐",
      action: () =>
        Alert.alert(
          "Alterar senha",
          "No protótipo, essa opção apenas simula a alteração de senha."
        ),
    },
    {
      id: "2",
      title: "Privacidade e segurança",
      subtitle: "Controle dados, permissões e segurança da conta",
      icon: "🛡️",
      action: () =>
        Alert.alert(
          "Privacidade e segurança",
          "Na versão final, essa área terá controle de dados, permissões e regras da LGPD."
        ),
    },
    {
      id: "3",
      title: "Termos e políticas",
      subtitle: "Veja os termos de uso e política de privacidade",
      icon: "📄",
      action: () =>
        Alert.alert(
          "Termos e políticas",
          "No protótipo, essa opção apenas representa os termos de uso e política de privacidade."
        ),
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Configurações</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View style={styles.heroTextArea}>
            <Text style={styles.heroLabel}>Conta freelancer</Text>
            <Text style={styles.heroTitle}>Preferências do perfil</Text>
            <Text style={styles.heroText}>
              Gerencie notificações, disponibilidade, privacidade e segurança.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <Text style={styles.heroIcon}>⚙️</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Disponibilidade</Text>

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Disponível para chamados</Text>
              <Text style={styles.switchSubtitle}>
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
          <Text style={styles.sectionTitle}>Notificações</Text>

          <Text style={styles.sectionSubtitle}>
            Escolha quais avisos deseja receber no TaskFlow.
          </Text>

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Notificações push</Text>
              <Text style={styles.switchSubtitle}>
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

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Novos chamados</Text>
              <Text style={styles.switchSubtitle}>
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

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Mensagens do chat</Text>
              <Text style={styles.switchSubtitle}>
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

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Avaliações</Text>
              <Text style={styles.switchSubtitle}>
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
          <Text style={styles.sectionTitle}>Privacidade</Text>

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Perfil visível</Text>
              <Text style={styles.switchSubtitle}>
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
          <Text style={styles.sectionTitle}>Segurança e conta</Text>

          <View style={styles.optionsArea}>
            {settingOptions.map((option) => (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.optionCard,
                  pressed && styles.optionCardPressed,
                ]}
                onPress={option.action}
              >
                <View style={styles.optionIconBox}>
                  <Text style={styles.optionIcon}>{option.icon}</Text>
                </View>

                <View style={styles.optionTextArea}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </View>

                <Text style={styles.optionArrow}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Controle de dados</Text>

          <Text style={styles.infoText}>
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
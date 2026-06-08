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
import { styles } from "@/app/styles/companySettings";
import { colors } from "@/styles/colors";

type SettingOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  action: () => void;
};

export default function CompanySettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [candidateAlerts, setCandidateAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [showCompanyProfile, setShowCompanyProfile] = useState(true);

  const settingOptions: SettingOption[] = [
    {
      id: "1",
      title: "Alterar senha",
      subtitle: "Atualize a senha de acesso da empresa",
      icon: "🔐",
      action: () => console.log("Alterar senha"),
    },
    {
      id: "2",
      title: "Privacidade e segurança",
      subtitle: "Gerencie dados, permissões e segurança da conta",
      icon: "🛡️",
      action: () => console.log("Abrir privacidade e segurança"),
    },
    {
      id: "3",
      title: "Termos e políticas",
      subtitle: "Veja regras de uso, privacidade e condições da plataforma",
      icon: "📄",
      action: () => router.push("/terms"),
    },
  ];

  function handleSaveSettings() {
    console.log({
      pushNotifications,
      emailNotifications,
      candidateAlerts,
      paymentAlerts,
      showCompanyProfile,
    });

    router.back();
  }

  function handleLogout() {
    router.replace("/welcome");
  }

  function handleDeleteAccount() {
    Alert.alert(
      "Excluir conta",
      "Essa ação é apenas visual no protótipo. Na versão final, a conta seria removida após confirmação de segurança.",
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
          <View>
            <Text style={styles.heroLabel}>Conta empresarial</Text>
            <Text style={styles.heroTitle}>Preferências da empresa</Text>
            <Text style={styles.heroText}>
              Configure notificações, privacidade, segurança e opções da conta.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <Text style={styles.heroIcon}>⚙️</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>

          <Text style={styles.sectionSubtitle}>
            Escolha quais avisos sua empresa deseja receber.
          </Text>

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Notificações push</Text>
              <Text style={styles.switchSubtitle}>
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

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Notificações por e-mail</Text>
              <Text style={styles.switchSubtitle}>
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

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Alertas de candidatos</Text>
              <Text style={styles.switchSubtitle}>
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

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Alertas de pagamento</Text>
              <Text style={styles.switchSubtitle}>
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
          <Text style={styles.sectionTitle}>Privacidade</Text>

          <View style={styles.switchCard}>
            <View style={styles.switchTextArea}>
              <Text style={styles.switchTitle}>Perfil visível</Text>
              <Text style={styles.switchSubtitle}>
                Permitir que freelancers visualizem informações básicas da empresa.
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
          <Text style={styles.infoTitle}>LGPD e segurança</Text>

          <Text style={styles.infoText}>
            Na versão final, essa área poderá controlar permissões, dados da
            empresa, exclusão de conta e preferências de privacidade.
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
          <Text style={styles.deleteText}>Excluir conta da empresa</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
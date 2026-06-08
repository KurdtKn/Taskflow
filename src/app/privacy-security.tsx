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
import CheckIcon from "../../assets/icons/check.svg";
import NotificationIcon from "../../assets/icons/notifications.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import SettingsIcon from "../../assets/icons/settings.svg";

import { colors } from "@/styles/colors";
import { styles } from "@/app/styles/privacySecurity";

export default function PrivacySecurityScreen() {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  function handleSaveSettings() {
    Alert.alert(
      "Configurações salvas",
      "Suas preferências de privacidade e segurança foram atualizadas."
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowBack width={28} height={28} />
        </Pressable>

        <Text style={styles.headerTitle}>Privacidade</Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Segurança</Text>
            <Text style={styles.heroTitle}>Controle seus dados</Text>
            <Text style={styles.heroText}>
              Gerencie visibilidade, localização e alertas importantes da sua conta.
            </Text>
          </View>

          <View style={styles.heroIconBox}>
            <LockIcon width={34} height={34} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidade da conta</Text>

          <View style={styles.switchCard}>
            <View style={styles.optionIconBox}>
              <CheckIcon width={22} height={22} />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>Perfil visível</Text>
              <Text style={styles.optionSubtitle}>
                Permite que outros usuários encontrem seu perfil na plataforma.
              </Text>
            </View>

            <Switch
              value={profileVisible}
              onValueChange={setProfileVisible}
              trackColor={{ false: colors.border, true: "rgba(11,87,208,0.35)" }}
              thumbColor={profileVisible ? colors.primary : "#F9FAFB"}
            />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.optionIconBox}>
              <LocationIcon width={22} height={22} />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>Compartilhar localização</Text>
              <Text style={styles.optionSubtitle}>
                Ajuda a exibir chamados próximos e melhorar recomendações.
              </Text>
            </View>

            <Switch
              value={showLocation}
              onValueChange={setShowLocation}
              trackColor={{ false: colors.border, true: "rgba(11,87,208,0.35)" }}
              thumbColor={showLocation ? colors.primary : "#F9FAFB"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas de segurança</Text>

          <View style={styles.switchCard}>
            <View style={styles.optionIconBox}>
              <NotificationIcon width={22} height={22} />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>Notificações importantes</Text>
              <Text style={styles.optionSubtitle}>
                Receba avisos sobre solicitações, mensagens e atualizações.
              </Text>
            </View>

            <Switch
              value={allowNotifications}
              onValueChange={setAllowNotifications}
              trackColor={{ false: colors.border, true: "rgba(11,87,208,0.35)" }}
              thumbColor={allowNotifications ? colors.primary : "#F9FAFB"}
            />
          </View>

          <View style={styles.switchCard}>
            <View style={styles.optionIconBox}>
              <SettingsIcon width={22} height={22} />
            </View>

            <View style={styles.optionTextArea}>
              <Text style={styles.optionTitle}>Alertas da conta</Text>
              <Text style={styles.optionSubtitle}>
                Avise quando houver alteração de senha, login ou dados sensíveis.
              </Text>
            </View>

            <Switch
              value={securityAlerts}
              onValueChange={setSecurityAlerts}
              trackColor={{ false: colors.border, true: "rgba(11,87,208,0.35)" }}
              thumbColor={securityAlerts ? colors.primary : "#F9FAFB"}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Como funciona no protótipo?</Text>
          <Text style={styles.infoText}>
            Nesta versão, as opções são visuais. Na integração final, essas
            preferências serão enviadas para a API e salvas no banco de dados.
          </Text>
        </View>

        <View style={styles.securityCard}>
          <Text style={styles.securityTitle}>Recursos de segurança</Text>

          <View style={styles.securityItem}>
            <Text style={styles.securityDot}>•</Text>
            <Text style={styles.securityText}>
              Chat liberado apenas após confirmação do fluxo.
            </Text>
          </View>

          <View style={styles.securityItem}>
            <Text style={styles.securityDot}>•</Text>
            <Text style={styles.securityText}>
              Avaliações entre empresa e freelancer após o serviço.
            </Text>
          </View>

          <View style={styles.securityItem}>
            <Text style={styles.securityDot}>•</Text>
            <Text style={styles.securityText}>
              Perfil com informações organizadas para aumentar a confiança.
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSaveSettings}
        >
          <Text style={styles.saveButtonText}>Salvar configurações</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
import {
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import ArrowBack from "../../assets/icons/arrow_back.svg";
import CheckIcon from "../../assets/icons/check.svg";
import WalletIcon from "../../assets/icons/wallet.svg";
import LocationIcon from "../../assets/icons/Location-check.svg";
import TimeIcon from "../../assets/icons/access_time.svg";

import { styles } from "@/app/styles/requestConfirmation";
import { colors } from "@/styles/colors";
import { useTheme } from "@/app/context/ThemeContext";

export default function RequestConfirmationScreen() {
  const params = useLocalSearchParams<{
    title?: string;
    price?: string;
    location?: string;
    time?: string;
  }>();

  const title = params.title ?? "Garçom para Evento";
  const price = params.price ?? "R$200,00";
  const location = params.location ?? "Centro";
  const time = params.time ?? "Hoje, 18:00";

  const { isDark, theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowBack width={28} height={28} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.successCircle}>
          <CheckIcon width={34} height={34} />
        </View>

        <Text style={[styles.title, { color: theme.text }]}>
          Solicitação enviada!
        </Text>

        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sua candidatura foi enviada para a empresa. Agora é só aguardar a
          análise do seu perfil.
        </Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.cardLabel, { color: theme.primary }]}>
            Chamado solicitado
          </Text>

          <Text style={[styles.cardTitle, { color: theme.text }]}>
            {title}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <WalletIcon width={18} height={18} />
            </View>

            <Text style={[styles.infoText, { color: theme.text }]}>
              {price}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <LocationIcon width={18} height={18} color={colors.location}/>
            </View>

            <Text style={[styles.infoText, { color: theme.text }]}>
              {location}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <TimeIcon width={18} height={18} />
            </View>

            <Text style={[styles.infoText, { color: theme.text }]}>
              {time}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.warningBox,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.warningText, { color: theme.textSecondary }]}>
            O chat será liberado somente após a empresa aceitar sua solicitação
            e confirmar o fluxo do chamado.
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.footer,
          { backgroundColor: theme.background },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.primaryButtonText}>Voltar para início</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push("/notifications")}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.text }]}>
            Ver notificações
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}